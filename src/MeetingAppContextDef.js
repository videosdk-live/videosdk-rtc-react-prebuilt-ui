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

export const MeetingAppContext = createContext();

export const useMeetingAppContext = () => useContext(MeetingAppContext);

export const sideBarModes = {
  PARTICIPANTS: "PARTICIPANTS",
  CHAT: "CHAT",
  ACTIVITIES: "ACTIVITIES",
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
  liveStreamOutputs,
  askJoin,
  participantCanToggleOtherMic,
  participantCanToggleOtherWebcam,
  canRemoveOtherParticipant,
  notificationSoundEnabled,
  layout,
  canPin,
  selectedMic,
  selectedWebcam,
  joinScreenWebCam,
  joinScreenMic,
  canToggleWhiteboard,
  canDrawOnWhiteboard,
  meetingLeft,
  setMeetingLeft,
  debug,
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

  const whiteboardStarted = useMemo(
    () => whiteboardState.started,
    [whiteboardState]
  );

  useEffect(() => {
    if (!validURL(redirectOnLeave)) {
      throw new Error("Ridirect url not valid");
    }
  }, [redirectOnLeave]);

  return (
    <MeetingAppContext.Provider
      value={{
        // default options
        selectedMic,
        selectedWebcam,
        joinScreenWebCam,
        joinScreenMic,
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
        liveStreamOutputs,
        askJoin,
        participantCanToggleOtherMic,
        participantCanToggleOtherWebcam,
        canRemoveOtherParticipant,
        notificationSoundEnabled,
        canToggleWhiteboard,
        canDrawOnWhiteboard,
        debug,
        // states
        sideBarMode,
        activeSortedParticipants,
        mainViewParticipants,
        overlaidInfoVisible,
        raisedHandsParticipants,
        userHasInteracted,
        whiteboardStarted,
        whiteboardState,
        meetingLayout: layout,
        canPin,
        meetingLeft,
        // setters
        setSideBarMode,
        setActiveSortedParticipants,
        setMainViewParticipants,
        setOverlaidInfoVisible,
        setRaisedHandsParticipants,
        setUserHasInteracted,
        setWhiteboardState,
        setMeetingLeft,
      }}
    >
      <SnackbarProvider
        className={classes.container}
        autoHideDuration={5000}
        maxSnack={3}
      >
        {children}
      </SnackbarProvider>
    </MeetingAppContext.Provider>
  );
};
