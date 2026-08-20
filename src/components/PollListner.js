import { usePubSub } from "@videosdk.live/react-sdk";
import { useSnackbar } from "notistack";
import {
  sideBarModes,
  sideBarNestedModes,
  useMeetingAppContext,
} from "../MeetingAppContextDef";
import { useRef } from "react";

const PollListner = ({ pollId }) => {
  const { setCreatedPolls } = useMeetingAppContext();
  usePubSub(`SUBMIT_A_POLL_${pollId}`, {
    onMessageReceived: ({
      payload,
      senderId: participantId,
      senderName: participantName,
      timestamp,
    }) => {
      const { optionId } = payload;
      setCreatedPolls((s) =>
        s.map((_poll) =>
          pollId === _poll.id
            ? {
                ..._poll,
                submissions: [
                  ..._poll.submissions,
                  {
                    optionId: optionId,
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
      const sortedMappedMessages = messages.map(
        ({
          senderId: participantId,
          timestamp,
          payload,
          senderName: participantName,
        }) => {
          const { optionId } = payload;

          return {
            participantName,
            optionId,
            participantId,
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
  const notificationAudioRef = useRef(null);
  const isPlayingRef = useRef(false);
  const playNotification = () => {
    if (isPlayingRef.current) return;
    if (!notificationAudioRef.current) {
      // First time — fetch from CDN and store it
      notificationAudioRef.current = new Audio(
        `https://static.videosdk.live/prebuilt/notification.mp3`
      );
    }
    isPlayingRef.current = true;
    notificationAudioRef.current.currentTime = 0;
    notificationAudioRef.current.play().catch(() => {
      isPlayingRef.current = false;
    });
    notificationAudioRef.current.onended = () => {
      isPlayingRef.current = false;
    };
  };
  usePubSub(`CREATE_POLL`, {
    onMessageReceived: ({ payload, timestamp }) => {
      setCreatedPolls((s) => [
        { ...payload, createdAt: timestamp, submissions: [] },
        ...s,
      ]);

      if (notificationSoundEnabled) {
        // new Audio(
        //   `https://static.videosdk.live/prebuilt/notification.mp3`,
        // ).play();
        playNotification();
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
          .map(({ payload, timestamp }) => ({
            ...payload,
            createdAt: timestamp,
            submissions: [],
          })),
      ]);
    },
  });

  usePubSub(`END_POLL`, {
    onMessageReceived: ({ payload }) => {
      const { pollId } = payload;
      setEndedPolls((s) => [...s, { pollId }]);
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
        ...messages.map(({ payload }) => {
          const { pollId } = payload;
          return { pollId };
        }),
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
    onMessageReceived: ({ payload }) => {
      setDraftPolls((s) => [...s, payload]);
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
      const newPolls = sortedMessage.map(({ payload }) => {
        return { ...payload };
      });
      setDraftPolls(newPolls);
    },
  });

  usePubSub(`REMOVE_POLL_FROM_DRAFT`, {
    onMessageReceived: ({ payload }) => {
      const { pollId } = payload;
      setDraftPolls((s) => {
        return s.filter((_poll) => {
          if (pollId === _poll.id) {
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
            messages.findIndex(({ payload }) => {
              const { pollId } = payload;
              return pollId === _poll.id;
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
