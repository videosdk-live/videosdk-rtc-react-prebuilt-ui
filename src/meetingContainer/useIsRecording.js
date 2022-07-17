import { useMemo } from "react";
import { useMeeting } from "@videosdk.live/react-sdk";

const useIsRecording = () => {
  const { recordingState } = useMeeting();

  const isRecording = useMemo(
    () =>
      recordingState === "recordingStarted" ||
      recordingState === "recordingStopping",
    [recordingState]
  );

  return isRecording;
};

export default useIsRecording;
