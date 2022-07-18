import { useMemo } from "react";
import { useMeeting } from "@videosdk.live/react-sdk";

const useIsLivestreaming = () => {
  const { livestreamState } = useMeeting();

  const isLiveStreaming = useMemo(
    () =>
      livestreamState === "livestreamStarted" ||
      livestreamState === "livestreamStopping",
    [livestreamState]
  );

  return isLiveStreaming;
};

export default useIsLivestreaming;
