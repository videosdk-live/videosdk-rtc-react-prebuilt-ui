import React, { useEffect, useMemo, useState } from "react";
import MeetingContainer from "./meetingContainer/MeetingContainer";
import { MeetingProvider } from "@videosdk.live/react-sdk";
import {
  MeetingAppProvider,
  meetingLayoutPriorities,
  meetingLayouts,
  meetingLayoutTopics,
} from "./MeetingAppContextDef";
import JoinMeeting from "./components/JoinScreen";
import ClickAnywhereToContinue from "./components/ClickAnywhereToContinue";
import { Box, CircularProgress } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import MeetingLeftScreen from "./components/MeetingLeftScreen";
import ConfirmBox from "./components/ConfirmBox";
import {
  maxParticipantGridCount_large_desktop,
  maxParticipantGridCount_desktop,
  maxParticipantGridCount_tab,
  maxParticipantGridCount_mobile,
} from "./utils/common";
import useIsSMDesktop from "./utils/useIsSMDesktop";
import useIsLGDesktop from "./utils/useIsLGDesktop";
import useIsTab from "./utils/useIsTab";
import { version as prebuiltSDKVersion } from "../package.json";

const App = () => {
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

  const getParams = ({ maxGridSize }) => {
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
      raiseHandEnabled: "raiseHandEnabled",
      //
      participantCanToggleSelfWebcam: "participantCanToggleSelfWebcam",
      participantCanToggleSelfMic: "participantCanToggleSelfMic",
      participantCanToggleRecording: "participantCanToggleRecording",
      participantCanLeave: "participantCanLeave",
      participantCanToggleOtherWebcam: "participantCanToggleOtherWebcam",
      participantCanToggleOtherMic: "participantCanToggleOtherMic",
      participantCanToggleLivestream: "participantCanToggleLivestream",
      participantCanEndMeeting: "participantCanEndMeeting",
      //
      recordingEnabled: "recordingEnabled",
      recordingWebhookUrl: "recordingWebhookUrl",
      recordingAWSDirPath: "recordingAWSDirPath",
      autoStartRecording: "autoStartRecording",
      //
      brandingEnabled: "brandingEnabled",
      brandLogoURL: "brandLogoURL",
      brandName: "brandName",
      poweredBy: "poweredBy",
      //
      liveStreamEnabled: "liveStreamEnabled",
      autoStartLiveStream: "autoStartLiveStream",
      liveStreamOutputs: "liveStreamOutputs",
      //
      askJoin: "askJoin",
      //
      joinScreenEnabled: "joinScreenEnabled",
      joinScreenMeetingUrl: "joinScreenMeetingUrl",
      joinScreenTitle: "joinScreenTitle",
      //
      notificationSoundEnabled: "notificationSoundEnabled",
      canPin: "canPin",
      canRemoveOtherParticipant: "canRemoveOtherParticipant",
      canDrawOnWhiteboard: "canDrawOnWhiteboard",
      canToggleWhiteboard: "canToggleWhiteboard",
      //
      leftScreenActionButtonLabel: "leftScreenActionButtonLabel",
      leftScreenActionButtonHref: "leftScreenActionButtonHref",
      leftScreenRejoinButtonEnabled: "leftScreenRejoinButtonEnabled",
      //
      maxResolution: "maxResolution",
      animationsEnabled: "animationsEnabled",
      topbarEnabled: "topbarEnabled",
      notificationAlertsEnabled: "notificationAlertsEnabled",
      debug: "debug",
      participantId: "participantId",
      //
      layoutType: "layoutType",
      layoutGridSize: "layoutGridSize",
      layoutPriority: "layoutPriority",
      meetingLayoutTopic: "meetingLayoutTopic",
      //
      isRecorder: "isRecorder",
      hideLocalParticipant: "hideLocalParticipant",
      alwaysShowOverlay: "alwaysShowOverlay",
      sideStackSize: "sideStackSize",
      reduceEdgeSpacing: "reduceEdgeSpacing",
      joinWithoutUserInteraction: "joinWithoutUserInteraction",
      rawUserAgent: "rawUserAgent",
      canChangeLayout: "canChangeLayout",
      region: "region",
      preferredProtocol: "preferredProtocol",
      // liveStreamLayoutType: "liveStreamLayoutType",
      // liveStreamLayoutPriority: "liveStreamLayoutPriority",
      // liveStreamLayoutGridSize: "liveStreamLayoutGridSize",
      // recordingLayoutType: "recordingLayoutType",
      // recordingLayoutPriority: "recordingLayoutPriority",
      // recordingLayoutGridSize: "recordingLayoutGridSize",
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
      paramKeys.liveStreamEnabled = "false";
    }
    if (typeof paramKeys.autoStartLiveStream !== "string") {
      paramKeys.autoStartLiveStream = "false";
    }
    if (typeof paramKeys.participantCanToggleLivestream !== "string") {
      paramKeys.participantCanToggleLivestream = "false";
    }

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

    if (typeof paramKeys.canPin !== "string") {
      paramKeys.canPin = "false";
    }

    switch (paramKeys?.layoutType?.toUpperCase()) {
      case meetingLayouts.GRID:
      case meetingLayouts.SPOTLIGHT:
      case meetingLayouts.SIDEBAR:
        paramKeys.layoutType = paramKeys.layoutType.toUpperCase();
        break;
      default:
        paramKeys.layoutType = meetingLayouts.GRID;
        break;
    }

    switch (paramKeys.layoutPriority?.toUpperCase()) {
      case meetingLayoutPriorities.PIN:
      case meetingLayoutPriorities.SPEAKER:
        paramKeys.layoutPriority = paramKeys.layoutPriority.toUpperCase();
        break;
      default:
        paramKeys.layoutPriority = meetingLayoutPriorities.SPEAKER;
        break;
    }

    paramKeys.layoutGridSize = parseInt(paramKeys.layoutGridSize);

    if (paramKeys.layoutGridSize <= 0 || isNaN(paramKeys.layoutGridSize)) {
      paramKeys.layoutGridSize = maxGridSize;
    }

    if (paramKeys.isRecorder === "true") {
      paramKeys.micEnabled = "false";
      paramKeys.webcamEnabled = "false";
      paramKeys.hideLocalParticipant = "true";
      paramKeys.alwaysShowOverlay = "true";
      paramKeys.sideStackSize = "5";
      paramKeys.reduceEdgeSpacing = "true";
      paramKeys.topbarEnabled = "false";
      paramKeys.notificationSoundEnabled = "false";
      paramKeys.notificationAlertsEnabled = "false";
      paramKeys.animationsEnabled = "false";
      paramKeys.redirectOnLeave = undefined;
    }

    paramKeys.sideStackSize = parseInt(paramKeys.sideStackSize);

    if (
      typeof paramKeys.sideStackSize === "number" &&
      paramKeys.sideStackSize <= 0
    ) {
      configErr = `"sideStackSize" is not a valid number`;
      playNotificationErr();
      setMeetingError({ message: configErr, code: 4001, isVisible: true });
    }

    // validate meetingLayoutTopic here
    switch (paramKeys.meetingLayoutTopic?.toUpperCase()) {
      case meetingLayoutTopics.MEETING_LAYOUT:
      case meetingLayoutTopics.RECORDING_LAYOUT:
      case meetingLayoutTopics.LIVE_STREAM_LAYOUT:
      case meetingLayoutTopics.HLS_LAYOUT:
        paramKeys.meetingLayoutTopic =
          paramKeys.meetingLayoutTopic.toUpperCase();
        break;
      default:
        paramKeys.meetingLayoutTopic = meetingLayoutTopics.MEETING_LAYOUT;
        break;
    }

    if (!paramKeys.region || typeof paramKeys.region !== "string") {
      paramKeys.region = "sg001";
    }

    // switch (paramKeys.region?.toLowerCase()) {
    //   case "sg001":
    //   case "eu001":
    //   case "us001":
    //   case "uk001":
    //   case "uae001":
    //     paramKeys.region = paramKeys.region.toLowerCase();
    //     break;
    //   default:
    //     paramKeys.region = "sg001";
    //     break;
    // }

    if (typeof paramKeys.preferredProtocol !== "string") {
      paramKeys.preferredProtocol = "UDP_ONLY";
    }

    switch (paramKeys.preferredProtocol.toUpperCase()) {
      case "UDP_ONLY":
      case "UDP_OVER_TCP":
        paramKeys.preferredProtocol = paramKeys.preferredProtocol.toUpperCase();
        break;
      default:
        paramKeys.preferredProtocol = "UDP_ONLY";
        break;
    }

    return paramKeys;
  };

  const isLGDesktop = useIsLGDesktop();
  const isSMDesktop = useIsSMDesktop();
  const isTab = useIsTab();

  const maxGridSize = useMemo(() => {
    return isLGDesktop
      ? maxParticipantGridCount_large_desktop
      : isSMDesktop
      ? maxParticipantGridCount_desktop
      : isTab
      ? maxParticipantGridCount_tab
      : maxParticipantGridCount_mobile;
  }, [isLGDesktop, isSMDesktop, isTab]);

  const paramKeys = useMemo(() => getParams({ maxGridSize }), [maxGridSize]);

  const [userHasInteracted, setUserHasInteracted] = useState(
    paramKeys.joinWithoutUserInteraction === "true"
  );

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

  const validateMeetingId = async ({ meetingId, token, debug, region }) => {
    const BASE_URL = "https://api.videosdk.live";

    const urlMeetingId = `${BASE_URL}/v1/prebuilt/meetings/${meetingId}`;

    const resMeetingId = await fetch(urlMeetingId, {
      method: "POST",
      headers: { "Content-type": "application/json", Authorization: token },
      body: JSON.stringify({ region }),
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
    if (paramKeys.meetingId && paramKeys.token) {
      validateMeetingId({
        meetingId: paramKeys.meetingId,
        token: paramKeys.token,
        debug: paramKeys.debug === "true",
        region: paramKeys.region,
      });
    }
  }, [paramKeys]);

  const theme = useTheme();

  return (
    <>
      {meetingLeft ? (
        paramKeys.isRecorder === "true" ? null : (
          <MeetingLeftScreen
            brandLogoURL={paramKeys.brandLogoURL}
            leftScreenActionButtonLabel={paramKeys.leftScreenActionButtonLabel}
            leftScreenActionButtonHref={paramKeys.leftScreenActionButtonHref}
            leftScreenRejoinButtonEnabled={
              paramKeys.leftScreenRejoinButtonEnabled !== "false"
            }
            setMeetingLeft={setMeetingLeft}
          />
        )
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
            canChangeLayout: paramKeys.canChangeLayout === "true",
            meetingLayoutTopic: paramKeys.meetingLayoutTopic,
            recordingEnabled: paramKeys.recordingEnabled === "true",
            recordingWebhookUrl: paramKeys.recordingWebhookUrl,
            recordingAWSDirPath: paramKeys.recordingAWSDirPath,
            autoStartRecording: paramKeys.autoStartRecording === "true",
            participantCanToggleRecording:
              paramKeys.participantCanToggleRecording === "true",
            brandingEnabled: paramKeys.brandingEnabled === "true",
            poweredBy: paramKeys.poweredBy === "true",
            liveStreamEnabled: paramKeys.liveStreamEnabled === "true",
            autoStartLiveStream: paramKeys.autoStartLiveStream === "true",
            // liveStreamLayoutType: paramKeys.liveStreamLayoutType,
            // liveStreamLayoutPriority: paramKeys.liveStreamLayoutPriority,
            // liveStreamLayoutGridSize: paramKeys.liveStreamLayoutGridSize,
            liveStreamOutputs: paramKeys.liveStreamOutputs,
            brandLogoURL:
              paramKeys.brandLogoURL?.length > 0
                ? paramKeys.brandLogoURL
                : null,
            brandName:
              paramKeys.brandName?.length > 0 ? paramKeys.brandName : null,
            participantCanLeave: paramKeys.participantCanLeave !== "false",
            askJoin: paramKeys.askJoin === "true",
            participantCanToggleOtherMic:
              paramKeys.participantCanToggleOtherMic === "true",
            participantCanToggleOtherWebcam:
              paramKeys.participantCanToggleOtherWebcam === "true",
            participantCanToggleLivestream:
              paramKeys.participantCanToggleLivestream === "true",
            notificationSoundEnabled:
              paramKeys.notificationSoundEnabled === "true",
            layoutType: paramKeys.layoutType,
            layoutPriority: paramKeys.layoutPriority,
            canPin: paramKeys.canPin === "true",
            selectedMic,
            selectedWebcam,
            joinScreenWebCam,
            joinScreenMic,
            canRemoveOtherParticipant:
              paramKeys.canRemoveOtherParticipant === "true",
            participantCanEndMeeting:
              paramKeys.participantCanEndMeeting === "true",
            canDrawOnWhiteboard: paramKeys.canDrawOnWhiteboard === "true",
            canToggleWhiteboard: paramKeys.canToggleWhiteboard === "true",
            meetingLeft,
            setMeetingLeft,
            animationsEnabled: paramKeys.animationsEnabled !== "false",
            topbarEnabled: paramKeys.topbarEnabled !== "false",
            notificationAlertsEnabled:
              paramKeys.notificationAlertsEnabled !== "false",
            debug: paramKeys.debug === "true",
            layoutGridSize: paramKeys.layoutGridSize,
            // recordingLayoutType: paramKeys.recordingLayoutType,
            // recordingLayoutPriority: paramKeys.recordingLayoutPriority,
            // recordingLayoutGridSize: paramKeys.recordingLayoutGridSize,
            hideLocalParticipant: paramKeys.hideLocalParticipant === "true",
            alwaysShowOverlay: paramKeys.alwaysShowOverlay === "true",
            sideStackSize: paramKeys.sideStackSize,
            reduceEdgeSpacing: paramKeys.reduceEdgeSpacing === "true",
            isRecorder: paramKeys.isRecorder === "true",
          }}
        >
          <MeetingProvider
            config={{
              meetingId: meetingIdValidation.meetingId,
              micEnabled: joinScreenMic,
              webcamEnabled: joinScreenWebCam,
              name: name,
              maxResolution:
                paramKeys.isRecorder === "true"
                  ? "hd"
                  : paramKeys.maxResolution === "sd" ||
                    paramKeys.maxResolution === "hd"
                  ? paramKeys.maxResolution
                  : "sd",
              participantId: paramKeys.participantId,
              preferredProtocol: paramKeys.preferredProtocol,
            }}
            token={paramKeys.token}
            joinWithoutUserInteraction
            deviceInfo={{
              sdkType: "prebuilt",
              sdkVersion: prebuiltSDKVersion,
              rawUserAgent:
                paramKeys.rawUserAgent || typeof window !== "undefined"
                  ? window?.navigator?.userAgent
                  : null,
            }}
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
