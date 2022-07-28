import { Box, Button, Typography, useTheme } from "@material-ui/core";
import { useMeeting, usePubSub } from "@videosdk.live/react-sdk";
import { useEffect, useRef, useState } from "react";
import {
  sideBarNestedModes,
  useMeetingAppContext,
} from "../../MeetingAppContextDef";
import { sleep } from "../../meetingContainer/hlsViewContainer/PlayerViewer";
import useResponsiveSize from "../../utils/useResponsiveSize";

export const usePollStateFromTimer = ({ timeout, createdAt, hasTimer }) => {
  const [isActive, setIsActive] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);

  const isActiveRef = useRef(isActive);

  const createdAtRef = useRef(new Date(createdAt));

  const check = async () => {
    if (
      createdAtRef.current.getTime() + timeout * 1000 >
      new Date().getTime()
    ) {
      if (!isActiveRef.current) {
        setIsActive(true);
      }

      setTimeLeft(
        (createdAtRef.current.getTime() +
          timeout * 1000 -
          new Date().getTime()) /
          1000
      );

      await sleep(1000);
      return await check();
    } else {
      setIsActive(false);
      setTimeLeft(0);
      return;
    }
  };

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useEffect(hasTimer ? check : () => {}, []);

  return { isActive, timeLeft };
};

export const secondsToMinutes = (time) => {
  var minutes = Math.floor((time % 3600) / 60)
    .toString()
    .padStart(2, "0");
  var seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return minutes + " : " + seconds;
};

