import { useMemo } from "react";
import { Constants, useMeeting } from "@videosdk.live/react-sdk";

const useIsTranscriptionRunning = () => {
  const { transcriptionState } = useMeeting();

  const isTranscriptionRunning = useMemo(
    () =>
      transcriptionState ===
        Constants.transcriptionEvents.TRANSCRIPTION_STARTED ||
      transcriptionState ===
        Constants.transcriptionEvents.TRANSCRIPTION_STOPPING,
    [transcriptionState]
  );

  return isTranscriptionRunning;
};

export default useIsTranscriptionRunning;
