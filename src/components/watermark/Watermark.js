import { useTheme } from "@mui/material";
import { appThemes, useMeetingAppContext } from "../../MeetingAppContextDef";
import useIsMobile from "../../utils/useIsMobile";
import useIsTab from "../../utils/useIsTab";
import { usePubSub } from "@videosdk.live/react-sdk";

export default function Watermark() {
  const isMobile = useIsMobile();
  const isTab = useIsTab();
  const { appTheme } = useMeetingAppContext();
  const theme = useTheme();

  /*
   * Receive the message you want to display in the watermark using the pubsub or
   * hardcode it here if the content is not dynamic. You can also take the value inputs from the
   * URL params and pass the values when creating the template URL.
   */
  const { messages } = usePubSub("GEO_TAG");

  return (
    <div
      style={{
        position: "absolute",
        bottom: isMobile ? 4 : isTab ? 8 : 12,
        right: isMobile ? 4 : isTab ? 8 : 12,
        opacity: 1,
        paddingTop: isMobile ? 2 : isTab ? 3 : 4,
        paddingBottom: isMobile ? 2 : isTab ? 3 : 4,
        paddingLeft: isMobile ? 4 : isTab ? 6 : 8,
        paddingRight: isMobile ? 4 : isTab ? 6 : 8,
        backgroundColor:
          appTheme === appThemes.LIGHT
            ? theme.palette.lightTheme.three
            : "#00000066",
        borderRadius: 6,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#ffffff",
      }}
    >
      {/* Here you can render any content you want in your recording/livestream template */}
      Participant Name:{" "}
      {messages.at(messages.length - 1)?.payload?.participantName ?? "-"}
      <br />
      Latitude:{" "}
      {messages.at(messages.length - 1)?.payload?.latitude ??
        "No Latitude Found"}
      <br />
      Longitude:{" "}
      {messages.at(messages.length - 1)?.payload?.longitude ??
        "No Longitude Found"}
    </div>
  );
}
