import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  makeStyles,
  styled,
  TextField,
  Typography,
  useTheme,
} from "@material-ui/core";
import { useState } from "react";
import { TimePicker } from "@material-ui/pickers";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { v4 as uuid } from "uuid";

import useResponsiveSize from "../../utils/useResponsiveSize";
import { usePubSub } from "@videosdk.live/react-sdk";
import { useMeetingAppContext } from "../../MeetingAppContextDef";

const useStyles = makeStyles(() => ({
  textField: {
    borderRadius: "4px",
    color: "white",
    fontWeight: 500,
  },

  textFieldRoot: {
    "& .MuiInputBase-input": {
      fontSize: "16px",
      fontWeight: 500,
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
    <Checkbox
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
  selectedDate,
  handleDateChange,
  _handleKeyDown,
  padding,
}) => {
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
        <Box>
          {options.length > 0 && (
            <Box>
              {options.map((item) => {
                // console.log("item", item);
                return (
                  <Box style={{ display: "flex", marginBottom: 12 }}>
                    {isMarkAsCorrectChecked && (
                      <MarkCorrectCheckbox
                        value={item.isCorrect}
                        onClick={() => {
                          // setOptions(
                          //   options.map((option) => {
                          //     return option.optionId === item.optionId
                          //       ? {
                          //           ...option,
                          //           isCorrect: !option.isCorrect,
                          //         }
                          //       : { ...option, isCorrect: false };
                          //   })
                          // );
                          setOptions(
                            options.map((option) => {
                              if (option.optionId === item.optionId) {
                                option.isCorrect = !option.isCorrect;
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
                      onChange={(e) => {
                        setOptions(
                          options.map((option) => {
                            if (option.optionId === item.optionId) {
                              option.option = e.target.value;
                            }
                            return option;
                          })
                        );
                      }}
                      className={classes.root}
                      style={{
                        marginLeft: isMarkAsCorrectChecked ? 8 : 0,
                        backgroundColor: item.isCorrect ? "#1178F8" : "#3D3C4E",
                      }}
                      InputProps={{
                        disableUnderline: true,
                        classes: {
                          root: classes.textField,
                        },
                      }}
                    />
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>

        <Box>
          <Box style={{ display: "flex" }}>
            <TextField
              placeholder="Add your options"
              fullWidth
              variant="filled"
              autocomplete="off"
              value={option.option}
              onChange={(e) =>
                setOption({
                  optionId: uuid(),
                  option: e.target.value,
                  isCorrect: false,
                })
              }
              onKeyDown={_handleKeyDown}
              className={classes.root}
              style={{ marginLeft: isMarkAsCorrectChecked ? 28 : 0 }}
              InputProps={{
                disableUnderline: true,
                classes: {
                  root: classes.textField,
                },
              }}
            />
          </Box>
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
                label="Mark as a correct"
              />
            </FormGroup>

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
                  label="Set Timer"
                />
              </FormGroup>
              {isSetTimerChecked && (
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <TimePicker
                    ampm={false}
                    // openTo="minutes"
                    // views={["minutes", "seconds"]}
                    format="mm:ss"
                    // label="Minutes and seconds"
                    style={{ width: "50%" }}
                    value={selectedDate}
                    onChange={handleDateChange}
                  />
                </MuiPickersUtilsProvider>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const PollButtonPart = ({
  setIsCreateNewPollClicked,
  theme,
  publishCreatePoll,
  publishDraftPoll,
  question,
  options,
  padding,
  setQuestionErr,
}) => {
  const handleValidation = ({ question }) => {
    let isValid = true;
    if (question.length < 5) {
      isValid = false;
      setQuestionErr(true);
      return false;
    } else {
      setQuestionErr(false);
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
        }}
        onClick={() => {
          publishDraftPoll(
            {
              id: uuid(),
              question: question,
              options: options,
              // createdAt: new Date(),
              // timeout: 0,
              isActive: false,
            },
            {
              persist: true,
            }
          );
          setIsCreateNewPollClicked(false);
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
        }}
        onClick={() => {
          // const isValid = handleValidation({ question });
          // if (isValid) {
            publishCreatePoll(
              {
                id: uuid(),
                question: "question question question question",
                options: [
                  {
                    optionId: "123",
                    option: "123",
                    isCorrect: false,
                  },
                  {
                    optionId: "456",
                    option: "456",
                    isCorrect: false,
                  },
                  {
                    optionId: "789",
                    option: "789",
                    isCorrect: false,
                  },
                ],
                hasCorrectAnswer: false,
                timeout: 10,
                hasTimer: true,
                isActive: true,
                // createdAt: new Date(),
              },
              { persist: true }
            );
            // publishCreatePoll(
            //   {
            //     id: uuid(),
            //     question: question,
            //     options: options,
            //     // createdAt: new Date(),
            //     timeout: 0,
            //     isActive: true,
            //   },
            //   { persist: true }
            // );
            setIsCreateNewPollClicked(false);
          // }
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
    lg: 10,
    md: 8,
    sm: 6,
    xs: 4,
  });

  const { setIsCreateNewPollClicked } = useMeetingAppContext();
  const classes = useStyles();
  const [isMarkAsCorrectChecked, setIsMarkAsCorrectChecked] = useState(false);
  const [isSetTimerChecked, setIsSetTimerChecked] = useState(false);
  const [question, setQuestion] = useState("");
  const [questionErr, setQuestionErr] = useState(false);
  const [option, setOption] = useState({
    optionId: uuid(),
    option: null,
    isCorrect: false,
  });
  const [options, setOptions] = useState([]);

  const [selectedDate, handleDateChange] = useState(new Date());
  const _handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // if (option.length > 0) {
      setOptions([...options, option]);
      setOption({ option: "", isCorrect: false });
      // }
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
          selectedDate={selectedDate}
          handleDateChange={handleDateChange}
          _handleKeyDown={_handleKeyDown}
          padding={padding}
        />
        <PollButtonPart
          setIsCreateNewPollClicked={setIsCreateNewPollClicked}
          theme={theme}
          publishCreatePoll={publishCreatePoll}
          publishDraftPoll={publishDraftPoll}
          question={question}
          options={options}
          padding={padding}
          setQuestionErr={setQuestionErr}
        />
      </Box>
    </Box>
  );
};

export default CreatePoll;
