import {
  Box,
  Button,
  Card,
  IconButton,
  InputAdornment,
  makeStyles,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@material-ui/core";
import { useEffect, useRef, useState } from "react";
import LinesEllipsis from "react-lines-ellipsis";
import useCopyClipboard from "react-use-clipboard";
import { Keyboard } from "@material-ui/icons";
import { CopyIcon } from "../../icons";
import useWindowSize from "../../utils/useWindowSize";
import { themeColorType } from "../../MeetingAppContextDef";

const useStyles = makeStyles(() => ({
  textFieldLight: {
    "&:hover": {
      border: "1px solid #70707033",
      borderRadius: "4px",
    },
    "& .MuiInputBase-input": {
      color: "#404B53",
    },
    border: "1px solid #70707033",
    borderRadius: "4px",
  },
  textField: {
    "& .MuiInputBase-input": {
      color: "white",
    },
  },
}));

export default function MeetingDetailModal({
  internalPadding,
  name,
  setName,
  nameErr,
  setNameErr,
  startMeeting,
  meetingTitle,
  meetingUrl,
  themeColor,
}) {
  const theme = useTheme();
  const classes = useStyles();
  const [descriptionBoxHeight, setDescriptionBoxHeight] = useState(0);
  const [copyBoxHeight, setCopyBoxHeight] = useState(0);

  const [copied, setCopied] = useCopyClipboard(meetingUrl, {
    successDuration: 4000,
  });

  const descriptionBoxRef = useRef();
  const copyBoxRef = useRef();

  const handleValidation = () => {
    let isValid = true;
    if (name.length < 3) {
      isValid = false;
      setNameErr(true);
      return false;
    } else {
      setNameErr(false);
    }
    return isValid;
  };

  const { width: windowWidth } = useWindowSize();

  useEffect(() => {
    if (
      descriptionBoxRef.current &&
      descriptionBoxRef.current.offsetHeight !== descriptionBoxHeight
    ) {
      setDescriptionBoxHeight(descriptionBoxRef.current.offsetHeight);
    }
    if (
      copyBoxRef.current &&
      copyBoxRef.current.offsetHeight !== copyBoxHeight
    ) {
      setCopyBoxHeight(copyBoxRef.current.offsetHeight);
    }
  }, [windowWidth]);

  return (
    <Box
      style={{
        width: "100%",
        display: "flex",
        flex: 1,
        flexDirection: "column",
      }}
    >
      {(meetingUrl && meetingTitle) || meetingUrl ? (
        <Card
          style={{
            borderRadius: 10,
            color: theme.palette.primary.contrastText,
            backgroundColor:
              themeColor === themeColorType.DARK
                ? theme.palette.darkTheme.slightLighter
                : themeColor === themeColorType.LIGHT
                ? theme.palette.lightTheme.two
                : "",
            boxShadow: themeColor === themeColorType.LIGHT && "none",
          }}
        >
          <Box p={internalPadding}>
            {meetingTitle ? (
              <div
                style={{
                  fontFamily: "Roboto, sans-serif",
                  color:
                    themeColor === themeColorType.LIGHT
                      ? theme.palette.lightTheme.contrastText
                      : theme.palette.primary.contrastText,
                }}
              >
                <LinesEllipsis
                  text={meetingTitle}
                  maxLine="3"
                  ellipsis="..."
                  style={{
                    width: "100%",
                    fontSize: "20px",
                    fontWeight: "bold",

                    fontFamily: "inherit",
                  }}
                />
              </div>
            ) : null}

            {meetingUrl ? (
              <Box
                ref={copyBoxRef}
                mt={meetingTitle ? 2 : 0}
                p={2.5}
                pt={1}
                pb={1}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flex: 1,
                  backgroundColor:
                    themeColor === themeColorType.DARK
                      ? theme.palette.darkTheme.seven
                      : themeColor === themeColorType.LIGHT
                      ? theme.palette.lightTheme.three
                      : "#1C1F2E80",
                  borderRadius: 4,
                  overflow: "hidden",
                  alignItems: "center",
                }}
              >
                <Box
                  style={{
                    overflow: "hidden",
                    display: "flex",
                    flex: 1,
                  }}
                >
                  <Typography
                    style={{
                      width: "100%",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      color:
                        themeColor === themeColorType.LIGHT &&
                        theme.palette.lightTheme.contrastText,
                    }}
                    variant="subtitle1"
                  >
                    {meetingUrl}
                  </Typography>
                </Box>
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <Tooltip title={copied ? "Copied" : "Copy"} aria-label="add">
                    <IconButton
                      style={{
                        padding: 0,
                        margin: 0,
                      }}
                      onClick={(e) => {
                        setCopied(e);
                      }}
                    >
                      <CopyIcon
                        fill={
                          themeColor === themeColorType.LIGHT
                            ? theme.palette.lightTheme.contrastText
                            : "#fff"
                        }
                        style={{
                          cursor: "pointer",
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            ) : null}
          </Box>
        </Card>
      ) : meetingTitle ? (
        <div
          style={{
            fontFamily: "Roboto, sans-serif",
            color:
              themeColor === themeColorType.LIGHT
                ? theme.palette.lightTheme.contrastText
                : theme.palette.primary.contrastText,
          }}
        >
          <LinesEllipsis
            text={meetingTitle}
            maxLine="3"
            ellipsis="..."
            style={{
              width: "100%",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          />
        </div>
      ) : null}

      <Box mt={meetingTitle || meetingUrl ? 2 : 0} style={{ width: "100%" }}>
        <TextField
          id={"inputJoin"}
          placeholder="Enter your name"
          variant="outlined"
          fullWidth
          value={name}
          error={nameErr}
          classes={{
            root:
              themeColor === themeColorType.LIGHT
                ? classes.textFieldLight
                : classes.textField,
          }}
          // helperText={
          //   nameErr
          //     ? "Enter Minimum 3 Characters"
          //     : "Your name will help everyone identify you in the meeting"
          // }
          onChange={(ev) => {
            setName(ev.target.value);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton>
                  <Keyboard
                    style={{
                      color:
                        themeColor === themeColorType.LIGHT
                          ? theme.palette.lightTheme.contrastText
                          : theme.palette.primary.contrastText,
                    }}
                  />
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  color="primary"
                  style={{
                    backgroundColor:
                      themeColor === themeColorType.LIGHT ||
                      themeColor === themeColorType.DARK
                        ? theme.palette.lightTheme.primaryMain
                        : theme.palette.primary.main,
                  }}
                  variant="contained"
                  onClick={(e) => {
                    const isValid = handleValidation();
                    if (isValid) {
                      startMeeting(e);
                    }
                  }}
                  id={"btnJoin"}
                >
                  Join
                </Button>
              </InputAdornment>
            ),
          }}
        />
        <p
          style={{
            marginTop: 3,
            marginBottom: 0,
            fontSize: 12,
            marginLeft: 14,
            color:
              themeColor === themeColorType.DARK
                ? theme.palette.darkTheme.four
                : "#8F927A",
          }}
        >
          {nameErr
            ? "Enter Minimum 3 Characters"
            : "Your name will help everyone identify you in the meeting"}
        </p>
      </Box>
    </Box>
  );
}
