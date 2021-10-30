import { makeStyles } from "@material-ui/core";
import { SnackbarProvider } from "notistack";
import { useContext, createContext, useState, useEffect, useRef } from "react";
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
  whiteBoardEnabled,
  participantCanToggleSelfWebcam,
  participantCanToggleSelfMic,
  participantCanToggleSelfScreenShare,
  raiseHandEnabled,
  recordingEnabled,
  recordingWebhookUrl,
  recordingEnabledByDefault,
  participantCanToggleRecording,
  brandingEnabled,
  brandLogoURL,
  brandName,
  participantCanLeave,
  poweredBy,
  liveStreamEnabled,
  autoStartLiveStream,
  liveStreamOutputs,
  askJoin,
  participantCanToggleOtherMic,
  participantCanToggleOtherWebcam,
  notificationSoundEnabled,
  layout,
  canPin,
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
  // const [meetingLayout, setMeetingLayout] = useState(meetingLayouts[layout]);
  // const [pinnedParticipants, setPinnedParticipants] = useState(new Map());

  useEffect(() => {
    if (!validURL(redirectOnLeave)) {
      throw new Error("Ridirect url not valid");
    }
  }, [redirectOnLeave]);

  return (
    <MeetingAppContext.Provider
      value={{
        // refs
        containerRef,
        endCallContainerRef,
        // params
        redirectOnLeave,
        chatEnabled,
        screenShareEnabled,
        pollEnabled,
        whiteBoardEnabled,
        participantCanToggleSelfWebcam,
        participantCanToggleSelfMic,
        participantCanToggleSelfScreenShare,
        raiseHandEnabled,
        recordingEnabled,
        recordingWebhookUrl,
        recordingEnabledByDefault,
        participantCanToggleRecording,
        brandingEnabled,
        brandLogoURL,
        brandName,
        participantCanLeave,
        poweredBy,
        liveStreamEnabled,
        autoStartLiveStream,
        liveStreamOutputs,
        askJoin,
        participantCanToggleOtherMic,
        participantCanToggleOtherWebcam,
        notificationSoundEnabled,
        // states
        sideBarMode,
        activeSortedParticipants,
        mainViewParticipants,
        overlaidInfoVisible,
        raisedHandsParticipants,
        userHasInteracted,
        // pinnedParticipants,
        meetingLayout: layout,
        canPin,
        // setters
        setSideBarMode,
        setActiveSortedParticipants,
        setMainViewParticipants,
        setOverlaidInfoVisible,
        setRaisedHandsParticipants,
        setUserHasInteracted,
        // setPinnedParticipants,
        // setMeetingLayout,
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
