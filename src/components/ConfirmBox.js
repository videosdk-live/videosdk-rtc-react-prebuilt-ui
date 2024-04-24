import {
  Box,
  Dialog,
  DialogTitle,
  Typography,
  DialogActions,
} from "@mui/material";
import Button from "@mui/material/Button";
import React from "react";
import { styled, useTheme } from "@mui/material/styles";
import { appThemes, useMeetingAppContext } from "../MeetingAppContextDef";

const DarkCustomButton = styled(Button)`
  &:hover {
    color: white;
    background: #2b2e32;
  }
`;

const DarkOutlinedButton = styled(Button)`
  &:hover {
    color: white;
    background: #2b2e32;
    border: 1px solid white !important;
  }
`;

const LightCustomButton = styled(Button)`
  &:hover {
    background: #eef0f2;
  }
`;

const LightOutlinedButton = styled(Button)`
  &:hover {
    background: #eef0f2;
    border: 1px solid #404b53 !important;
  }
`;
const ConfirmBox = ({
  successText,
  rejectText,
  onSuccess,
  open,
  onReject,
  title,
  subTitle,
  subTitleColor,
  appTheme,
}) => {
  const v = useMeetingAppContext();

  const theme = useTheme();

  if (v && v?.isRecorder) {
    return <></>;
  }

  const ButtonElement =
    ((v && v?.appTheme) || appTheme) === appThemes.LIGHT
      ? LightCustomButton
      : DarkCustomButton;

  const OutlinedButtonElememt =
    ((v && v?.appTheme) || appTheme) === appThemes.LIGHT
      ? LightOutlinedButton
      : DarkOutlinedButton;

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      onClose={() => {}}
      aria-labelledby="responsive-dialog-title"
    >
      <Box
        style={{
          padding: 8,
          backgroundColor:
            ((v && v?.appTheme) || appTheme) === appThemes.DARK
              ? theme.palette.darkTheme.slightLighter
              : ((v && v?.appTheme) || appTheme) === appThemes.LIGHT
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
                  ((v && v?.appTheme) || appTheme) === appThemes.LIGHT
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
                    ((v && v?.appTheme) || appTheme) === appThemes.LIGHT
                      ? theme.palette.lightTheme.contrastText
                      : "#fff",
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="subtitle1"
                style={{
                  marginTop: 3,
                  color: subTitleColor
                    ? subTitleColor
                    : ((v && v?.appTheme) || appTheme) === appThemes.LIGHT
                    ? theme.palette.lightTheme.five
                    : "#9FA0A7",
                }}
              >
                {subTitle}
              </Typography>
            </DialogTitle>
          </Box>
        </Box>
        <Box>
          <DialogActions>
            <ButtonElement
              onClick={onReject}
              sx={{
                color:
                  ((v && v?.appTheme) || appTheme) === appThemes.LIGHT
                    ? theme.palette.lightTheme.contrastText
                    : "white",
              }}
            >
              {rejectText}
            </ButtonElement>

            <OutlinedButtonElememt
              onClick={onSuccess}
              sx={{
                color:
                  ((v && v?.appTheme) || appTheme) === appThemes.LIGHT
                    ? theme.palette.lightTheme.contrastText
                    : "white",
                borderColor:
                  ((v && v?.appTheme) || appTheme) === appThemes.LIGHT
                    ? theme.palette.lightTheme.contrastText
                    : "white",
              }}
              autoFocus
              variant="outlined"
            >
              {successText}
            </OutlinedButtonElememt>
          </DialogActions>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ConfirmBox;
