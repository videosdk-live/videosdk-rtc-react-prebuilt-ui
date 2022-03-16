import { makeStyles } from "@material-ui/core";
import { SnackbarProvider } from "notistack";
import {
  useContext,
  createContext,
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { validURL } from "./utils/common";
import useIsMobile from "./utils/useIsMobile";
import useIsTab from "./utils/useIsTab";

export const MeetingAppContext = createContext();

export const useMeetingAppContext = () => useContext(MeetingAppContext);

export const sideBarModes = {
  PARTICIPANTS: "PARTICIPANTS",
  CHAT: "CHAT",
  ACTIVITIES: "ACTIVITIES",
  ADD_LIVE_STREAM: "ADD_LIVE_STREAM",
  CONFIGURATION: "CONFIGURATION",
};

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
  },
}));

export const meetingLayouts = {
  SPOTLIGHT: "SPOTLIGHT",
  SIDEBAR: "SIDEBAR",
  GRID: "GRID",
  UNPINNED_SIDEBAR: "UNPINNED_SIDEBAR",
  UNPINNED_SPOTLIGHT: "UNPINNED_SPOTLIGHT",
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
  recordingWebhookUrl,
  recordingAWSDirPath,
  autoStartRecording,
  participantCanToggleRecording,
  brandingEnabled,
  brandLogoURL,
  brandName,
  participantCanLeave,
  canEndMeeting,
  poweredBy,
  liveStreamEnabled,
  autoStartLiveStream,
  liveStreamLayoutType,
  liveStreamLayoutPriority,
  liveStreamLayoutGridSize,
  liveStreamOutputs,
  askJoin,
  participantCanToggleOtherMic,
  participantCanToggleOtherWebcam,
  canRemoveOtherParticipant,
  notificationSoundEnabled,
  canPin,
  selectedMic,
  selectedWebcam,
  joinScreenWebCam,
  joinScreenMic,
  canToggleWhiteboard,
  canDrawOnWhiteboard,
  meetingLeft,
  setMeetingLeft,
  animationsEnabled,
  topbarEnabled,
  notificationAlertsEnabled,
  debug,
  layout,
  layoutPriority,
  meetingLayoutTopic,
  layoutGridSize,
  recordingLayoutType,
  recordingLayoutPriority,
  recordingLayoutGridSize,
  hideLocalParticipant,
  alwaysShowOverlay,
  sideStackSize,
  canChangeLayout,

  participantCanToggleLivestream,
  reduceEdgeSpacing,
  isRecorder,
}) => {
  const containerRef = useRef();
  const endCallContainerRef = useRef();

  const classes = useStyles();
  const [sideBarMode, setSideBarMode] = useState(null);
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
    type: layout,
    gridSize: layoutGridSize,
    priority: layoutPriority,
  });
  // const [appMeetingLayout, setAppMeetingLayout] = useState({
  //   layoutType: type,
  //   layoutGridSize: gridSize,
  //   layoutPriority: priority,
  // });
  const [liveStreamConfig, setLiveStreamConfig] = useState([]);
  // const [meetinglayoutGridSize, setLayoutGridSize] = useState(layoutGridSize);
  // const [layoutPriority, setLayoutPriority] = useState(layout);

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

  return (
    <MeetingAppContext.Provider
      value={{
        // default options
        selectedMic,
        selectedWebcam,
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
        raiseHandEnabled,
        recordingEnabled,
        meetingLayoutTopic,
        recordingWebhookUrl,
        recordingAWSDirPath,
        autoStartRecording,
        participantCanToggleRecording,
        brandingEnabled,
        brandLogoURL,
        brandName,
        participantCanLeave,
        canEndMeeting,
        poweredBy,
        liveStreamEnabled,
        autoStartLiveStream,
        liveStreamLayoutType,
        liveStreamLayoutPriority,
        liveStreamLayoutGridSize,
        liveStreamOutputs,
        askJoin,
        participantCanToggleOtherMic,
        participantCanToggleOtherWebcam,
        canRemoveOtherParticipant,
        notificationSoundEnabled,
        canToggleWhiteboard,
        canDrawOnWhiteboard,
        animationsEnabled,
        topbarEnabled,
        notificationAlertsEnabled,
        debug,
        layout,
        layoutPriority,
        layoutGridSize,
        recordingLayoutType,
        recordingLayoutPriority,
        recordingLayoutGridSize,
        hideLocalParticipant,
        alwaysShowOverlay,
        sideStackSize,
        reduceEdgeSpacing,
        isRecorder,

        // states
        sideBarMode,
        activeSortedParticipants,
        mainViewParticipants,
        overlaidInfoVisible,
        raisedHandsParticipants,
        userHasInteracted,
        whiteboardStarted,
        whiteboardState,
        meetingLayout:
          appMeetingLayout.priority === "PIN"
            ? appMeetingLayout.type === meetingLayouts.SPOTLIGHT
              ? meetingLayouts.SPOTLIGHT
              : appMeetingLayout.type === meetingLayouts.SIDEBAR
              ? meetingLayouts.SIDEBAR
              : meetingLayouts.GRID
            : appMeetingLayout.type === meetingLayouts.SPOTLIGHT
            ? meetingLayouts.UNPINNED_SPOTLIGHT
            : appMeetingLayout.type === meetingLayouts.SIDEBAR
            ? meetingLayouts.UNPINNED_SIDEBAR
            : meetingLayouts.GRID,
        appMeetingLayout,
        canPin,
        meetingLeft,
        liveStreamConfig,

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
      }}
    >
      <SnackbarProvider
        className={classes.container}
        autoHideDuration={5000}
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
