import React, { useSyncExternalStore } from "react";
import { Button, useTheme } from "@mui/material";
import { VolumeUp } from "@mui/icons-material";
import { appThemes, useMeetingAppContext } from "../MeetingAppContextDef";
import {
  getCanPlaybackAudio,
  startAudio,
  subscribeAudioPlaybackStatus,
} from "../utils/audioOutputRelay";

// Shown only when the browser refused to start remote audio because there was
// no recent tap; the tap on this button is the gesture that unlocks playback.
const AudioPlaybackPrompt = ({ top }) => {
  const canPlaybackAudio = useSyncExternalStore(
    subscribeAudioPlaybackStatus,
    getCanPlaybackAudio
  );
  const { appTheme } = useMeetingAppContext();
  const theme = useTheme();

  if (canPlaybackAudio) return null;

  return (
    <Button
      variant="contained"
      startIcon={<VolumeUp />}
      onClick={startAudio}
      style={{
        position: "fixed",
        top,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: theme.zIndex.snackbar,
        textTransform: "none",
        fontWeight: "bold",
        backgroundColor:
          appTheme === appThemes.LIGHT || appTheme === appThemes.DARK
            ? theme.palette.lightTheme.primaryMain
            : theme.palette.primary.main,
      }}
    >
      Enable audio
    </Button>
  );
};

export default AudioPlaybackPrompt;
