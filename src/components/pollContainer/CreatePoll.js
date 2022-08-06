import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  makeStyles,
  MenuItem,
  Radio,
  Select,
  styled,
  TextField,
  Typography,
  useTheme,
} from "@material-ui/core";
import { useMemo, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import useResponsiveSize from "../../utils/useResponsiveSize";
import { usePubSub } from "@videosdk.live/react-sdk";
import {
  sideBarNestedModes,
  useMeetingAppContext,
} from "../../MeetingAppContextDef";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles(() => ({
  textField: {
    borderRadius: "4px",
    color: "white",
    fontWeight: 400,
  },

  textFieldRoot: {
    "& .MuiInputBase-input": {
      fontSize: "16px",
      fontWeight: 400,
    },
  },

  root: {
    "& .MuiFilledInput-input": {
      padding: "12px 12px 12px",
    },
    borderRadius: "4px",
  },

  checkbox1: {
    "&$checked": {
      color: "#1178F8",
    },
  },

  selectRoot: {
    "& .MuiInputBase-input ": {
      padding: "0px 24px 0px 0",
    },
  },

  iconbutton: {
    "&:hover ": {
      background: "transparent",
    },
  },
  iconContainer: {
    "&:hover $icon": {
      color: "white",
      background: "transparent",
    },
  },

  icon: {
    color: "#9FA0A7",
    background: "transparent",
  },

  checkbox: {
    "&. .MuiCheckbox-colorSecondary": {
      color: "#1178F8",
    },
    "& .MuiCheckbox-colorSecondary.Mui-checked ": {
      backgroundColor: "#1178F8",
      color: "#1178F8",
    },
    "& .Mui-checked": {
      backgroundColor: "#1178F8",
      color: "#1178F8",
    },
    "& .MuiCheckbox-root": {
      color: "#fff",
    },
  },
}));

const BpIcon = styled("span")(({ theme }) => ({
  borderRadius: 3,
  padding: 0,
  margin: 0,
  width: 16,
  height: 16,
  border: `2px solid ${theme.palette.text.secondary}`,
  "input:disabled ~ &": {
    boxShadow: "none",
    background: theme.palette.text.secondary,
  },
}));

const MarkCorrectIcon = styled("span")(({ theme }) => ({
  borderRadius: 12,
  padding: 0,
  margin: 0,
  width: 16,
  height: 16,
  border: `2px solid ${theme.palette.text.secondary}`,
  "input:disabled ~ &": {
    boxShadow: "none",
    background: theme.palette.text.secondary,
  },
}));

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: "#1178F8",
  border: "2px solid #1178F8",
  "&:before": {
    display: "block",
    width: 16,
    height: 16,
    backgroundImage:
      "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
      " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
      "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
    content: '""',
  },
});

const MarkCorrectCheckedIcon = styled(MarkCorrectIcon)({
  backgroundColor: "#1178F8",
  border: "2px solid #1178F8",
  "&:before": {
    display: "block",
    width: 16,
    height: 16,
    backgroundImage:
      "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
      " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
      "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
    content: '""',
  },
});

function BpCheckbox(CheckboxProps) {
  return (
    <Checkbox
      disableRipple
      disableFocusRipple
      color="default"
      checkedIcon={<BpCheckedIcon />}
      icon={<BpIcon />}
      style={{
        paddingTop: 0,
        paddingBottom: 0,
        marginTop: 0,
        marginBottom: 0,
        backgroundColor: "transparent",
      }}
      {...CheckboxProps}
    />
  );
}

export function MarkCorrectCheckbox(CheckboxProps) {
  return (
    <Radio
      disableRipple
      disableFocusRipple
      color="default"
      checkedIcon={<MarkCorrectCheckedIcon />}
      icon={<MarkCorrectIcon />}
      style={{
        padding: 0,
        margin: 0,
        backgroundColor: "transparent",
      }}
      {...CheckboxProps}
    />
  );
}

