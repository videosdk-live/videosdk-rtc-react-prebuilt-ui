import React, { useEffect, useMemo, useState } from "react";
import MeetingContainer from "./meetingContainer/MeetingContainer";
import { MeetingProvider } from "@videosdk.live/react-sdk";
import { MeetingAppProvider } from "./MeetingAppContextDef";
import JoinMeeting from "./components/JoinScreen";
import ClickAnywhereToContinue from "./components/ClickAnywhereToContinue";
import { Box, CircularProgress } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";

const App = () => {
  const [userHasInteracted, setUserHasInteracted] = useState(null);

  const [meetingIdValidation, setMeetingIdValidation] = useState({
    isLoading: true,
    meetingId: null,
  });

  const getParams = () => {
    const location = window.location;
    const urlParams = new URLSearchParams(location.search);

    const paramKeys = {
      token: "token",
      micEnabled: "micEnabled",
      webcamEnabled: "webcamEnabled",
      name: "name",
      meetingId: "meetingId",
      redirectOnLeave: "redirectOnLeave",
      chatEnabled: "chatEnabled",
      screenShareEnabled: "screenShareEnabled",
      pollEnabled: "pollEnabled",
      whiteBoardEnabled: "whiteBoardEnabled",
      participantCanToggleSelfWebcam: "participantCanToggleSelfWebcam",
      participantCanToggleSelfMic: "participantCanToggleSelfMic",
      participantCanToggleSelfScreenShare:
        "participantCanToggleSelfScreenShare",
      raiseHandEnabled: "raiseHandEnabled",
      recordingEnabled: "recordingEnabled",
      recordingWebhookUrl: "recordingWebhookUrl",
      recordingEnabledByDefault: "recordingEnabledByDefault",
      participantCanToggleRecording: "participantCanToggleRecording",
      brandingEnabled: "brandingEnabled",
      brandLogoURL: "brandLogoURL",
      brandName: "brandName",
      participantCanLeave: "participantCanLeave",
      poweredBy: "poweredBy",
      liveStreamEnabled: "liveStreamEnabled",
      autoStartLiveStream: "autoStartLiveStream",
      liveStreamOutputs: "liveStreamOutputs",
      askJoin: "askJoin",
      participantCanToggleOtherMic: "participantCanToggleOtherMic",
      participantCanToggleOtherWebcam: "participantCanToggleOtherWebcam",
      joinScreenEnabled: "joinScreenEnabled",
      joinScreenMeetingUrl: "joinScreenMeetingUrl",
      joinScreenTitle: "joinScreenTitle",
      notificationSoundEnabled: "notificationSoundEnabled",
      layout: "layout",
      canPin: "canPin",
    };

    Object.keys(paramKeys).forEach((key) => {
      paramKeys[key] = urlParams.get(key)
        ? decodeURIComponent(urlParams.get(key))
        : null;
    });

    // required options

    if (typeof paramKeys.token !== "string") {
      throw new Error("token not provided");
    }
    if (typeof paramKeys.meetingId !== "string") {
      throw new Error("meetingId not provided");
    }
    if (typeof paramKeys.name !== "string") {
      if (paramKeys.joinScreenEnabled !== "true") {
        throw new Error("name not provided");
      }
    }
    if (typeof paramKeys.redirectOnLeave !== "string") {
      throw new Error("redirectOnLeave not provided");
    }

    // default options

    if (typeof paramKeys.micEnabled !== "string") {
      paramKeys.micEnabled = "true";
    }
    if (typeof paramKeys.webcamEnabled !== "string") {
      paramKeys.webcamEnabled = "true";
    }
    if (typeof paramKeys.redirectOnLeave !== "string") {
      paramKeys.redirectOnLeave = "true";
    }
    if (typeof paramKeys.chatEnabled !== "string") {
      paramKeys.chatEnabled = "true";
    }
    if (typeof paramKeys.screenShareEnabled !== "string") {
      paramKeys.screenShareEnabled = "true";
    }
    if (typeof paramKeys.pollEnabled !== "string") {
      paramKeys.pollEnabled = "true";
    }
    if (typeof paramKeys.whiteBoardEnabled !== "string") {
      paramKeys.whiteBoardEnabled = "true";
    }
    if (typeof paramKeys.participantCanToggleSelfWebcam !== "string") {
      paramKeys.participantCanToggleSelfWebcam = "true";
    }
    if (typeof paramKeys.participantCanToggleSelfMic !== "string") {
      paramKeys.participantCanToggleSelfMic = "true";
    }
    if (typeof paramKeys.raiseHandEnabled !== "string") {
      paramKeys.raiseHandEnabled = "true";
    }
    if (typeof paramKeys.recordingEnabled !== "string") {
      paramKeys.recordingEnabled = "false";
    }
    if (typeof paramKeys.poweredBy !== "string") {
      paramKeys.poweredBy = "true";
    }
    if (typeof paramKeys.liveStreamEnabled !== "string") {
      paramKeys.liveStreamEnabled = "true";
    }
    if (typeof paramKeys.autoStartLiveStream !== "string") {
      paramKeys.autoStartLiveStream = "true";
    }

    if (paramKeys.recordingEnabled === "true") {
      if (
        typeof paramKeys.recordingWebhookUrl !== "string" ||
        paramKeys.recordingWebhookUrl.length === 0
      ) {
        throw new Error(
          "Recording WebhookUrl not provided when recording is enabled"
        );
      }
    }

    if (paramKeys.brandingEnabled === "true") {
      if (!paramKeys.brandLogoURL || paramKeys.brandLogoURL?.length === 0) {
        throw new Error(
          "'brandLogoURL' is required when 'brandingEnabled' is true."
        );
      }

      if (!paramKeys.brandName || paramKeys.brandName.length === 0) {
        throw new Error(
          "'brandName' is required when 'brandingEnabled' is true."
        );
      }
    }

    // if (paramKeys.liveStreamEnabled && paramKeys.autoStartLiveStream) {
    if (paramKeys.autoStartLiveStream === "true") {
      try {
        paramKeys.liveStreamOutputs = JSON.parse(paramKeys.liveStreamOutputs);
        if (
          paramKeys.liveStreamOutputs === null ||
          !paramKeys.liveStreamOutputs.length
        ) {
          paramKeys.liveStreamOutputs = [];
        }
      } catch (err) {
        paramKeys.liveStreamOutputs = [];
      }
    }

    if (typeof paramKeys.joinScreenEnabled !== "string") {
      paramKeys.joinScreenEnabled = "true";
    }

    if (
      paramKeys.joinScreenMeetingUrl === null ||
      !paramKeys.joinScreenMeetingUrl.length
    ) {
      paramKeys.joinScreenMeetingUrl = "";
    }

    if (
      paramKeys.joinScreenTitle === null ||
      !paramKeys.joinScreenTitle.length
    ) {
      paramKeys.joinScreenTitle = "";
    }

    if (typeof paramKeys.notificationSoundEnabled !== "string") {
      paramKeys.notificationSoundEnabled = "true";
    }

    switch (paramKeys?.layout?.toUpperCase()) {
      case "GRID":
      case "SPOTLIGHT":
      case "SIDEBAR":
        paramKeys.layout = paramKeys.layout.toUpperCase();
        break;
      default:
        paramKeys.layout = "GRID";
        break;
    }

    if (typeof paramKeys.canPin !== "string") {
      paramKeys.canPin = "false";
    }

    return paramKeys;
  };

  const paramKeys = useMemo(getParams, []);

  const [name, setName] = useState(paramKeys.name || "");
  const [joinScreenWebCam, setJoinScreenWebCam] = useState(
    paramKeys.participantCanToggleSelfWebcam === "true" &&
      paramKeys.webcamEnabled === "true"
  );
  const [joinScreenMic, setJoinScreenMic] = useState(
    paramKeys.participantCanToggleSelfMic === "true" &&
      paramKeys.micEnabled === "true"
  );

  const validateMeetingId = async ({ meetingId, token }) => {
    const BASE_URL = "https://api.zujonow.com";

    const urlMeetingId = `${BASE_URL}/v1/prebuilt/meetings/${meetingId}`;

    const resMeetingId = await fetch(urlMeetingId, {
      method: "POST",
      headers: { "Content-type": "application/json", Authorization: token },
    });

    const meetingIdJson = await resMeetingId.json();

    const validatedMeetingId = meetingIdJson.meetingId;

    if (validatedMeetingId) {
      setMeetingIdValidation({
        isLoading: false,
        meetingId: validatedMeetingId,
      });
    } else {
      throw new Error("meetingId request failed");
    }
  };

  useEffect(() => {
    validateMeetingId({
      meetingId: paramKeys.meetingId,
      token: paramKeys.token,
    });
  }, [paramKeys]);

  const theme = useTheme();

  return meetingIdValidation.isLoading ? (
    <Box
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <CircularProgress size={"4rem"} />
    </Box>
  ) : userHasInteracted && meetingIdValidation.meetingId ? (
    <MeetingAppProvider
      {...{
        redirectOnLeave: paramKeys.redirectOnLeave,
        chatEnabled: paramKeys.chatEnabled === "true",
        screenShareEnabled: paramKeys.screenShareEnabled === "true",
        pollEnabled: paramKeys.pollEnabled === "true",
        whiteBoardEnabled: paramKeys.whiteBoardEnabled === "true",
        participantCanToggleSelfWebcam:
          paramKeys.participantCanToggleSelfWebcam === "true",
        participantCanToggleSelfMic:
          paramKeys.participantCanToggleSelfMic === "true",
        raiseHandEnabled: paramKeys.raiseHandEnabled === "true",
        recordingEnabled: paramKeys.recordingEnabled === "true",
        recordingWebhookUrl: paramKeys.recordingWebhookUrl,
        recordingEnabledByDefault:
          paramKeys.recordingEnabledByDefault === "true",
        participantCanToggleRecording:
          paramKeys.participantCanToggleRecording === "true",
        brandingEnabled: paramKeys.brandingEnabled === "true" ? true : false,
        poweredBy: paramKeys.poweredBy === "true" ? true : false,
        liveStreamEnabled:
          paramKeys.liveStreamEnabled === "true" ? true : false,
        autoStartLiveStream:
          paramKeys.autoStartLiveStream === "true" ? true : false,
        liveStreamOutputs: paramKeys.liveStreamOutputs,
        brandLogoURL:
          paramKeys.brandLogoURL?.length > 0 ? paramKeys.brandLogoURL : null,
        brandName: paramKeys.brandName?.length > 0 ? paramKeys.brandName : null,
        participantCanLeave:
          paramKeys.participantCanLeave === "false" ? false : true,
        askJoin: paramKeys.askJoin === "true" ? true : false,
        participantCanToggleOtherMic:
          paramKeys.participantCanToggleOtherMic === "true" ? true : false,
        participantCanToggleOtherWebcam:
          paramKeys.participantCanToggleOtherWebcam === "true" ? true : false,
        notificationSoundEnabled:
          paramKeys.notificationSoundEnabled === "true" ? true : false,
        layout: paramKeys.layout,
        canPin: paramKeys.canPin === "true" ? true : false,
      }}
    >
      <MeetingProvider
        config={{
          meetingId: meetingIdValidation.meetingId,
          micEnabled: joinScreenMic,
          webcamEnabled: joinScreenWebCam,
          name: name,
        }}
        token={paramKeys.token}
        joinWithoutUserInteraction
      >
        <MeetingContainer />
      </MeetingProvider>
    </MeetingAppProvider>
  ) : paramKeys.joinScreenEnabled === "true" ? (
    <JoinMeeting
      onClick={({ name, webcamOn, micOn }) => {
        setName(name);
        setJoinScreenMic(micOn);
        setJoinScreenWebCam(webcamOn);
        setUserHasInteracted(true);
      }}
      {...{
        micEnabled:
          paramKeys.participantCanToggleSelfMic === "true" &&
          paramKeys.micEnabled === "true",
        webcamEnabled:
          paramKeys.participantCanToggleSelfWebcam === "true" &&
          paramKeys.webcamEnabled === "true",
      }}
      name={name}
      setName={setName}
      meetingUrl={paramKeys.joinScreenMeetingUrl}
      meetingTitle={paramKeys.joinScreenTitle}
      participantCanToggleSelfWebcam={paramKeys.participantCanToggleSelfWebcam}
      participantCanToggleSelfMic={paramKeys.participantCanToggleSelfMic}
    />
  ) : (
    <ClickAnywhereToContinue
      onClick={() => {
        setUserHasInteracted(true);
      }}
      title="Click anywhere to continue"
    />
  );
};

export default App;
