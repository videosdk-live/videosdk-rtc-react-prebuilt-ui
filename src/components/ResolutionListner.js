import { usePubSub } from "@videosdk.live/react-sdk";
import { useSnackbar } from "notistack";
import { useMeetingAppContext } from "../MeetingAppContextDef";

const ResolutionListner = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { setMeetingResolution } = useMeetingAppContext();

  usePubSub(`CHANGE_RESOLUTION`, {
    onMessageReceived: (data) => {
      const { resolution } = data.payload || {};
      if (resolution) {
        setMeetingResolution(resolution);
        enqueueSnackbar(
          `Video resolution of all participants changed to ${resolution}.`
        );
      }
    },
    onOldMessagesReceived: (messages) => {
      const latestMessage = messages.sort((a, b) => {
        if (a.timestamp > b.timestamp) {
          return -1;
        }
        if (a.timestamp < b.timestamp) {
          return 1;
        }
        return 0;
      })[0];

      if (latestMessage) {
        const { resolution } = latestMessage.payload || {};
        if (!resolution) return;
        setMeetingResolution(resolution);
        enqueueSnackbar(
          `Video resolution of all participants changed to ${resolution}.`
        );
      }
    },
  });

  return <></>;
};

export default ResolutionListner;