const CreatePollPart = ({
  classes,
  isMarkAsCorrectChecked,
  setIsMarkAsCorrectChecked,
  isSetTimerChecked,
  setIsSetTimerChecked,
  question,
  setQuestion,
  questionErr,
  option,
  setOption,
  options,
  setOptions,
  setTimer,
  _handleKeyDown,
  padding,
  timer,
  timerErr,
  correctAnswerErr,
  minOptionErr,
  optionErr,
}) => {
  const createOptionRef = useRef(null);
  //for timer
  const pollTimerArr = useMemo(() => {
    const pollTimerArr = [{ value: 30, Label: "30 secs" }];
    for (let i = 1; i < 11; i++) {
      pollTimerArr.push({
        value: i * 60,
        Label: `${i} min${i === 1 ? "" : "s"}`,
      });
    }
    return pollTimerArr;
  }, []);

  const focusCreateOption = () => {
    setTimeout(() => {
      createOptionRef.current.focus();
    }, 500);
  };

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        margin: padding,
        overflowY: "auto",
      }}
    >
      <TextField
        variant="standard"
        style={{ width: "100%", borderBottom: "1px solid #3D3C4E" }}
        placeholder="What you want to ask ?"
        autoFocus
        InputProps={{
          classes: {
            root: classes.textFieldRoot,
          },
        }}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      {questionErr && (
        <Box style={{ marginTop: 2 }}>
          <Typography style={{ color: "#E03B34", fontSize: 12 }}>
            Please enter proper question.
          </Typography>
        </Box>
      )}

      <Box style={{ marginTop: 24 }}>
        {/* option list  */}
        <Box>
          {options.length > 0 && (
            <Box>
              {options.map((item) => {
                return (
                  <Box style={{ display: "flex", marginBottom: 16 }}>
                    {isMarkAsCorrectChecked && item.option.length != 0 && (
                      <MarkCorrectCheckbox
                        value={item.isCorrect}
                        checked={item.isCorrect === true}
                        onChange={() => {
                          setOptions(
                            options.map((option) => {
                              if (option.optionId === item.optionId) {
                                option.isCorrect = !option.isCorrect;
                              } else {
                                option.isCorrect = false;
                              }
                              return option;
                            })
                          );
                        }}
                      />
                    )}
                    <TextField
                      placeholder="Add your options"
                      fullWidth
                      variant="filled"
                      autocomplete="off"
                      value={item.option}
                      onBlur={_handleKeyDown}
                      onChange={(e) => {
                        setOptions(
                          options.map((option) => {
                            if (option.optionId === item.optionId) {
                              option.option = e.target.value;
                              if (e.target.value === "" && item.isCorrect) {
                                option.isCorrect = false;
                              }
                            }
                            return option;
                          })
                        );
                      }}
                      className={classes.root}
                      style={{
                        marginLeft: isMarkAsCorrectChecked ? 8 : 0,
                        backgroundColor:
                          item.isCorrect && item.option !== ""
                            ? "#1178F8"
                            : "#3D3C4E",
                      }}
                      InputProps={{
                        disableUnderline: true,
                        classes: {
                          root: classes.textField,
                        },
                        endAdornment: (
                          <IconButton
                            onClick={() => {
                              setOptions((options) => {
                                const newOptions = options.filter(
                                  ({ optionId }) => {
                                    return optionId !== item.optionId;
                                  }
                                );
                                return newOptions;
                              });
                            }}
                            disableFocusRipple
                            disableRipple
                            disableTouchRipple
                            className={classes.iconbutton}
                            classes={{
                              root: classes.iconContainer,
                            }}
                            style={{ padding: 0, margin: 0 }}
                          >
                            <CloseIcon
                              fontSize={"small"}
                              className={classes.icon}
                            />
                          </IconButton>
                        ),
                      }}
                    />
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>
        {/* end of option list */}

        <Box>
          {/* old Text */}
          <Box style={{ display: "flex" }}>
            {isMarkAsCorrectChecked && option.option && (
              <MarkCorrectCheckbox
                value={option.isCorrect}
                checked={option.isCorrect === true}
                onChange={(e) => {
                  setOptions((options) => {
                    return [
                      ...options.map((option) => {
                        return { ...option, isCorrect: false };
                      }),
                      {
                        ...option,
                        isCorrect: e.target.checked,
                      },
                    ];
                  });

                  setOption({
                    option: "",
                    isCorrect: false,
                  });
                }}
              />
            )}
            <TextField
              placeholder="Add your options"
              inputRef={createOptionRef}
              fullWidth
              variant="filled"
              autocomplete="off"
              value={option.option}
              onChange={(e) =>
                setOption({
                  optionId: uuid(),
                  option: e.target.value,
                  isCorrect: !!option.isCorrect,
                })
              }
              onKeyDown={_handleKeyDown}
              onBlur={_handleKeyDown}
              className={classes.root}
              style={{
                marginLeft: isMarkAsCorrectChecked && option.option ? 8 : 0,
                backgroundColor:
                  option.isCorrect && option.option ? "#1178F8" : "#3D3C4E",
              }}
              InputProps={{
                disableUnderline: true,
                classes: {
                  root: classes.textField,
                },
              }}
            />
          </Box>
          {/* end of old Text */}

          {/* dummy Text */}
          {option?.option?.length > 0 && (
            <Box style={{ display: "flex" }}>
              <TextField
                placeholder="Add your options"
                fullWidth
                variant="filled"
                autocomplete="off"
                onChange={(e) => {}}
                onFocus={(e) => {
                  _handleKeyDown(e);
                  focusCreateOption();
                  // e.preventDefault();
                  // setOptions([...options, option]);
                  // setOption({ option: "", isCorrect: false });

                  // setTimeout(() => {
                  //   createOptionRef.current.focus();
                  // }, 1000);
                }}
                className={classes.root}
                style={{
                  marginLeft: 0,
                  marginTop: 16,
                }}
                InputProps={{
                  disableUnderline: true,
                  classes: {
                    root: classes.textField,
                  },
                }}
              />
            </Box>
          )}
          {/* end of dummy Text */}

          {minOptionErr && (
            <Typography
              style={{ fontSize: 12, color: "#E03B34", marginTop: 4 }}
            >
              Please add atleast 2 options.
            </Typography>
          )}
          {optionErr && (
            <Typography
              style={{ fontSize: 12, color: "#E03B34", marginTop: 4 }}
            >
              Please enter valid option value.
            </Typography>
          )}
          <Box style={{ marginTop: 32 }}>
            <FormGroup
              style={{
                display: "flex",
                paddingLeft: 6,
                justifyContent: "center",
              }}
            >
              <FormControlLabel
                style={{ color: "white" }}
                control={
                  <BpCheckbox
                    onClick={() => {
                      setIsMarkAsCorrectChecked((s) => !s);
                    }}
                  />
                }
                label="Mark correct option"
              />
            </FormGroup>
            {correctAnswerErr && (
              <Typography
                style={{ fontSize: 12, color: "#E03B34", marginTop: 4 }}
              >
                {
                  "Please check any one option as correct if `isMarkAsCorrectChecked`"
                }
              </Typography>
            )}
            <Box style={{ display: "flex", flexDirection: "column" }}>
              <Box
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 14,
                }}
              >
                <FormGroup
                  style={{
                    display: "flex",
                    paddingLeft: 6,
                    justifyContent: "center",
                  }}
                >
                  <FormControlLabel
                    style={{ color: "white" }}
                    control={
                      <BpCheckbox
                        onClick={(e) => {
                          setIsSetTimerChecked((s) => !s);
                        }}
                      />
                    }
                    label="Set timer"
                  />
                </FormGroup>
                {isSetTimerChecked && (
                  <Select
                    value={timer}
                    onChange={(e) => {
                      setTimer(e.target.value);
                    }}
                    className={classes.selectRoot}
                  >
                    {pollTimerArr.map((item) => {
                      return (
                        <MenuItem value={item.value}>{item.Label}</MenuItem>
                      );
                    })}
                  </Select>
                )}
              </Box>
              <Box style={{ marginTop: 4, marginLeft: 4 }}>
                {timerErr && (
                  <Typography style={{ fontSize: 12, color: "#E03B34" }}>
                    {"Timer should be more than 30 seconds."}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const PollButtonPart = ({
  theme,
  publishCreatePoll,
  publishDraftPoll,
  question,
  options,
  padding,
  timer,
  setQuestionErr,
  isMarkAsCorrectChecked,
  isSetTimerChecked,
  setSideBarNestedMode,
  setTimerErr,
  setCorrectAnswerErr,
  setMinOptionErr,
  setOptionErr,
}) => {
  const { polls } = useMeetingAppContext();

  const singleOption = options?.map((option) => {
    return option.option;
  });

  const handleValidation = ({
    question,
    options,
    isSetTimerChecked,
    timer,
    isMarkAsCorrectChecked,
  }) => {
    let isValid = true;

    if (
      question.length >= 2 &&
      /^[^-\s][a-zA-Z0-9_!@#$%^&*()`~.,<>{}[\]<>?_=+\-|;:\\'\"\/\s-]+$/i.test(
        question.trim()
      )
    ) {
      setQuestionErr(false);
    } else {
      isValid = false;
      setQuestionErr(true);
      return false;
    }

    if (options?.length < 2) {
      isValid = false;
      setMinOptionErr(true);
      return false;
    } else {
      setMinOptionErr(false);
    }

    for (let i = 0; i < singleOption.length; i++) {
      if (singleOption[i].length < 2) {
        isValid = false;
        setOptionErr(true);
        return false;
      } else {
        setOptionErr(false);
      }
    }

    // check time timer if `isSetTimerChecked`
    if (isSetTimerChecked && timer < 30) {
      isValid = false;
      setTimerErr(true);
      return false;
    } else {
      setTimerErr(false);
    }

    if (
      isMarkAsCorrectChecked &&
      options.findIndex(({ isCorrect }) => isCorrect) === -1
    ) {
      // please check any one option as correct if `isMarkAsCorrectChecked`
      isValid = false;
      setCorrectAnswerErr(true);
      return false;
    } else {
      setCorrectAnswerErr(false);
    }

    return isValid;
  };

  return (
    <Box style={{ display: "flex", padding: padding }}>
      <Button
        variant="contained"
        style={{
          width: "50%",
          backgroundColor: theme.palette.common.sidePanel,
          color: theme.palette.common.white,
          padding: "8px",
          boxShadow: "none",
        }}
        onClick={() => {
          const isValid = handleValidation({
            question,
            options,
            isSetTimerChecked,
            isMarkAsCorrectChecked,
            timer,
          });

          if (isValid) {
            publishDraftPoll(
              {
                id: uuid(),
                question: question.trim(),
                options: options,
                // createdAt: new Date(),
                timeout: isSetTimerChecked ? timer : 0,
                hasCorrectAnswer: isMarkAsCorrectChecked ? true : false,
                hasTimer: isSetTimerChecked ? true : false,
                isActive: false,
              },
              {
                persist: true,
              }
            );
            setSideBarNestedMode(sideBarNestedModes.POLLS);
          }
        }}
      >
        Save
      </Button>
      <Button
        variant="contained"
        style={{
          width: "50%",
          marginLeft: 8,
          color: theme.palette.common.white,
          backgroundColor: theme.palette.primary.main,
          padding: "8px",
          boxShadow: "none",
        }}
        onClick={() => {
          const isValid = handleValidation({
            question,
            options,
            isSetTimerChecked,
            isMarkAsCorrectChecked,
            timer,
          });

          if (isValid) {
            publishCreatePoll(
              {
                id: uuid(),
                question: question.trim(),
                options: options,
                // createdAt: new Date(),
                timeout: isSetTimerChecked ? timer : 0,
                hasCorrectAnswer: isMarkAsCorrectChecked ? true : false,
                hasTimer: isSetTimerChecked ? true : false,
                isActive: true,
                index: polls.length + 1,
              },
              { persist: true }
            );
            setSideBarNestedMode(sideBarNestedModes.POLLS);
          }
        }}
      >
        Launch
      </Button>
    </Box>
  );
};

const CreatePoll = ({ panelHeight }) => {
  const theme = useTheme();
  const padding = useResponsiveSize({
    xl: 12,
    lg: 16,
    md: 8,
    sm: 6,
    xs: 4,
  });

  const { setSideBarNestedMode } = useMeetingAppContext();
  const classes = useStyles();
  const [isMarkAsCorrectChecked, setIsMarkAsCorrectChecked] = useState(false);
  const [isSetTimerChecked, setIsSetTimerChecked] = useState(false);
  const [question, setQuestion] = useState("");
  const [questionErr, setQuestionErr] = useState(false);
  const [optionErr, setOptionErr] = useState(false);
  const [option, setOption] = useState({
    optionId: uuid(),
    option: null,
    isCorrect: false,
  });
  const [options, setOptions] = useState([]);
  const [timer, setTimer] = useState(30);
  const [timerErr, setTimerErr] = useState(false);
  const [correctAnswerErr, setCorrectAnswerErr] = useState(false);
  const [minOptionErr, setMinOptionErr] = useState(false);

  const _handleKeyDown = (e) => {
    if (
      e.key === "Enter" ||
      e.type === "mouseleave" ||
      e.type === "focus" ||
      e.type === "blur"
    ) {
      if (
        option?.option?.length >= 2 &&
        /^[^-\s][a-zA-Z0-9_!@#$%^&*()`~.,<>{}[\]<>?_=+\-|;:\\'\"\/\s-]+$/i.test(
          option?.option.trim()
        )
      ) {
        e.preventDefault();
        setOptions([...options, option]);
        setOption({ option: "", isCorrect: false });
      }
    }
  };

  const { publish: publishCreatePoll } = usePubSub(`CREATE_POLL`);
  const { publish: publishDraftPoll } = usePubSub(`DRAFT_A_POLL`);
  const Height = panelHeight - 14;

  return (
    <Box
      style={{
        // padding: padding,
        height: Height,
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
        <CreatePollPart
          classes={classes}
          isMarkAsCorrectChecked={isMarkAsCorrectChecked}
          setIsMarkAsCorrectChecked={setIsMarkAsCorrectChecked}
          isSetTimerChecked={isSetTimerChecked}
          setIsSetTimerChecked={setIsSetTimerChecked}
          question={question}
          setQuestion={setQuestion}
          questionErr={questionErr}
          option={option}
          setOption={setOption}
          options={options}
          setOptions={setOptions}
          _handleKeyDown={_handleKeyDown}
          padding={padding}
          setTimer={setTimer}
          timer={timer}
          timerErr={timerErr}
          correctAnswerErr={correctAnswerErr}
          minOptionErr={minOptionErr}
          optionErr={optionErr}
        />
        <PollButtonPart
          theme={theme}
          publishCreatePoll={publishCreatePoll}
          publishDraftPoll={publishDraftPoll}
          question={question}
          options={options}
          padding={padding}
          timer={timer}
          setQuestionErr={setQuestionErr}
          isMarkAsCorrectChecked={isMarkAsCorrectChecked}
          isSetTimerChecked={isSetTimerChecked}
          setSideBarNestedMode={setSideBarNestedMode}
          setTimerErr={setTimerErr}
          setCorrectAnswerErr={setCorrectAnswerErr}
          setMinOptionErr={setMinOptionErr}
          setOptionErr={setOptionErr}
        />
      </Box>
    </Box>
  );
};

export default CreatePoll;
