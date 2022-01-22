import React, { useEffect, useMemo, useState } from "react";
import MeetingContainer from "./meetingContainer/MeetingContainer";
import { MeetingProvider } from "@videosdk.live/react-sdk";
import { MeetingAppProvider, meetingLayouts } from "./MeetingAppContextDef";
import JoinMeeting from "./components/JoinScreen";
import ClickAnywhereToContinue from "./components/ClickAnywhereToContinue";
import { Box, CircularProgress } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import MeetingLeftScreen from "./components/MeetingLeftScreen";
import ConfirmBox from "./components/ConfirmBox";
// import ErrorPage from "./components/ErrorPage";

const App = () => {
  const [userHasInteracted, setUserHasInteracted] = useState(null);

  const [meetingIdValidation, setMeetingIdValidation] = useState({
    isLoading: true,
    meetingId: null,
    reqError: null,
    reqStatusCode: null,
  });

  const [meetingError, setMeetingError] = useState({
    message: null,
    code: null,
    isVisible: false,
  });

  const [meetingLeft, setMeetingLeft] = useState(false);

  const playNotificationErr = async () => {
    const errAudio = new Audio(
      `https://static.videosdk.live/prebuilt/notification_err.mp3`
    );

    await errAudio.play();
  };

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
      whiteboardEnabled: "whiteboardEnabled",
      participantCanToggleSelfWebcam: "participantCanToggleSelfWebcam",
      participantCanToggleSelfMic: "participantCanToggleSelfMic",
      raiseHandEnabled: "raiseHandEnabled",
      recordingEnabled: "recordingEnabled",
      recordingWebhookUrl: "recordingWebhookUrl",
      recordingAWSDirPath: "recordingAWSDirPath",
      autoStartRecording: "autoStartRecording",
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
      canEndMeeting: "canEndMeeting",
      canRemoveOtherParticipant: "canRemoveOtherParticipant",
      canDrawOnWhiteboard: "canDrawOnWhiteboard",
      canToggleWhiteboard: "canToggleWhiteboard",
      leftScreenActionButtonLabel: "leftScreenActionButtonLabel",
      leftScreenActionButtonHref: "leftScreenActionButtonHref",
      maxResolution: "maxResolution",
      animationsEnabled: "animationsEnabled",
      topbarEnabled: "topbarEnabled",
      notificationAlertsEnabled: "notificationAlertsEnabled",
      debug: "debug",
      layoutPriority: "layoutPriority",
      participantId: "participantId",
      layoutGridSize: "layoutGridSize",
      recordingLayoutType: "recordingLayoutType",
      recordingLayoutPriority: "recordingLayoutPriority",
      recordingLayoutGridSize: "recordingLayoutGridSize",
      hideLocalParticipant: "hideLocalParticipant",
      alwaysShowOverlay: "alwaysShowOverlay",
      sideStackSize: "sideStackSize",
      reduceEdgeSpacing: "reduceEdgeSpacing",
    };

    Object.keys(paramKeys).forEach((key) => {
      paramKeys[key] = urlParams.get(key)
        ? decodeURIComponent(urlParams.get(key))
        : null;
    });

    // required options
    let configErr;

    if (typeof paramKeys.token !== "string") {
      configErr = `"token" not provided`;
      playNotificationErr();
      setMeetingError({ message: configErr, code: 4001, isVisible: true });
      //
      // throw new Error(configErr);
    }
    if (typeof paramKeys.meetingId !== "string") {
      configErr = `"meetingId" not provided`;
      playNotificationErr();
      setMeetingError({ message: configErr, code: 4001, isVisible: true });
      //
      // throw new Error(configErr);
    }
    if (typeof paramKeys.name !== "string") {
      if (paramKeys.joinScreenEnabled !== "true") {
        configErr = `"name" not provided when joinScreen is disabled`;
        playNotificationErr();
        setMeetingError({ message: configErr, code: 4001, isVisible: true });
        //
        // throw new Error(configErr);
      }
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
    if (typeof paramKeys.whiteboardEnabled !== "string") {
      paramKeys.whiteboardEnabled = "true";
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
      case meetingLayouts.GRID:
      case meetingLayouts.SPOTLIGHT:
      case meetingLayouts.SIDEBAR:
        paramKeys.layout = paramKeys.layout.toUpperCase();
        break;
      default:
        paramKeys.layout = meetingLayouts.GRID;
        break;
    }

    if (typeof paramKeys.canPin !== "string") {
      paramKeys.canPin = "false";
    }

    if (paramKeys.layoutPriority === "PIN") {
      if (paramKeys.layout === meetingLayouts.SPOTLIGHT) {
      } else if (paramKeys.layout === meetingLayouts.SIDEBAR) {
      }
    } else if (paramKeys.layoutPriority === "SPEAKER") {
      if (paramKeys.layout === meetingLayouts.SPOTLIGHT) {
        paramKeys.layout = meetingLayouts.UNPINNED_SPOTLIGHT;
      } else if (paramKeys.layout === meetingLayouts.SIDEBAR) {
        paramKeys.layout = meetingLayouts.UNPINNED_SIDEBAR;
      }
    }

    paramKeys.layoutGridSize = parseInt(paramKeys.layoutGridSize);

    paramKeys.recordingLayoutGridSize = parseInt(
      paramKeys.recordingLayoutGridSize
    );

    paramKeys.sideStackSize = parseInt(paramKeys.sideStackSize);

    if (
      typeof paramKeys.layoutGridSize === "number" &&
      paramKeys.layoutGridSize <= 0
    ) {
      configErr = `"layoutGridSize" is not a valid number`;
      playNotificationErr();
      setMeetingError({ message: configErr, code: 4001, isVisible: true });
    }

    if (
      typeof paramKeys.recordingLayoutGridSize === "number" &&
      paramKeys.recordingLayoutGridSize <= 0
    ) {
      configErr = `"recordingLayoutGridSize" is not a valid number`;
      playNotificationErr();
      setMeetingError({ message: configErr, code: 4001, isVisible: true });
    }

    if (
      typeof paramKeys.sideStackSize === "number" &&
      paramKeys.sideStackSize <= 0
    ) {
      configErr = `"sideStackSize" is not a valid number`;
      playNotificationErr();
      setMeetingError({ message: configErr, code: 4001, isVisible: true });
    }

    return paramKeys;
  };

  const paramKeys = useMemo(getParams, []);

  const [name, setName] = useState(paramKeys.name || "");
  const [joinScreenWebCam, setJoinScreenWebCam] = useState(
    paramKeys.joinScreenEnabled === "true"
      ? paramKeys.participantCanToggleSelfWebcam === "true" &&
          paramKeys.webcamEnabled === "true"
      : paramKeys.webcamEnabled === "true"
  );

  const [joinScreenMic, setJoinScreenMic] = useState(
    paramKeys.joinScreenEnabled === "true"
      ? paramKeys.participantCanToggleSelfMic === "true" &&
          paramKeys.micEnabled === "true"
      : paramKeys.micEnabled === "true"
  );
  const [selectedMic, setSelectedMic] = useState({ id: null });
  const [selectedWebcam, setSelectedWebcam] = useState({ id: null });

  const validateMeetingId = async ({ meetingId, token, debug }) => {
    const BASE_URL = "https://dev-api.videosdk.live";

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
        reqError: null,
        reqStatusCode: null,
      });
    } else {
      setMeetingIdValidation({
        isLoading: false,
        meetingId: null,
        reqError: meetingIdJson.error,
        reqStatusCode: meetingIdJson.statusCode,
      });

      playNotificationErr();

      setMeetingError({
        message: debug ? meetingIdJson.error : "Unable to join meeting!",
        code: meetingIdJson.statusCode,
        isVisible: true,
      });
    }
  };

  useEffect(() => {
    validateMeetingId({
      meetingId: paramKeys.meetingId,
      token: paramKeys.token,
      debug: paramKeys.debug === "true",
    });
  }, [paramKeys]);

  const theme = useTheme();

  return (
    <>
      {meetingLeft ? (
        <MeetingLeftScreen
          brandLogoURL={paramKeys.brandLogoURL}
          leftScreenActionButtonLabel={paramKeys.leftScreenActionButtonLabel}
          leftScreenActionButtonHref={paramKeys.leftScreenActionButtonHref}
          setMeetingLeft={setMeetingLeft}
        />
      ) : meetingIdValidation.isLoading ? (
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
      ) : meetingIdValidation.reqError ? (
        <>
          {/* <ErrorPage
            errMsg={meetingIdValidation.reqError}
            statusCode={meetingIdValidation.reqStatusCode}
          /> */}
        </>
      ) : userHasInteracted && meetingIdValidation.meetingId ? (
        <MeetingAppProvider
          {...{
            redirectOnLeave: paramKeys.redirectOnLeave,
            chatEnabled: paramKeys.chatEnabled === "true",
            screenShareEnabled: paramKeys.screenShareEnabled === "true",
            pollEnabled: paramKeys.pollEnabled === "true",
            whiteboardEnabled: paramKeys.whiteboardEnabled === "true",
            participantCanToggleSelfWebcam:
              paramKeys.participantCanToggleSelfWebcam === "true",
            participantCanToggleSelfMic:
              paramKeys.participantCanToggleSelfMic === "true",
            raiseHandEnabled: paramKeys.raiseHandEnabled === "true",
            recordingEnabled: paramKeys.recordingEnabled === "true",
            recordingWebhookUrl: paramKeys.recordingWebhookUrl,
            recordingAWSDirPath: paramKeys.recordingAWSDirPath,
            autoStartRecording: paramKeys.autoStartRecording === "true",
            participantCanToggleRecording:
              paramKeys.participantCanToggleRecording === "true",
            brandingEnabled:
              paramKeys.brandingEnabled === "true" ? true : false,
            poweredBy: paramKeys.poweredBy === "true" ? true : false,
            liveStreamEnabled:
              paramKeys.liveStreamEnabled === "true" ? true : false,
            autoStartLiveStream:
              paramKeys.autoStartLiveStream === "true" ? true : false,
            liveStreamOutputs: paramKeys.liveStreamOutputs,
            brandLogoURL:
              paramKeys.brandLogoURL?.length > 0
                ? paramKeys.brandLogoURL
                : null,
            brandName:
              paramKeys.brandName?.length > 0 ? paramKeys.brandName : null,
            participantCanLeave:
              paramKeys.participantCanLeave === "false" ? false : true,
            askJoin: paramKeys.askJoin === "true" ? true : false,
            participantCanToggleOtherMic:
              paramKeys.participantCanToggleOtherMic === "true" ? true : false,
            participantCanToggleOtherWebcam:
              paramKeys.participantCanToggleOtherWebcam === "true"
                ? true
                : false,
            notificationSoundEnabled:
              paramKeys.notificationSoundEnabled === "true" ? true : false,
            layout: paramKeys.layout,
            canPin: paramKeys.canPin === "true" ? true : false,
            selectedMic,
            selectedWebcam,
            joinScreenWebCam,
            joinScreenMic,
            canRemoveOtherParticipant:
              paramKeys.canRemoveOtherParticipant === "true" ? true : false,
            canEndMeeting: paramKeys.canEndMeeting === "true" ? true : false,
            canDrawOnWhiteboard:
              paramKeys.canDrawOnWhiteboard === "true" ? true : false,
            canToggleWhiteboard:
              paramKeys.canToggleWhiteboard === "true" ? true : false,
            meetingLeft,
            setMeetingLeft,
            animationsEnabled:
              paramKeys.animationsEnabled === "false" ? false : true,
            topbarEnabled: paramKeys.topbarEnabled === "false" ? false : true,
            notificationAlertsEnabled:
              paramKeys.notificationAlertsEnabled === "false" ? false : true,
            debug: paramKeys.debug === "true" ? true : false,
            layoutGridSize: paramKeys.layoutGridSize,
            recordingLayoutType: paramKeys.recordingLayoutType,
            recordingLayoutPriority: paramKeys.recordingLayoutPriority,
            recordingLayoutGridSize: paramKeys.recordingLayoutGridSize,
            hideLocalParticipant:
              paramKeys.hideLocalParticipant === "true" ? true : false,
            alwaysShowOverlay:
              paramKeys.alwaysShowOverlay === "true" ? true : false,
            sideStackSize: paramKeys.sideStackSize,
            reduceEdgeSpacing:
              paramKeys.reduceEdgeSpacing === "true" ? true : false,
          }}
        >
          <MeetingProvider
            config={{
              meetingId: meetingIdValidation.meetingId,
              micEnabled: joinScreenMic,
              webcamEnabled: joinScreenWebCam,
              name: name,
              maxResolution:
                paramKeys.maxResolution === "sd" ||
                paramKeys.maxResolution === "hd"
                  ? paramKeys.maxResolution
                  : "sd",
              participantId: paramKeys.participantId,
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
            micEnabled: paramKeys.micEnabled === "true",
            webcamEnabled: paramKeys.webcamEnabled === "true",
          }}
          name={name}
          setName={setName}
          setSelectedMic={setSelectedMic}
          setSelectedWebcam={setSelectedWebcam}
          meetingUrl={paramKeys.joinScreenMeetingUrl}
          meetingTitle={paramKeys.joinScreenTitle}
          participantCanToggleSelfWebcam={
            paramKeys.participantCanToggleSelfWebcam
          }
          participantCanToggleSelfMic={paramKeys.participantCanToggleSelfMic}
        />
      ) : (
        <ClickAnywhereToContinue
          onClick={() => {
            setUserHasInteracted(true);
          }}
          title="Click anywhere to continue"
          brandLogoURL={paramKeys.brandLogoURL}
        />
      )}
      <ConfirmBox
        open={meetingError.isVisible}
        successText="OKAY"
        onSuccess={() => {
          setMeetingError(({ message }) => {
            throw new Error(message);

            // return {
            //   message: null,
            //   code: null,
            //   isVisible: false,
            // };
          });
        }}
        title={`Error Code: ${meetingError.code}`}
        subTitle={meetingError.message}
      />
    </>
  );
};

export default App;
