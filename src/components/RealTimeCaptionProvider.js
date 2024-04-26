import {
  Constants,
  useMeeting,
  usePubSub,
  useTranscription,
} from "@videosdk.live/react-sdk";
import { useSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import { appThemes, useMeetingAppContext } from "../MeetingAppContextDef";
import { meetingModes } from "../CONSTS";
import useIsMobile from "../utils/useIsMobile";
import useIsTab from "../utils/useIsTab";
import { useMediaQuery } from "react-responsive";
import { Typography, useTheme } from "@mui/material";

const RealTimeCaptionProvider = ({}) => {
  const mMeeting = useMeeting({});
  useTranscription({
    onTranscriptionStateChanged,
    onTranscriptionText,
  });
  const [transcription, setTranscription] = useState();

  const {
    participantCanToggleRealtimeTranscription,
    notificationAlertsEnabled,
    meetingMode,
    appTheme,
  } = useMeetingAppContext();

  const isMobile = useIsMobile();
  const isTab = useIsTab();
  const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });
  const theme = useTheme();

  const meetingModeRef = useRef(meetingMode);

  const { enqueueSnackbar } = useSnackbar();

  function onTranscriptionStateChanged(data) {
    console.log("transcription state changed :: ", data);
    let status = data.status;
    if (
      participantCanToggleRealtimeTranscription &&
      notificationAlertsEnabled &&
      meetingModeRef.current === meetingModes.CONFERENCE &&
      (status === Constants.transcriptionEvents.TRANSCRIPTION_STARTED ||
        status === Constants.transcriptionEvents.TRANSCRIPTION_STOPPED)
    ) {
      enqueueSnackbar(
        status === Constants.transcriptionEvents.TRANSCRIPTION_STARTED
          ? "Meeting transcription is started."
          : "Meeting transcription is stopped."
      );
    }
  }
  function onTranscriptionText(payload) {
    if (payload && payload.text) {
      setTranscription({
        text: payload.text,
        participantName: payload.participantName,
      });
    }
  }

  useEffect(() => {
    if (
      mMeeting.transcriptionState ==
      Constants.transcriptionEvents.TRANSCRIPTION_STOPPED
    ) {
      setTranscription(null);
    }
  }, [mMeeting.transcriptionState]);

  return transcription ? (
    <>
      <div
        style={{
          position: "absolute",
          zIndex: 99,
          width: "100%",
          height: "auto",
          bottom: "25px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "left",
          color: "white",
        }}
      >
        <Typography
          variant={"subtitle2"}
          style={{
            width: "70%",

            fontSize: 20,
            // display: "flex",
            // alignItems: "center",
            // lineHeight: 1,
            color:
              appTheme === appThemes.LIGHT &&
              theme.palette.lightTheme.contrastText,
          }}
        >
          <div
            style={{
              display: "flex",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                backgroundColor:
                  appTheme === appThemes.LIGHT
                    ? theme.palette.lightTheme.three
                    : "#00000066",
                paddingTop: isMobile ? 2 : isTab ? 3 : 4,
                paddingBottom: isMobile ? 2 : isTab ? 3 : 4,
                paddingLeft: isMobile ? 4 : isTab ? 6 : 8,
                paddingRight: isMobile ? 4 : isTab ? 6 : 8,
              }}
            >
              <strong
                style={{
                  maxWidth: "10%",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: " ellipsis",
                  marginRight: "5px",
                }}
              >
                [ {transcription.participantName} ] :
              </strong>
              <span>{transcription.text}</span>
            </div>
          </div>
        </Typography>
      </div>
    </>
  ) : null;
};

export default RealTimeCaptionProvider;
