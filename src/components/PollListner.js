import { usePubSub } from "@videosdk.live/react-sdk";
import { useMeetingAppContext } from "../MeetingAppContextDef";

const PollListner = ({ poll }) => {
  const { setPolls } = useMeetingAppContext();

  usePubSub(`SUBMIT_A_POLL_${poll.id}`, {
    onMessageReceived: ({ message, senderId: participantId, timestamp }) => {
      console.log(message, participantId, timestamp, "onMessageReceived");
      setPolls((s) => {
        return s.map((_poll) => {
          if (poll.id === _poll.id) {
            return {
              ..._poll,
              submissions: [
                ..._poll.submissions,
                { optionId: message.optionId, participantId, timestamp },
              ],
            };
          } else {
            return _poll;
          }
        });
      });
    },
    onOldMessagesReceived: (messages) => {
      console.log(messages);
      const sortedMappedMessages = messages
        .sort((a, b) => {
          if (a.timestamp > b.timestamp) {
            return -1;
          }
          if (a.timestamp < b.timestamp) {
            return 1;
          }
          return 0;
        })
        .map(({ senderId: participantId, timestamp, message }) => {
          const { optionId } = message;

          return {
            optionId,
            participantId,
            timestamp,
          };
        });

      setPolls((s) => {
        return s.map((_poll) => {
          if (poll.id === _poll.id) {
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
  const { polls, setPolls, draftPolls, setDraftPolls } = useMeetingAppContext();
  usePubSub(`CREATE_POLL`, {
    onMessageReceived: ({ message }) => {
      console.log(message, "onMessageReceived");
      setPolls((s) => [...s, message]);
    },
    onOldMessagesReceived: (messages) => {
      console.log(messages, "onOldMessagesReceived");
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
        return { ...message, submissions: [] };
      });
      setPolls(newPolls);
    },
  });

  usePubSub(`END_POLL`, {
    onMessageReceived: ({ message }) => {
      console.log(message, "onMessageReceivedEndPOLL");
      setPolls((s) => {
        return s.map((_poll) => {
          if (message.pollId === _poll.id) {
            return { ..._poll, isActive: false };
          } else {
            return _poll;
          }
        });
      });
    },
    onOldMessagesReceived: (messages) => {
      setPolls((s) => {
        return s.map((_poll) => {
          const isEnded =
            messages.findIndex(({ message }) => {
              return message.pollId === _poll.id;
            }) !== -1;

          if (isEnded) {
            return { ..._poll, isActive: false };
          } else {
            return _poll;
          }
        });
      });
    },
  });

  usePubSub(`DRAFT_A_POLL`, {
    onMessageReceived: ({ message }) => {
      console.log(message, "DRAFT_A_POLL");
      setDraftPolls((s) => [...s, message]);
    },
    onOldMessagesReceived: (messages) => {
      console.log(messages);
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
      console.log(message, "REMOVE_POLL_FROM_DRAFT");
      setDraftPolls((s) => {
        return s.map((_poll) => {
          if (message.pollId === _poll.id) {
            return { ..._poll };
          } else {
            return _poll;
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
      {polls?.map((poll) => {
        return <PollListner poll={poll} />;
      })}
      {draftPolls?.map((poll) => {
        return <PollListner poll={poll} />;
      })}
    </>
  );
};

export default PollsListner;
