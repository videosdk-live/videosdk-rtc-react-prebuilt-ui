import { Box, Tooltip, Typography, useTheme } from "@material-ui/core";
import { useMeeting, usePubSub } from "@videosdk.live/react-sdk";
import React, { useMemo, useRef, useState, useEffect } from "react";
import AnswerSubmittedIcon from "../../icons/AnswerSubmittedIcon";
import CorrectSelectedIcon from "../../icons/CorrectSelectedIcon";
import NoPollActiveIcon from "../../icons/NoPollActiveIcon";
import WrongOptionSelectedIcon from "../../icons/WrongOptionSelectedIcon";
import { appThemes, useMeetingAppContext } from "../../MeetingAppContextDef";
import useResponsiveSize from "../../utils/useResponsiveSize";
import { MarkCorrectCheckbox } from "./CreatePoll";
import { secondsToMinutes } from "./PollList";

const SubmitPollListItem = ({ poll }) => {
  const timerIntervalRef = useRef();
  const theme = useTheme();
  const { appTheme } = useMeetingAppContext();

  const padding = useResponsiveSize({
    xl: 12,
    lg: 16,
    md: 8,
    sm: 6,
    xs: 4,
  });
  const marginY = useResponsiveSize({
    xl: 18,
    lg: 16,
    md: 14,
    sm: 12,
    xs: 10,
  });

  const mMeeting = useMeeting();

  const localParticipantId = useMemo(
    () => mMeeting?.localParticipant?.id,
    [mMeeting]
  );

  const { publish } = usePubSub(`SUBMIT_A_POLL_${poll.id}`);

  const { hasCorrectAnswer, hasTimer, timeout, createdAt, isActive, index } =
    poll;

  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerPollActive, setIsTimerPollActive] = useState(false);

  const isPollActive = useMemo(
    () => (hasTimer ? isTimerPollActive : isActive),
    [hasTimer, isTimerPollActive, isActive]
  );

  const {
    localSubmittedOption,
    totalSubmissions,
    groupedSubmissionCount,
    maxSubmittedOptions,
  } = useMemo(() => {
    const localSubmittedOption = poll.submissions.find(
      ({ participantId }) => participantId === localParticipantId
    );

    const totalSubmissions = poll.submissions.length;

    const groupedSubmissionCount = poll.submissions.reduce(
      (group, { optionId }) => {
        group[optionId] = group[optionId] || 0;

        group[optionId] += 1;

        return group;
      },
      {}
    );

    const maxSubmittedOptions = [];

    const maxSubmittedOptionId = Object.keys(groupedSubmissionCount)
      .map((optionId) => ({
        optionId,
        count: groupedSubmissionCount[optionId],
      }))
      .sort((a, b) => {
        if (a.count > b.count) {
          return -1;
        }
        if (a.count < b.count) {
          return 1;
        }
        return 0;
      })[0]?.optionId;

    Object.keys(groupedSubmissionCount).forEach((optionId) => {
      if (
        groupedSubmissionCount[optionId] ===
        groupedSubmissionCount[maxSubmittedOptionId]
      ) {
        maxSubmittedOptions.push(optionId);
      }
    });

    return {
      localSubmittedOption,
      totalSubmissions,
      groupedSubmissionCount,
      maxSubmittedOptions,
    };
  }, [poll, localParticipantId]);

  const checkTimeOver = ({ timeout, createdAt }) =>
    !(new Date(createdAt).getTime() + timeout * 1000 > new Date().getTime());

  const updateTimer = ({ timeout, createdAt }) => {
    if (checkTimeOver({ timeout, createdAt })) {
      setTimeLeft(0);
      setIsTimerPollActive(false);
      clearInterval(timerIntervalRef.current);
    } else {
      setTimeLeft(
        (new Date(createdAt).getTime() +
          timeout * 1000 -
          new Date().getTime()) /
          1000
      );
      setIsTimerPollActive(true);
    }
  };

  useEffect(() => {
    if (hasTimer) {
      updateTimer({ timeout, createdAt });

      if (!checkTimeOver({ timeout, createdAt })) {
        timerIntervalRef.current = setInterval(() => {
          updateTimer({ timeout, createdAt });
        }, 1000);
      }
    }

    return () => {
      clearInterval(timerIntervalRef.current);
    };
  }, []);

  return (
    <Box style={{ borderBottom: "1px solid #70707033" }}>
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
          >{`Poll ${index}`}</Typography>
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
              color: isPollActive ? "#FF5D5D" : "#95959E",
              fontWeight: 500,
              marginTop: 0,
              marginBottom: 0,
            }}
          >
            {isPollActive
              ? hasTimer
                ? `Ends in ${secondsToMinutes(timeLeft)}`
                : "Live"
              : "Ended"}
          </Typography>
        </Box>
        <Box style={{ marginTop: 16 }}>
          <Typography
            style={{
              fontSize: 16,
              color:
                appTheme === appThemes.LIGHT
                  ? theme.palette.lightTheme.contrastText
                  : "white",
              fontWeight: 600,
            }}
          >
            {poll.question}
          </Typography>
          <Box style={{ marginTop: 16 }}>
            {localSubmittedOption || !isPollActive
              ? poll.options.map((option) => {
                  const total = groupedSubmissionCount[option.optionId];

                  const isOptionSubmittedByLocal =
                    localSubmittedOption?.optionId === option.optionId;

                  const percentage =
                    (total ? total / totalSubmissions : 0) * 100;

                  const isOptionSelectedByLocalIncorrect =
                    localSubmittedOption?.optionId === option.optionId &&
                    !option.isCorrect;

                  const isCorrectOption = option.isCorrect;

                  return (
                    <Box
                      style={{
                        display: "flex",
                        marginBottom: 12,
                      }}
                    >
                      <Box
                        style={{
                          marginTop: 0,
                          width: "100%",
                        }}
                      >
                        <Box style={{ display: "flex", alignItems: "center" }}>
                          <Typography
                            style={{
                              fontSize: 15,
                              color:
                                appTheme === appThemes.LIGHT
                                  ? theme.palette.lightTheme.contrastText
                                  : "white",
                              fontWeight: 400,
                            }}
                          >
                            {option.option}
                          </Typography>

                          {isPollActive ? (
                            isOptionSubmittedByLocal ? (
                              <Box style={{ marginLeft: 8 }}>
                                <AnswerSubmittedIcon />
                              </Box>
                            ) : null
                          ) : hasCorrectAnswer ? (
                            isCorrectOption ? (
                              <Tooltip
                                placement="right"
                                title={"Correct Answer"}
                              >
                                <Box
                                  style={{
                                    marginLeft: 8,
                                    cursor: "pointer",
                                  }}
                                >
                                  <CorrectSelectedIcon />
                                </Box>
                              </Tooltip>
                            ) : isOptionSelectedByLocalIncorrect ? (
                              <Tooltip
                                placement="right"
                                title={"Your answer is wrong"}
                              >
                                <Box
                                  style={{
                                    marginLeft: 8,
                                    cursor: "pointer",
                                  }}
                                >
                                  <WrongOptionSelectedIcon />
                                </Box>
                              </Tooltip>
                            ) : null
                          ) : null}
                        </Box>
                        <Box
                          style={{
                            marginTop: 0,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Box
                            style={{
                              height: 6,
                              backgroundColor:
                                appTheme === appThemes.DARK
                                  ? theme.palette.darkTheme.seven
                                  : appTheme === appThemes.LIGHT
                                  ? theme.palette.lightTheme.three
                                  : theme.palette.common.sidePanel,
                              borderRadius: 4,
                              display: "flex",
                              flex: 1,
                            }}
                          >
                            <Box
                              style={{
                                backgroundColor:
                                  hasCorrectAnswer && isActive
                                    ? isCorrectOption
                                      ? appTheme === appThemes.LIGHT ||
                                        appTheme === appThemes.DARK
                                        ? theme.palette.lightTheme.primaryMain
                                        : theme.palette.primary.main
                                      : "#9E9DA6"
                                    : maxSubmittedOptions.includes(
                                        option.optionId
                                      )
                                    ? appTheme === appThemes.LIGHT ||
                                      appTheme === appThemes.DARK
                                      ? theme.palette.lightTheme.primaryMain
                                      : theme.palette.primary.main
                                    : "#9E9DA6",
                                width: `${percentage}%`,
                                borderRadius: 4,
                              }}
                            ></Box>
                          </Box>
                          <Box
                            style={{
                              marginLeft: 24,
                              width: 40,
                              display: "flex",
                              alignItems: "flex-end",
                              justifyContent: "flex-end",
                            }}
                          >
                            <Typography
                              style={{
                                margin: 0,
                                padding: 0,
                                color:
                                  appTheme === appThemes.LIGHT
                                    ? theme.palette.lightTheme.contrastText
                                    : "white",
                              }}
                            >
                              {`${Math.floor(percentage)}%`}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  );
                })
              : poll?.options.map((option) => {
                  return (
                    <Box
                      style={{
                        display: "flex",
                        marginBottom: 12,
                      }}
                    >
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
                          backgroundColor:
                            appTheme === appThemes.DARK
                              ? theme.palette.darkTheme.seven
                              : appTheme === appThemes.LIGHT
                              ? theme.palette.lightTheme.three
                              : theme.palette.common.sidePanel,
                          padding: "8px 8px 8px",
                          width: "100%",
                          borderRadius: "4px",
                        }}
                      >
                        <Typography
                          style={{
                            color:
                              appTheme === appThemes.LIGHT &&
                              theme.palette.lightTheme.contrastText,
                          }}
                        >
                          {option.option}
                        </Typography>
                      </Box>
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
        {polls.length > 0 ? (
          polls.map((poll, index) => {
            return (
              <SubmitPollListItem
                key={`submit_polls_${poll.id}`}
                totalPolls={polls.length}
                poll={poll}
                panelHeight={panelHeight}
                index={index}
              />
            );
          })
        ) : (
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              marginTop: "-50px",
            }}
          >
            <NoPollActiveIcon />
            <Typography
              style={{ color: "white", fontSize: 16, fontWeight: 700 }}
            >
              No Poll has been launched yet.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SubmitPollList;
