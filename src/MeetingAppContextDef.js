import { useTheme } from "@mui/material";

import { SnackbarProvider } from "notistack";
import {
  useContext,
  createContext,
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { RECORDER_MAX_GRID_SIZE } from "./CONSTS";
import { validURL } from "./utils/common";
import useIsMobile from "./utils/useIsMobile";
import useIsTab from "./utils/useIsTab";
import { VirtualBackgroundProcessor } from "@videosdk.live/videosdk-media-processor-web";

export const MeetingAppContext = createContext();

export const useMeetingAppContext = () => useContext(MeetingAppContext);

export const sideBarModes = {
  PARTICIPANTS: "PARTICIPANTS",
  CHAT: "CHAT",
  ACTIVITIES: "ACTIVITIES",
  ADD_LIVE_STREAM: "ADD_LIVE_STREAM",
  CONFIGURATION: "CONFIGURATION",
};

export const sideBarNestedModes = {
  POLLS: "POLLS",
  CREATE_POLL: "CREATE_POLL",
  QNA: "QNA",
  ADD_LIVE_STREAM: "ADD_LIVE_STREAM",
  VIRTUAL_BACKGROUND: "VIRTUAL_BACKGROUND",
};

export const meetingLayouts = {
  SPOTLIGHT: "SPOTLIGHT",
  SIDEBAR: "SIDEBAR",
  GRID: "GRID",
  UNPINNED_SIDEBAR: "UNPINNED_SIDEBAR",
  UNPINNED_SPOTLIGHT: "UNPINNED_SPOTLIGHT",
};

export const meetingLayoutPriorities = {
  SPEAKER: "SPEAKER",
  PIN: "PIN",
};

export const meetingLayoutTopics = {
  MEETING_LAYOUT: "MEETING_LAYOUT",
  RECORDING_LAYOUT: "RECORDING_LAYOUT",
  LIVE_STREAM_LAYOUT: "LIVE_STREAM_LAYOUT",
  HLS_LAYOUT: "HLS_LAYOUT",
};

export const appThemes = {
  DARK: "DARK",
  LIGHT: "LIGHT",
};

export const MeetingAppProvider = ({
  children,
  redirectOnLeave,
  chatEnabled,
  screenShareEnabled,
  pollEnabled,
  whiteboardEnabled,
  participantCanToggleSelfWebcam,
  participantCanToggleSelfMic,
  raiseHandEnabled,
  recordingEnabled,
  realtimeTranscriptionEnabled,
  recordingWebhookUrl,
  recordingAWSDirPath,
  autoStartRecording,
  recordingTheme,
  hlsTheme,
  liveStreamTheme,
  autoStartHls,
  participantCanToggleRecording,
  participantCanToggleRealtimeTranscription,
  participantCanToggleHls,
  brandingEnabled,
  brandLogoURL,
  brandName,
  waitingScreenImageUrl,
  waitingScreenText,
  participantCanLeave,
  participantCanEndMeeting,
  poweredBy,
  liveStreamEnabled,
  hlsEnabled,
  autoStartLiveStream,
  // liveStreamLayoutType,
  // liveStreamLayoutPriority,
  // liveStreamLayoutGridSize,
  liveStreamOutputs,
  askJoin,
  participantCanToggleOtherMic,
  participantCanToggleOtherWebcam,
  partcipantCanToogleOtherScreenShare,
  participantTabPanelEnabled,
  moreOptionsEnabled,
  participantCanToggleOtherMode,
  canRemoveOtherParticipant,
  notificationSoundEnabled,
  canPin,
  canCreatePoll,
  canToggleParticipantTab,
  selectedSpeaker,
  selectedMic,
  setSelectedMic,
  setSelectedWebcam,
  setSelectedSpeaker,
  selectedWebcam,
  joinScreenWebCam,
  joinScreenMic,
  canToggleWhiteboard,
  canToggleVirtualBackground,
  canDrawOnWhiteboard,
  meetingLeft,
  setMeetingLeft,
  animationsEnabled,
  topbarEnabled,
  notificationAlertsEnabled,
  debug,
  mode,
  layoutType,
  layoutPriority,
  meetingLayoutTopic,
  layoutGridSize,
  // recordingLayoutType,
  // recordingLayoutPriority,
  // recordingLayoutGridSize,
  hideLocalParticipant,
  alwaysShowOverlay,
  sideStackSize,
  canChangeLayout,

  participantCanToggleLivestream,
  reduceEdgeSpacing,
  isRecorder,
  maintainVideoAspectRatio,
  maintainLandscapeVideoAspectRatio,
  networkBarEnabled,
  hlsPlayerControlsVisible,
  appTheme,
  token,

  cameraResolution,
  cameraId,
  cameraOptimizationMode,
  cameraMultiStream,
  screenShareResolution,
  screenShareOptimizationMode,
  micQuality,
  joinWithoutUserInteraction,
  webcamEnabled,
  realtimeTranscriptionVisible,
}) => {
  const containerRef = useRef();
  const endCallContainerRef = useRef();
  const theme = useTheme();

  const [sideBarMode, setSideBarMode] = useState(null);
  const [sideBarNestedMode, setSideBarNestedMode] = useState(null);
  const [selectWebcamDeviceId, setSelectWebcamDeviceId] = useState(
    cameraId ? cameraId : selectedWebcam.id
  );
  const [selectMicDeviceId, setSelectMicDeviceId] = useState(selectedMic.id);
  const [selectedOutputDeviceId, setSelectedOutputDeviceId] = useState(
    selectedMic.id
  );
  const [activeSortedParticipants, setActiveSortedParticipants] = useState([]);
  const [mainViewParticipants, setMainViewParticipants] = useState([]);
  const [overlaidInfoVisible, setOverlaidInfoVisible] = useState(true);
  const [raisedHandsParticipants, setRaisedHandsParticipants] = useState([]);
  const [userHasInteracted, setUserHasInteracted] = useState(true);
  const [whiteboardState, setWhiteboardState] = useState({
    started: false,
    state: null,
  });
  const [appMeetingLayout, setAppMeetingLayout] = useState({
    type: layoutType,
    gridSize: isRecorder ? RECORDER_MAX_GRID_SIZE : layoutGridSize,
    priority: layoutPriority,
  });
  const [liveStreamConfig, setLiveStreamConfig] = useState(
    liveStreamOutputs || []
  );
  const [meetingMode, setMeetingMode] = useState(mode);
  const [downstreamUrl, setDownstreamUrl] = useState(null);
  const [afterMeetingJoinedHLSState, setAfterMeetingJoinedHLSState] =
    useState(null);
  const [isMirrorViewChecked, setIsMirrorViewChecked] = useState(false);
  const [meetingResolution, setMeetingResolution] = useState(null);

  const [draftPolls, setDraftPolls] = useState([]);
  const [optionArr, setOptionArr] = useState([
    // {
    //   id: uuid(),
    //   question: null,
    //   options: [{ optionId: uuid(), option: null, isCorrect: false }],
    //   createdAt: new Date(),
    //   timeout: 0,
    //   isActive: false,
    // },
  ]);

  const [createdPolls, setCreatedPolls] = useState([]);
  const [endedPolls, setEndedPolls] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  const polls = useMemo(
    () =>
      createdPolls.map((poll) => ({
        ...poll,
        isActive:
          endedPolls.findIndex(({ pollId }) => pollId === poll.id) === -1,
      })),
    [createdPolls, endedPolls]
  );

  const whiteboardStarted = useMemo(
    () => whiteboardState.started,
    [whiteboardState]
  );

  useEffect(() => {
    if (!validURL(redirectOnLeave)) {
      throw new Error("Ridirect url not valid");
    }
  }, [redirectOnLeave]);

  const isMobile = useIsMobile();
  const isTab = useIsTab();

  const meetingLayout = useMemo(() => {
    return appMeetingLayout.priority === "PIN"
      ? appMeetingLayout.type === meetingLayouts.SPOTLIGHT
        ? meetingLayouts.SPOTLIGHT
        : appMeetingLayout.type === meetingLayouts.SIDEBAR
        ? meetingLayouts.SIDEBAR
        : meetingLayouts.GRID
      : appMeetingLayout.type === meetingLayouts.SPOTLIGHT
      ? meetingLayouts.UNPINNED_SPOTLIGHT
      : appMeetingLayout.type === meetingLayouts.SIDEBAR
      ? meetingLayouts.UNPINNED_SIDEBAR
      : meetingLayouts.GRID;
  }, [appMeetingLayout, meetingLayouts]);

  const videoProcessor = new VirtualBackgroundProcessor();

  return (
    <MeetingAppContext.Provider
      value={{
        // default options
        selectedMic,
        selectedWebcam,
        selectedSpeaker,
        joinScreenWebCam,
        joinScreenMic,
        canChangeLayout,
        participantCanToggleLivestream,
        // refs
        containerRef,
        endCallContainerRef,

        // params
        redirectOnLeave,
        chatEnabled,
        screenShareEnabled,
        pollEnabled,
        whiteboardEnabled,
        participantCanToggleSelfWebcam,
        participantCanToggleSelfMic,
        participantTabPanelEnabled,
        moreOptionsEnabled,
        raiseHandEnabled,
        recordingEnabled,
        realtimeTranscriptionEnabled,
        meetingLayoutTopic,
        recordingWebhookUrl,
        recordingAWSDirPath,
        autoStartRecording,
        autoStartHls,
        recordingTheme,
        hlsTheme,
        liveStreamTheme,
        participantCanToggleRecording,
        participantCanToggleRealtimeTranscription,
        participantCanToggleHls,
        brandingEnabled,
        brandLogoURL,
        brandName,
        waitingScreenImageUrl,
        waitingScreenText,
        participantCanLeave,
        participantCanEndMeeting,
        poweredBy,
        liveStreamEnabled,
        hlsEnabled,
        autoStartLiveStream,
        // liveStreamLayoutType,
        // liveStreamLayoutPriority,
        // liveStreamLayoutGridSize,
        liveStreamOutputs,
        askJoin,
        participantCanToggleOtherMic,
        participantCanToggleOtherWebcam,
        partcipantCanToogleOtherScreenShare,
        participantCanToggleOtherMode,
        canRemoveOtherParticipant,
        notificationSoundEnabled,
        canToggleWhiteboard,
        canToggleVirtualBackground,
        canDrawOnWhiteboard,
        canCreatePoll,
        canToggleParticipantTab,
        animationsEnabled,
        topbarEnabled,
        notificationAlertsEnabled,
        debug,
        mode,
        layoutPriority: appMeetingLayout.priority,
        layoutGridSize: appMeetingLayout.gridSize,
        // recordingLayoutType,
        // recordingLayoutPriority,
        // recordingLayoutGridSize,
        hideLocalParticipant,
        alwaysShowOverlay,
        sideStackSize,
        reduceEdgeSpacing,
        realtimeTranscriptionVisible,

        isRecorder,
        maintainVideoAspectRatio,
        maintainLandscapeVideoAspectRatio,
        networkBarEnabled,
        appTheme,
        token,

        cameraResolution,
        cameraId,
        cameraOptimizationMode,
        cameraMultiStream,
        screenShareResolution,
        screenShareOptimizationMode,
        micQuality,
        joinWithoutUserInteraction,
        webcamEnabled,

        // states
        sideBarMode,
        activeSortedParticipants,
        mainViewParticipants,
        overlaidInfoVisible,
        raisedHandsParticipants,
        userHasInteracted,
        whiteboardStarted,
        whiteboardState,
        meetingLayout,
        appMeetingLayout,
        canPin,
        meetingLeft,
        liveStreamConfig,
        meetingMode,
        downstreamUrl,
        optionArr,
        polls,
        draftPolls,
        sideBarNestedMode,
        hlsPlayerControlsVisible,
        createdPolls,
        endedPolls,
        submissions,
        afterMeetingJoinedHLSState,
        selectMicDeviceId,
        selectWebcamDeviceId,
        selectedOutputDeviceId,
        isMirrorViewChecked,
        meetingResolution,

        // setters
        setSideBarMode,
        setActiveSortedParticipants,
        setMainViewParticipants,
        setOverlaidInfoVisible,
        setRaisedHandsParticipants,
        setUserHasInteracted,
        setWhiteboardState,
        setMeetingLeft,
        setLiveStreamConfig,
        setAppMeetingLayout,
        setMeetingMode,
        setDownstreamUrl,
        setOptionArr,
        setDraftPolls,
        setSideBarNestedMode,
        setCreatedPolls,
        setEndedPolls,
        setSubmissions,
        setAfterMeetingJoinedHLSState,
        
        setSelectMicDeviceId,
        setSelectedMic,
        setSelectedWebcam,
        setSelectedSpeaker,
        setSelectWebcamDeviceId,
        setSelectedOutputDeviceId,
        setIsMirrorViewChecked,
        setMeetingResolution,

        videoProcessor,
      }}
    >
      <SnackbarProvider
        autoHideDuration={5000}
        style={{
          backgroundColor:
            appTheme === appThemes.DARK
              ? theme.palette.darkTheme.seven
              : appTheme === appThemes.LIGHT
              ? theme.palette.lightTheme.main
              : theme.palette.background.paper,
          color:
            appTheme === appThemes.LIGHT &&
            theme.palette.lightTheme.contrastText,
        }}
        maxSnack={3}
        anchorOrigin={{
          vertical: isTab || isMobile ? "top" : "bottom",
          horizontal: "left",
        }}
      >
        {children}
      </SnackbarProvider>
    </MeetingAppContext.Provider>
  );
};
