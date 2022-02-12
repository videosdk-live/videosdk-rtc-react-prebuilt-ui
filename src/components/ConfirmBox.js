import {
  Box,
  Dialog,
  DialogTitle,
  Typography,
  DialogActions,
  Button,
} from "@material-ui/core";
import React from "react";
import { useMeetingAppContext } from "../MeetingAppContextDef";

const ConfirmBox = ({
  successText,
  rejectText,
  onSuccess,
  open,
  onReject,
  title,
  subTitle,
}) => {
  const v = useMeetingAppContext();

  if (v && v?.isRecorder) {
    return <></>;
  }

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      onClose={() => {}}
      aria-labelledby="responsive-dialog-title"
    >
      <Box style={{ padding: 8 }}>
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
              style={{ padding: 8, margin: 0 }}
              id="responsive-dialog-title"
            >
              <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                {title}
                {/* {`Allow participant entry?`} */}
              </Typography>
              <Typography
                variant="subtitle1"
                style={{ marginTop: 3, color: "#808080" }}
              >
                {subTitle}
                {/* {`${name} wants to join meeting.`} */}
              </Typography>
            </DialogTitle>
          </Box>
        </Box>
        <Box>
          <DialogActions>
            <Button onClick={onReject} color="white" size="medium">
              {rejectText}
            </Button>

            <Button
              size="medium"
              onClick={onSuccess}
              color="white"
              autoFocus
              variant="outlined"
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
