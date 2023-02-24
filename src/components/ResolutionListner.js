import { usePubSub } from "@videosdk.live/react-sdk";
import { useSnackbar } from "notistack";
import { useMeetingAppContext } from "../MeetingAppContextDef";

const ResolutionListner = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { setMeetingResolution } = useMeetingAppContext();

  usePubSub(`CHANGE_RESOLUTION`, {
    onMessageReceived: (data) => {
      if (data.message.resolution) {
        setMeetingResolution(data.message.resolution);
        enqueueSnackbar(
          `Video resolution of all participants changed to ${data.message.resolution}.`
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
        setMeetingResolution(latestMessage.message.resolution);
        enqueueSnackbar(
          `Video resolution of all participants changed to ${latestMessage.message.resolution}.`
        );
      }
    },
  });

  return <></>;
};

export default ResolutionListner;
