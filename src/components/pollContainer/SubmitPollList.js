import { Box, Typography } from "@material-ui/core";
import { useMeeting, usePubSub } from "@videosdk.live/react-sdk";
import React, { useState } from "react";
import AnswerSubmittedIcon from "../../icons/AnswerSubmittedIcon";
import CorrectSelectedIcon from "../../icons/CorrectSelectedIcon";
import WrongOptionSelectedIcon from "../../icons/WrongOptionSelectedIcon";
import { useMeetingAppContext } from "../../MeetingAppContextDef";
import useResponsiveSize from "../../utils/useResponsiveSize";
import { MarkCorrectCheckbox } from "./CreatePoll";
import { secondsToMinutes, usePollStateFromTimer } from "./PollList";

const SubmitPollListItem = ({ poll, panelHeight, index }) => {
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

  const mMeeting = useMeeting();
  const localParticipantId = mMeeting?.localParticipant?.id;
  const { publish } = usePubSub(`SUBMIT_A_POLL_${poll.id}`);

  const submittedOptions = poll?.submissions?.filter(({ participantId }) => {
    if (participantId === localParticipantId) {
      return true;
    }
  });

  const groupedSubmissionCount = poll?.submissions?.reduce(
    (group, { optionId }) => {
      group[optionId] = group[optionId] || 0;

      group[optionId] += 1;
      return group;
    },
    {}
  );

  const localSubmittedOption = poll?.submissions?.find(
    ({ participantId }) => participantId === localParticipantId
  );

  const totalSubmissions = poll?.submissions?.length;

  const { hasCorrectAnswer, hasTimer, timeout, createdAt } = poll;

  const { isActive: isTimerPollActive, timeLeft } = usePollStateFromTimer({
    timeout,
    createdAt,
    hasTimer,
  });

  console.log("poll", poll);

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
            {poll.timeout > 0
              ? !isTimerPollActive
                ? "Ended"
                : `Ended in ${secondsToMinutes(timeLeft)}`
              : poll.isActive
              ? "Live"
              : "Ended"}
          </Typography>
        </Box>
        <Box style={{ marginTop: 20 }}>
          <Typography style={{ fontSize: 16, color: "white", fontWeight: 600 }}>
            {poll.question}
          </Typography>
          <Box style={{ marginTop: 24 }}>
            {poll?.options.map((option) => {
              // const isSubmitted = poll?.submissions?.find(
              //   ({ participantId, optionId }) => {
              //     return (
              //       option.optionId === optionId &&
              //       participantId === localParticipantId
              //     );
              //   }
              // );
              const isSubmitted =
                poll?.submissions?.findIndex(({ participantId }) => {
                  if (participantId === localParticipantId) {
                    return true;
                  }
                }) !== -1;

              const total = groupedSubmissionCount[option.optionId];
              const optionSubmittedByLocal =
                localSubmittedOption?.optionId === option.optionId;
              const percentage = (total / totalSubmissions) * 100;

              return (
                <Box
                  style={{
                    display: "flex",
                    marginBottom: 12,
                  }}
                >
                  {isSubmitted || !isTimerPollActive ? (
                    <Box
                      style={{
                        marginTop: 0,
                        width: "100%",
                      }}
                    >
                      <Box style={{ display: "flex", alignItems: "center" }}>
                        <Typography
                          style={{
                            fontSize: 16,
                            color: "white",
                            fontWeight: 500,
                          }}
                        >
                          {option.option}
                        </Typography>
                        {optionSubmittedByLocal && poll.isActive && (
                          <Box style={{ marginLeft: 8 }}>
                            <AnswerSubmittedIcon />
                          </Box>
                        )}
                        {/* {optionSubmittedByLocal ? (
                          <Box style={{ marginLeft: 8 }}>
                            <WrongOptionSelectedIcon />
                          </Box>
                        ) : (
                          <Box style={{ marginLeft: 8 }}>
                            <CorrectSelectedIcon />
                          </Box>
                        )} */}
                      </Box>
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
                              backgroundColor: poll.isActive
                                ? "#9E9DA6"
                                : option.isCorrect && !poll.isActive
                                ? "#1178F8"
                                : "#9E9DA6",
                              width: `${percentage}%`,
                              borderRadius: 4,
                            }}
                          ></Box>
                        </Box>
                        <Typography
                          style={{ marginLeft: 24 }}
                        >{`${percentage}%`}</Typography>
                      </Box>
                    </Box>
                  ) : (
                    <>
                      <MarkCorrectCheckbox
                        onClick={() => {
                          publish(
                            { optionId: option.optionId },
                            { persist: true }
                          );
                        }}
                      />
                      <Box
                        style={{
                          marginLeft: 8,
                          backgroundColor: "#3D3C4E",
                          padding: "12px 12px 12px",
                          width: "100%",
                          borderRadius: "4px",
                        }}
                      >
                        <Typography>{option.option}</Typography>
                      </Box>
                    </>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const SubmitPollList = ({ panelHeight }) => {
  const { polls } = useMeetingAppContext();

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
          flex: 1,
          height: "100%",
        }}
      >
        {polls.map((poll, index) => {
          return (
            <SubmitPollListItem
              poll={poll}
              panelHeight={panelHeight}
              index={index}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default SubmitPollList;
