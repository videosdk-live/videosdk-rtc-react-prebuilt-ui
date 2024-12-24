import { usePubSub } from "@videosdk.live/react-sdk";
import { useSnackbar } from "notistack";
import {
  sideBarModes,
  sideBarNestedModes,
  useMeetingAppContext,
} from "../MeetingAppContextDef";

const PollListner = ({ pollId }) => {
  const { setCreatedPolls } = useMeetingAppContext();

  usePubSub(`SUBMIT_A_POLL_${pollId}`, {
    onMessageReceived: ({
      message,
      senderId: participantId,
      senderName: participantName,
      timestamp,
    }) => {
      setCreatedPolls((s) =>
        s.map((_poll) =>
          pollId === _poll.id
            ? {
                ..._poll,
                submissions: [
                  ..._poll.submissions,
                  {
                    optionId: message.optionId,
                    participantId,
                    participantName,
                    timestamp,
                  },
                ],
              }
            : _poll
        )
      );
    },
    onOldMessagesReceived: (messages) => {
      const sortedMappedMessages = messages
        // .sort((a, b) => {
        //   if (a.timestamp > b.timestamp) {
        //     return -1;
        //   }
        //   if (a.timestamp < b.timestamp) {
        //     return 1;
        //   }
        //   return 0;
        // })
        .map(
          ({
            senderId: participantId,
            timestamp,
            message,
            senderName: participantName,
          }) => {
            const { optionId } = message;

            return {
              participantName,
              optionId,
              participantId,
              participantName,
              timestamp,
            };
          }
        );

      setCreatedPolls((s) => {
        return s.map((_poll) => {
          if (pollId === _poll.id) {
            return { ..._poll, submissions: sortedMappedMessages };
          } else {
            return _poll;
          }
        });
      });
    },
  });

  return <></>;
};

const PollsListner = () => {
  const {
    polls,
    setPolls,
    draftPolls,
    setDraftPolls,
    setCreatedPolls,
    setEndedPolls,
    setSubmissions,
    notificationSoundEnabled,
    notificationAlertsEnabled,
    setSideBarMode,
    setSideBarNestedMode,
  } = useMeetingAppContext();

  const { enqueueSnackbar } = useSnackbar();

  usePubSub(`CREATE_POLL`, {
    onMessageReceived: ({ message, timestamp }) => {
      // setPolls((s) => [
      //   ...s,
      //   { ...message, createdAt: timestamp, submissions: [] },
      // ]);

      setCreatedPolls((s) => [
        { ...message, createdAt: timestamp, submissions: [] },
        ...s,
      ]);

      if (notificationSoundEnabled) {
        new Audio(
          `https://static.videosdk.live/prebuilt/notification.mp3`
        ).play();
      }

      if (notificationAlertsEnabled) {
        enqueueSnackbar("New Poll Asked 📊");
        setSideBarMode(sideBarModes.ACTIVITIES);
        setSideBarNestedMode(sideBarNestedModes.POLLS);
      }
    },
    onOldMessagesReceived: (messages) => {
      // const sortedMessage = messages.sort((a, b) => {
      //   if (a.timestamp > b.timestamp) {
      //     return -1;
      //   }
      //   if (a.timestamp < b.timestamp) {
      //     return 1;
      //   }
      //   return 0;
      // });
      // const newPolls =sortedMessage.map(({ message, timestamp }) => {
      //   return { ...message, createdAt: timestamp };
      // });

      // setPolls(newPolls);

      setCreatedPolls((s) => [
        ...s,
        ...messages
          .sort((a, b) =>
            a.timestamp > b.timestamp ? -1 : a.timestamp < b.timestamp ? 1 : 0
          )
          .map(({ message, timestamp }) => ({
            ...message,
            createdAt: timestamp,
            submissions: [],
          })),
      ]);
    },
  });

  usePubSub(`END_POLL`, {
    onMessageReceived: ({ message }) => {
      setEndedPolls((s) => [...s, { pollId: message.pollId }]);

      // console.log("END_POLL message onMessageReceived", message);
      // setPolls((s) => {
      //   return s.map((_poll) => {
      //     console.log(message.pollId, _poll.id);
      //     if (message.pollId === _poll.id) {
      //       return { ..._poll, isActive: false };
      //     } else {
      //       return _poll;
      //     }
      //   });
      // });
    },
    onOldMessagesReceived: (messages) => {
      setEndedPolls((s) => [
        ...s,
        ...messages.map(({ message }) => ({ pollId: message.pollId })),
      ]);

      // console.log("message onOldMessagesReceived", messages);
      // setPolls((s) => {
      //   return s.map((_poll) => {
      //     const isEnded =
      //       messages.findIndex(({ message }) => {
      //         return message.pollId === _poll.id;
      //       }) !== -1;

      //     if (isEnded) {
      //       return { ..._poll, isActive: false };
      //     } else {
      //       return _poll;
      //     }
      //   });
      // });
    },
  });

  usePubSub(`DRAFT_A_POLL`, {
    onMessageReceived: ({ message }) => {
      setDraftPolls((s) => [...s, message]);
    },
    onOldMessagesReceived: (messages) => {
      const sortedMessage = messages.sort((a, b) => {
        if (a.timestamp > b.timestamp) {
          return -1;
        }
        if (a.timestamp < b.timestamp) {
          return 1;
        }
        return 0;
      });
      const newPolls = sortedMessage.map(({ message }) => {
        return { ...message };
      });
      setDraftPolls(newPolls);
    },
  });

  usePubSub(`REMOVE_POLL_FROM_DRAFT`, {
    onMessageReceived: ({ message }) => {
      setDraftPolls((s) => {
        return s.filter((_poll) => {
          if (message.pollId === _poll.id) {
            return false;
          } else {
            return true;
          }
        });
      });
    },
    onOldMessagesReceived: (messages) => {
      setDraftPolls((s) =>
        s.filter(
          (_poll) =>
            messages.findIndex(({ message }) => {
              return message.pollId === _poll.id;
            }) === -1
        )
      );
    },
  });

  return (
    <>
      {polls?.map((poll) => (
        <PollListner key={`poll_listner_${poll.id}`} pollId={poll.id} />
      ))}
      {/* {draftPolls?.map((poll) => {
        return <PollListner poll={poll} />;
      })} */}
    </>
  );
};

export default PollsListner;
