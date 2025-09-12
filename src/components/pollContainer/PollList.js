import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useMeeting, usePubSub } from "@videosdk.live/react-sdk";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  sideBarNestedModes,
  appThemes,
  useMeetingAppContext,
} from "../../MeetingAppContextDef";
import useResponsiveSize from "../../utils/useResponsiveSize";
import { v4 as uuid } from "uuid";
import { minWidth } from "@mui/system";

export const secondsToMinutes = (time) => {
  var minutes = Math.floor((time % 3600) / 60)
    .toString()
    .padStart(2, "0");
  var seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return minutes + " : " + seconds;
};

const Poll = ({ poll, isDraft, publishDraftPoll }) => {
  const timerIntervalRef = useRef();
  const { appTheme } = useMeetingAppContext();
  const theme = useTheme();

  // const classes = useStyles();

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

  const equalSpacing = useResponsiveSize({
    xl: 18,
    lg: 16,
    md: 14,
    sm: 12,
    xs: 10,
  });

  const { publish: EndPublish } = usePubSub(`END_POLL`);

  const { hasCorrectAnswer, hasTimer, timeout, createdAt, isActive, index } =
    poll;

  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerPollActive, setIsTimerPollActive] = useState(false);

  const [showResults, setShowResults] = useState(false);
  const [resultsReport, setResultsReport] = useState([]);

  const mMeeting = useMeeting();

  const localParticipantId = useMemo(
    () => mMeeting?.localParticipant?.id,
    [mMeeting]
  );

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
    const localSubmittedOption = poll?.submissions?.find(
      ({ participantId }) => participantId === localParticipantId
    );

    const totalSubmissions = poll?.submissions?.length || 0;

    const groupedSubmissionCount = poll?.submissions?.reduce(
      (group, { optionId }) => {
        group[optionId] = group[optionId] || 0;

        group[optionId] += 1;

        return group;
      },
      {}
    );

    const maxSubmittedOptions = [];

    const maxSubmittedOptionId =
      groupedSubmissionCount &&
      Object.keys(groupedSubmissionCount)
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

    groupedSubmissionCount &&
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

  const creatingSubmissionsReport = () => {
    const submissionsArray = poll?.submissions || [];
    const pollsOptions = poll?.options || [];

    // Store participant names in a Map
    const participantNameMap = new Map();

    if (showResults) {
      const report = submissionsArray.map((submission) => {
        // Retrieve the stored name or use the current name
        let participantName =
          submission.participantName ||
          participantNameMap.get(submission.participantId) ||
          "";

        // Store participant name if it's not already in the map
        if (submission.participantName) {
          participantNameMap.set(submission.participantId, participantName);
        }

        // Get the option selected
        const option = pollsOptions.find(
          (choice) => choice.optionId === submission.optionId
        );

        return {
          participantId: submission.participantId,
          participantName,
          optionId: option?.optionId,
          optionName: option?.option,
        };
      });

      setResultsReport(report);
    }
  };

  useEffect(() => {
    creatingSubmissionsReport();
  }, [showResults, poll]);

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

  function truncateText(text, wordLimit) {
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + " ...";
    }
    return text;
  }

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
          >{`Poll ${index || ""}`}</Typography>
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
              color: isPollActive || isDraft ? "#FF5D5D" : "#95959E",
              fontWeight: 500,
              marginTop: 0,
              marginBottom: 0,
            }}
          >
            {isPollActive
              ? hasTimer
                ? `Ends in ${secondsToMinutes(timeLeft)}`
                : "Live"
              : isDraft
                ? "Draft"
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
          {poll.options.map((item, j) => {
            const total = groupedSubmissionCount
              ? groupedSubmissionCount[item.optionId]
              : 0;

            const percentage = (total ? total / totalSubmissions : 0) * 100;

            const isCorrectOption = item.isCorrect;

            return (
              <Box
                style={{
                  marginTop: j === 0 ? equalSpacing : equalSpacing / 2,
                }}
              >
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
                  {item.option}
                </Typography>
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
                        backgroundColor: hasCorrectAnswer
                          ? isCorrectOption
                            ? appTheme === appThemes.LIGHT ||
                              appTheme === appThemes.DARK
                              ? theme.palette.lightTheme.primaryMain
                              : theme.palette.primary.main
                            : "#9E9DA6"
                          : maxSubmittedOptions.includes(item.optionId)
                            ? appTheme === appThemes.LIGHT ||
                              appTheme === appThemes.DARK
                              ? theme.palette.lightTheme.primaryMain
                              : theme.palette.primary.main
                            : "#9E9DA6",

                        // backgroundColor: item.isCorrect ? "#1178F8" : "#9E9DA6",
                        width: `${percentage}%`,
                        borderRadius: 4,
                      }}
                    ></Box>
                  </Box>

                  {!isDraft && (
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
                            appTheme === appThemes.LIGHT ?
                              theme.palette.lightTheme.contrastText : "white",
                        }}
                      >
                        {`${Math.floor(percentage)}%`}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            );
          })}

          <Box
            style={{
              // marginTop: equalSpacing,
              marginBottom: equalSpacing,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
            }}
          >
            {isDraft ? (
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  publishDraftPoll(poll);
                }}
                style={{
                  marginTop: equalSpacing + 2,
                  color:
                    appTheme === appThemes.LIGHT
                      ? theme.palette.lightTheme.contrastText
                      : "white",
                  borderColor:
                    appTheme === appThemes.LIGHT
                      ? theme.palette.lightTheme.contrastText
                      : "white",
                }}
              >
                Launch
              </Button>
            ) : null}

            <Button
              variant="outlined"
              size="small"
              style={{
                marginTop: equalSpacing + 2,
                color:
                  appTheme === appThemes.LIGHT
                    ? theme.palette.lightTheme.contrastText
                    : "white",
                borderColor:
                  appTheme === appThemes.LIGHT
                    ? theme.palette.lightTheme.contrastText
                    : "white",
              }}
              onClick={() => setShowResults(!showResults)}
            >
              {showResults ? "Hide Results" : "Show Results"}
            </Button>
            {isPollActive && !hasTimer ? (
              <Button
                variant="outlined"
                size="small"
                style={{
                  marginTop: equalSpacing + 2,
                  color:
                    appTheme === appThemes.LIGHT
                      ? theme.palette.lightTheme.contrastText
                      : "white",
                  borderColor:
                    appTheme === appThemes.LIGHT
                      ? theme.palette.lightTheme.contrastText
                      : "white",
                }}
                onClick={async () => {
                  try {
                    await EndPublish(
                      {
                        pollId: poll.id,
                      },
                      { persist: true }
                    );
                  } catch (error) {

                  }

                }}
              >
                End the Poll
              </Button>
            ) : null}
          </Box>
          {showResults === true ? (
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              <table style={{ width: "95%" }}>
                <TableHead>
                  <TableRow>
                    {/* <TableCell>Participant Id</TableCell> */}
                    <TableCell>Participant Name</TableCell>
                    <TableCell>Option</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {resultsReport?.map((row, item) => {
                    return (
                      <TableRow
                        key={item}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        {/* <TableCell>{row?.participantId}</TableCell> */}
                        <TableCell>
                          {/* {row?.participantName} */}
                          {row?.participantName.length > 5 ? (
                            <Tooltip title={row?.participantName} arrow>
                              {truncateText(row?.participantName, 5)}
                            </Tooltip>
                          ) : (
                            truncateText(row?.participantName, 5)
                          )}
                        </TableCell>
                        <TableCell>
                          {row?.optionName.length > 10 ? (
                            <Tooltip title={row?.optionName} arrow>
                              {truncateText(row?.optionName, 10)}
                            </Tooltip>
                          ) : (
                            truncateText(row?.optionName, 10)
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </table>
            </div>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
};

const PollList = ({ panelHeight }) => {
  const { setSideBarNestedMode, polls, draftPolls, appTheme } =
    useMeetingAppContext();

  const theme = useTheme();

  const { publish: RemoveFromDraftPublish } = usePubSub(
    `REMOVE_POLL_FROM_DRAFT`
  );
  const { publish: publishCreatePoll } = usePubSub(`CREATE_POLL`);

  const totalPolls = useMemo(() => polls?.length || 0, [polls]);

  const padding = useResponsiveSize({
    xl: 12,
    lg: 10,
    md: 8,
    sm: 6,
    xs: 4,
  });

  const equalSpacing = useResponsiveSize({
    xl: 18,
    lg: 16,
    md: 14,
    sm: 12,
    xs: 10,
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
                key={`draft_polls_${poll.id}`}
                poll={poll}
                panelHeight={panelHeight}
                index={index}
                isDraft={true}
                publishDraftPoll={async (poll) => {
                  //
                  try {
                    await RemoveFromDraftPublish(
                      { pollId: poll.id },
                      { persist: true }
                    );
                  } catch (error) {

                  }

                  //
                  try {
                    await publishCreatePoll(
                      {
                        id: uuid(),
                        question: poll.question,
                        options: poll.options,
                        // createdAt: new Date(),
                        timeout: poll.timeout,
                        hasTimer: poll.hasTimer,
                        hasCorrectAnswer: poll.hasCorrectAnswer,
                        isActive: true,
                        index: polls.length + 1,
                      },
                      { persist: true }
                    );
                  }catch(e){
                    
                  }

                  //
                  setSideBarNestedMode(sideBarNestedModes.POLLS);
                }}
              />
            );
          })}
          {polls.map((poll, index) => {
            return (
              <>
                <Poll
                  key={`creator_polls_${poll.id}`}
                  // totalPolls={totalPolls}
                  poll={poll}
                  panelHeight={panelHeight}
                  index={index}
                />
              </>
            );
          })}
        </Box>
        <Box
          style={{
            display: "flex",
            gap: "2",
            padding: padding,
            marginTop: equalSpacing,
          }}
        >
          <Button
            variant="contained"
            style={{
              width: "100%",
              color: theme.palette.common.white,
              backgroundColor:
                appTheme === appThemes.LIGHT || appTheme === appThemes.DARK
                  ? theme.palette.lightTheme.primaryMain
                  : theme.palette.primary.main,
              padding: "12px",
            }}
            onClick={() => {
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
