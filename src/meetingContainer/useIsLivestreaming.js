import { useMemo } from "react";
import { Constants, useMeeting } from "@videosdk.live/react-sdk";

const useIsLivestreaming = () => {
  const { livestreamState } = useMeeting();

  const isLiveStreaming = useMemo(
    () =>
      livestreamState === Constants.livestreamEvents.LIVESTREAM_STARTED ||
      livestreamState === Constants.livestreamEvents.LIVESTREAM_STOPPING,
    [livestreamState]
  );

  return isLiveStreaming;
};

export default useIsLivestreaming;