const Poll = ({ poll, panelHeight, index, isDraft }) => {
  const theme = useTheme();

  const padding = useResponsiveSize({
    xl: 12,
    lg: 10,
    md: 8,
    sm: 6,
    xs: 4,
  });
  const marginY = useResponsiveSize({
    xl: 14,
    lg: 12,
    md: 10,
    sm: 8,
    xs: 6,
  });
  const { setIsCreateNewPollClicked, setSideBarNestedMode } =
    useMeetingAppContext();
  //   const mMeeting = useMeeting();
  //   const localParticipantId = mMeeting?.localParticipant?.id;
  //   const { publish } = usePubSub(`SUBMIT_A_POLL_${poll.id}`, {
  //     onMessageReceived: (message) => {
  //       console.log(message);
  //     },
  //     onOldMessagesReceived: (message) => {
  //       console.log(message);
  //     },
  //   });

  // const isSubmitted =
  //   poll?.submissions?.findIndex(({ participantId }) => {
  //     if (participantId === localParticipantId) {
  //       return true;
  //     }
  //   }) !== -1;

  const { publish: EndPublish } = usePubSub(`END_POLL`);
  const { publish: RemoveFromDraftPublish } = usePubSub(
    `REMOVE_POLL_FROM_DRAFT`
  );
  const { publish: publishCreatePoll } = usePubSub(`CREATE_POLL`);

  const { hasCorrectAnswer, hasTimer, timeout, createdAt } = poll;

  const { isActive: isTimerPollActive, timeLeft } = usePollStateFromTimer({
    timeout,
    createdAt,
    hasTimer,
  });

  const groupedSubmissionCount = poll?.submissions?.reduce(
    (group, { optionId }) => {
      group[optionId] = group[optionId] || 0;

      group[optionId] += 1;
      return group;
    },
    {}
  );

  const mMeeting = useMeeting();
  const localParticipantId = mMeeting?.localParticipant?.id;
  const localSubmittedOption = poll?.submissions?.find(
    ({ participantId }) => participantId === localParticipantId
  );

  const totalSubmissions = poll?.submissions?.length;

  useEffect(() => {
    if (!poll.isActive && timeLeft === 0) {
      EndPublish({ pollId: poll.id }, { persist: true });
    }
  }, [poll.isActive, timeLeft]);

  return (
    <Box
      style={{
        borderBottom: "1px solid #70707033",
      }}
    >
      <Box
        style={{
          margin: padding,
          marginTop: marginY,
          marginBottom: marginY,
        }}
      >
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            padding: 0,
            margin: 0,
          }}
        >
          <Typography
            style={{
              fontSize: 14,
              color: "#95959E",
              fontWeight: 500,
              marginTop: 0,
              marginBottom: 0,
            }}
          >{`Poll ${index + 1}`}</Typography>
          <p
            style={{
              marginLeft: 8,
              marginRight: 8,
              color: "#95959E",
              fontWeight: 500,
              marginTop: 0,
              marginBottom: 0,
            }}
          >
            &#x2022;
          </p>
          <Typography
            style={{
              fontSize: 14,
              color: "#FF5D5D",
              fontWeight: 500,
              marginTop: 0,
              marginBottom: 0,
            }}
          >
            {poll.isActive
              ? poll.timeout === 0
                ? "Live"
                : timeLeft === 0
                ? "Ended"
                : `Ended in ${secondsToMinutes(timeLeft)}`
              : isDraft
              ? "Drafted"
              : "Ended"}
          </Typography>
        </Box>
        <Box style={{ marginTop: 20 }}>
          <Typography style={{ fontSize: 16, color: "white", fontWeight: 600 }}>
            {poll.question}
          </Typography>
          {poll.options.map((item, j) => {
            const total = groupedSubmissionCount[item.optionId];
            const optionSubmittedByLocal =
              localSubmittedOption?.optionId === item.optionId;
            const percentage = (total / totalSubmissions) * 100;
            return (
              <Box style={{ marginTop: j === 0 ? 14 : 6 }}>
                <Typography
                  style={{
                    fontSize: 16,
                    color: "white",
                    fontWeight: 500,
                  }}
                >
                  {item.option}
                </Typography>
                <Box
                  style={{
                    marginTop: 4,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box
                    style={{
                      height: 6,
                      backgroundColor: "#3D3C4E",
                      borderRadius: 4,
                      display: "flex",
                      flex: 1,
                    }}
                  >
                    <Box
                      style={{
                        backgroundColor: item.isCorrect ? "#1178F8" : "#9E9DA6",
                        width: `${percentage}%`,
                        borderRadius: 4,
                      }}
                    ></Box>
                  </Box>

                  <Typography style={{ marginLeft: isDraft ? 52 : 24 }}>
                    {!isDraft && `${percentage}%`}
                  </Typography>
                </Box>
              </Box>
            );
          })}

          <Box
            style={{
              marginTop: 20,
              marginBottom: 20,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "flex-end",
            }}
          >
            {isDraft ? (
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  RemoveFromDraftPublish(
                    { pollId: poll.id },
                    { persist: true }
                  );
                  console.log("poll", poll);
                  publishCreatePoll(
                    {
                      id: poll.id,
                      question: poll.question,
                      options: poll.options,
                      // createdAt: new Date(),
                      timeout: poll.timeout,
                      hasTimer: poll.hasTimer,
                      hasCorrectAnswer: poll.hasCorrectAnswer,
                      isActive: true,
                    },
                    { persist: true }
                  );

                  // setIsCreateNewPollClicked(false);
                  setSideBarNestedMode(sideBarNestedModes.POLLS);
                }}
              >
                Launch
              </Button>
            ) : (
              poll.timeout === 0 &&
              poll.isActive && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    EndPublish(
                      {
                        pollId: poll.id,
                      },
                      { persist: true }
                    );
                  }}
                >
                  End the Poll
                </Button>
              )
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );

  //   return (
  //     <Box style={{ backgroundColor: isSubmitted ? "red" : "green" }}>
  //       <Typography>{poll.question}</Typography>
  //       {poll.options.map((option, i) => {
  //         return (
  //           <>
  //             <Typography>{option.option}</Typography>
  //             <Button
  //               onClick={() => {
  //                 publish({
  //                   optionId: option.id,
  //                   //   participantId: localParticipantId,
  //                 });
  //               }}
  //             >
  //               Submit
  //             </Button>
  //           </>
  //         );
  //       })}
  //     </Box>
  //   );
};

const PollList = ({ panelHeight }) => {
  const { polls, draftPolls } = useMeetingAppContext();
  const { setIsCreateNewPollClicked, setSideBarNestedMode } =
    useMeetingAppContext();
  const theme = useTheme();

  const padding = useResponsiveSize({
    xl: 12,
    lg: 10,
    md: 8,
    sm: 6,
    xs: 4,
  });
  const marginY = useResponsiveSize({
    xl: 14,
    lg: 12,
    md: 10,
    sm: 8,
    xs: 6,
  });

  return (
    <Box
      style={{
        height: panelHeight - 14,
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
          height: "100%",
        }}
      >
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          {draftPolls.map((poll, index) => {
            return (
              <Poll
                poll={poll}
                panelHeight={panelHeight}
                index={index}
                isDraft={true}
              />
            );
          })}
          {polls.map((poll, index) => {
            return <Poll poll={poll} panelHeight={panelHeight} index={index} />;
          })}
        </Box>
        <Box style={{ padding: padding }}>
          <Button
            variant="contained"
            style={{
              width: "100%",
              color: theme.palette.common.white,
              backgroundColor: theme.palette.primary.main,
            }}
            onClick={() => {
              // setIsCreateNewPollClicked(true);

              setSideBarNestedMode(sideBarNestedModes.CREATE_POLL);
            }}
          >
            Create new poll
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PollList;
