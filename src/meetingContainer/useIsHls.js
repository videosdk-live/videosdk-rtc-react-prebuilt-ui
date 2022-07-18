import { useMeeting } from "@videosdk.live/react-sdk";

const useIsHls = () => {
  const { isHls } = useMeeting();

  return isHls;
};

export default useIsHls;
