import {
  Box,
  Dialog,
  DialogTitle,
  Typography,
  DialogActions,
  Button,
  useTheme,
  makeStyles,
} from "@material-ui/core";
import React from "react";
import { appThemes, useMeetingAppContext } from "../MeetingAppContextDef";

const useStyles = makeStyles(() => ({
  button: {
    "&:hover": {
      backgroundColor: "#EEF0F2",
    },
  },
}));
const ConfirmBox = ({
  successText,
  rejectText,
  onSuccess,
  open,
  onReject,
  title,
  subTitle,
  subTitleColor,
  themeColor,
}) => {
  const v = useMeetingAppContext();
  const classes = useStyles();

  const theme = useTheme();

  if (v && v?.isRecorder) {
    return <></>;
  }

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      onClose={() => {}}
      style={{
        backgroundColor:
          ((v && v?.themeColor) || themeColor) === appThemes.DARK &&
          "#FFFFFF30",
      }}
      aria-labelledby="responsive-dialog-title"
    >
      <Box
        style={{
          padding: 8,
          backgroundColor:
            ((v && v?.themeColor) || themeColor) === appThemes.DARK
              ? theme.palette.darkTheme.main
              : ((v && v?.themeColor) || themeColor) === appThemes.LIGHT
              ? theme.palette.lightTheme.main
              : theme.palette.background.default,
        }}
      >
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <DialogTitle
              style={{
                padding: 8,
                margin: 0,
                color:
                  ((v && v?.themeColor) || themeColor) === appThemes.LIGHT
                    ? theme.palette.lightTheme.contrastText
                    : "#fff",
              }}
              id="responsive-dialog-title"
            >
              <Typography
                variant="subtitle1"
                style={{
                  fontWeight: "bold",
                  color:
                    ((v && v?.themeColor) || themeColor) === appThemes.LIGHT
                      ? theme.palette.lightTheme.contrastText
                      : "#fff",
                }}
              >
                {title}
                {/* {`Allow participant entry?`} */}
              </Typography>
              <Typography
                variant="subtitle1"
                style={{
                  marginTop: 3,
                  color: subTitleColor
                    ? subTitleColor
                    : ((v && v?.themeColor) || themeColor) === appThemes.LIGHT
                    ? theme.palette.lightTheme.four
                    : "#9FA0A7",
                }}
              >
                {subTitle}
                {/* {`${name} wants to join meeting.`} */}
              </Typography>
            </DialogTitle>
          </Box>
        </Box>
        <Box>
          <DialogActions>
            <Button
              onClick={onReject}
              color={"white"}
              classes={{
                root:
                  ((v && v?.themeColor) || themeColor) === appThemes.LIGHT &&
                  classes.button,
              }}
              style={{
                color:
                  ((v && v?.themeColor) || themeColor) === appThemes.LIGHT
                    ? theme.palette.lightTheme.contrastText
                    : "white",
              }}
              size="medium"
            >
              {rejectText}
            </Button>

            <Button
              size="medium"
              onClick={onSuccess}
              color="white"
              autoFocus
              variant="outlined"
              classes={{
                root:
                  ((v && v?.themeColor) || themeColor) === appThemes.LIGHT &&
                  classes.button,
              }}
              style={{
                color:
                  ((v && v?.themeColor) || themeColor) === appThemes.LIGHT
                    ? theme.palette.lightTheme.contrastText
                    : "white",
                borderColor:
                  ((v && v?.themeColor) || themeColor) === appThemes.LIGHT
                    ? theme.palette.lightTheme.contrastText
                    : "white",
              }}
            >
              {successText}
            </Button>
          </DialogActions>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ConfirmBox;
