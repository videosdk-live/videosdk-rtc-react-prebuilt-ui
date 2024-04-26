import React, { useEffect, useMemo, useRef, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import {
  IconButton,
  Box,
  MenuItem,
  Popover,
  Tooltip,
  MenuList,
  Typography,
  Link,
  SwipeableDrawer,
  Grid,
  Checkbox,
} from "@mui/material";
import OutlineIconButton from "../components/OutlineIconButton";
import {
  Constants,
  useMediaDevice,
  useMeeting,
  usePubSub,
  useTranscription,
} from "@videosdk.live/react-sdk";
import {
  sideBarModes,
  appThemes,
  useMeetingAppContext,
  sideBarNestedModes,
} from "../MeetingAppContextDef";
import useIsTab from "../utils/useIsTab";
import useIsMobile from "../utils/useIsMobile";
import recordingBlink from "../animations/recording-blink.json";
import liveBlink from "../animations/live-blink.json";
import liveHLS from "../animations/live-hls.json";
import stoppingHLS from "../animations/hls_stop_blink.json";
import LiveIcon from "../icons/LiveIcon";
import RaiseHand from "../icons/RaiseHand";
import {
  Activities,
  Chat,
  EndCall,
  Participants,
  ScreenRecording,
  ScreenShare,
  LeaveMeetingIcon,
  EndCallIcon,
  MicOn,
} from "../icons";
import {
  MoreHoriz as MoreHorizIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Gesture,
  ClosedCaption,
  ClosedCaptionOutlined,
} from "@material-ui/icons";
import {
  isMobile as RDDIsMobile,
  isTablet as RDDIsTablet,
} from "react-device-detect";
import ConfirmBox from "../components/ConfirmBox";
import OutlineIconTextButton from "../components/OutlineIconTextButton";
import MobileIconButton from "../components/MobileIconButton";
import AddLiveStreamIcon from "../icons/AddLiveStreamIcon";
import useIsLivestreaming from "./useIsLivestreaming";
import useIsRecording from "./useIsRecording";
import useIsHls from "./useIsHls";
import { meetingModes } from "../CONSTS";
import WebCamOnIcon from "../icons/WebCamOnIcon";
import WebCamOffIcon from "../icons/WebCamOffIcon";
import ConfigIcon from "../icons/ConfigIcon";
import MicOffIcon from "../icons/MicOffIcon";
import MicrophoneIcon from "../icons/MicrophoneIcon";
import SpeakerMenuIcon from "../icons/SpeakerMenuIcon";
import SelectedIcon from "../icons/SelectedIcon";
import { useSnackbar } from "notistack";
import { VideoSDKNoiseSuppressor } from "@videosdk.live/videosdk-media-processor-web";
import useCustomTrack from "../utils/useCustomTrack";
import useIsTranscriptionRunning from "./useIsTranscriptionRunning";

const CustomBox = styled(Box)`
  &:hover {
    background: #2b303499;
  }
`;

const CustomBoxLight = styled(Box)`
  &:hover {
    background: #ccd2d899;
  }
`;
const CustomBoxDefault = styled(Box)`
  &:hover {
    background: #43425399;
  }
`;

const CustomMenuItem = styled(MenuItem)`
  &:hover {
    background: transparent;
  }
  &.MuiMenuItem-gutters {
    padding: 6px 28px;
  }
  &.Mui-selected {
    padding: 6px 12px;
  }
`;

const CustomWebcamMenuItem = styled(MenuItem)`
  &:hover {
    background: transparent !important;
  }
  &.MuiMenuItem-gutters {
    padding: 6px 18px;
  }
  &.Mui-selected {
    padding: 6px 18px;
    background: transparent;
  }
`;

const CustomIconButton = styled(IconButton)`
  &.MuiIconButton-root {
    padding: 3px;
  }
`;

const BpIcon = styled("span")(({ theme }) => ({
  borderRadius: 12,
  padding: 0,
  margin: 0,
  width: 10,
  height: 10,
  border: `2px solid ${theme.palette.text.secondary}`,
  "input:disabled ~ &": {
    boxShadow: "none",
    background: theme.palette.text.secondary,
  },
}));

const BpCheckedIcon = styled(SelectedIcon)({
  "&:before": {
    display: "block",
    width: 10,
    height: 10,
    backgroundImage:
      "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
      " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
      "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
    content: '""',
  },
});

const BpCheckedLightIcon = styled(SelectedIcon)({
  "&:before": {
    display: "block",
    width: 10,
    height: 10,
    backgroundImage:
      "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
      " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
      "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
    content: '""',
  },
});

function BpCheckbox(CheckboxProps) {
  const { appTheme } = useMeetingAppContext();
  return (
    <Checkbox
      disableRipple
      disableFocusRipple
      color="default"
      checkedIcon={
        appTheme === appThemes.LIGHT || appTheme === appThemes.DARK ? (
          <BpCheckedLightIcon />
        ) : (
          <BpCheckedIcon />
        )
      }
      icon={<BpIcon />}
      style={{
        paddingTop: 0,
        paddingBottom: 0,
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        backgroundColor: "transparent",
      }}
      {...CheckboxProps}
    />
  );
}

// const useStyles = makeStyles({
//   row: { display: "flex", alignItems: "center" },
//   borderRight: { borderRight: "1ps solid #ffffff33" },
//   popover: { backgroundColor: "transparent" },
//   popoverBorder: {
//     borderRadius: "12px",
//     backgroundColor: "#212032",
//     marginTop: 8,
//     width: 300,
//   },
//   popoverHover: {
//     "&:hover": {
//       backgroundColor: "#CCD2D899",
//     },
//   },
//   popoverHoverDark: {
//     "&:hover": {
//       backgroundColor: "#2B303499",
//     },
//   },
//   popoverHoverDefault: {
//     "&:hover": {
//       backgroundColor: "#43425399",
//     },
//   },
//   menuItemHover: {
//     "&:hover": {
//       backgroundColor: "transparent",
//     },
//   },
//   menuItemDark: {
//     "&:hover": {
//       backgroundColor: "transparent",
//     },
//   },
//   menuItemDefault: {
//     "&:hover": {
//       backgroundColor: "transparent",
//     },
//   },
//   singleMenuItemGutters: {
//     padding: "6px 2px",
//   },
//   singleMenuItemGuttersAfterSelect: {
//     padding: "6px 12px",
//   },
//   menuItemGutters: {
//     padding: "6px 28px",
//   },
//   menuItemGuttersAfterSelect: {
//     padding: "6px 12px",
//   },
// });

const RaiseHandBTN = ({ onClick, isMobile, isTab }) => {
  const { publish } = usePubSub("RAISE_HAND");
  // const classes = useStyles();
  const onRaiseHand = () => {
    if (isMobile || isTab) {
      onClick();
      typeof onClick === "function" && onClick();
      publish("Raise Hand");
    } else {
      publish("Raise Hand");
    }
  };

  return isMobile || isTab ? (
    <Tooltip>
      <MobileIconButton
        id="RaiseHandBTN"
        tooltipTitle={"Raise hand"}
        Icon={RaiseHand}
        onClick={onRaiseHand}
        buttonText={"Raise Hand"}
      />
    </Tooltip>
  ) : (
    <Tooltip>
      <OutlineIconButton
        tooltipTitle={"Raise hand"}
        Icon={RaiseHand}
        onClick={onRaiseHand}
      />
    </Tooltip>
  );
};
const ParticipantsBTN = ({ onClick, isMobile, isTab }) => {
  const {
    sideBarMode,
    setSideBarMode,
    meetingMode,
    canToggleParticipantTab,
    appTheme,
  } = useMeetingAppContext();

  const mMeeting = useMeeting();
  const theme = useTheme();
  const participants = mMeeting?.participants;
  const participantsCount = participants ? new Map(participants).size : 0;

  return isMobile || isTab ? (
    <MobileIconButton
      tooltipTitle={"Participants"}
      isFocused={sideBarMode === sideBarModes.PARTICIPANTS}
      buttonText={"Participants"}
      disabledOpacity={1}
      Icon={Participants}
      disabled={meetingMode === meetingModes.VIEWER || !canToggleParticipantTab}
      onClick={() => {
        typeof onClick === "function" && onClick();
        setSideBarMode((s) =>
          s === sideBarModes.PARTICIPANTS ? null : sideBarModes.PARTICIPANTS
        );
      }}
      badge={participantsCount}
    />
  ) : (
    <OutlineIconButton
      tooltipTitle={"Participants"}
      isFocused={sideBarMode === sideBarModes.PARTICIPANTS}
      Icon={Participants}
      disabledOpacity={1}
      focusBGColor={
        appTheme === appThemes.LIGHT && theme.palette.lightTheme.contrastText
      }
      disabled={meetingMode === meetingModes.VIEWER || !canToggleParticipantTab}
      onClick={() => {
        typeof onClick === "function" && onClick();
        setSideBarMode((s) =>
          s === sideBarModes.PARTICIPANTS ? null : sideBarModes.PARTICIPANTS
        );
      }}
      badge={participantsCount}
    />
  );
};
const ConfigBTN = ({ isMobile, isTab }) => {
  const { sideBarMode, setSideBarMode, appTheme, setSideBarNestedMode } =
    useMeetingAppContext();
  const theme = useTheme();

  return isMobile || isTab ? (
    <MobileIconButton
      tooltipTitle={"Configuration"}
      buttonText={"Configuration"}
      Icon={ConfigIcon}
      isFocused={sideBarMode === sideBarModes.CONFIGURATION}
      onClick={() => {
        setSideBarNestedMode(null);
        setSideBarMode((s) =>
          s === sideBarModes.CONFIGURATION ? null : sideBarModes.CONFIGURATION
        );
      }}
    />
  ) : (
    <OutlineIconButton
      tooltipTitle={"Configuration"}
      Icon={ConfigIcon}
      focusBGColor={
        appTheme === appThemes.LIGHT && theme.palette.lightTheme.contrastText
      }
      isFocused={sideBarMode === sideBarModes.CONFIGURATION}
      onClick={() => {
        setSideBarNestedMode(null);
        setSideBarMode((s) =>
          s === sideBarModes.CONFIGURATION ? null : sideBarModes.CONFIGURATION
        );
      }}
    />
  );
};
const ChatBTN = ({ isMobile, isTab }) => {
  const { sideBarMode, setSideBarMode, appTheme, setSideBarNestedMode } =
    useMeetingAppContext();
  const theme = useTheme();

  return isMobile || isTab ? (
    <MobileIconButton
      tooltipTitle={"Chat"}
      buttonText={"Chat"}
      Icon={Chat}
      isFocused={sideBarMode === sideBarModes.CHAT}
      onClick={() => {
        setSideBarNestedMode(null);
        setSideBarMode((s) =>
          s === sideBarModes.CHAT ? null : sideBarModes.CHAT
        );
      }}
    />
  ) : (
    <OutlineIconButton
      tooltipTitle={"Chat"}
      Icon={Chat}
      focusBGColor={
        appTheme === appThemes.LIGHT && theme.palette.lightTheme.contrastText
      }
      isFocused={sideBarMode === sideBarModes.CHAT}
      onClick={() => {
        setSideBarNestedMode(null);
        setSideBarMode((s) =>
          s === sideBarModes.CHAT ? null : sideBarModes.CHAT
        );
      }}
    />
  );
};
const ActivitiesBTN = ({ onClick, isMobile, isTab }) => {
  const { sideBarMode, setSideBarMode, setSideBarNestedMode, appTheme } =
    useMeetingAppContext();
  const theme = useTheme();

  return isMobile || isTab ? (
    <MobileIconButton
      Icon={Activities}
      tooltipTitle={"More Options"}
      buttonText={"More Options"}
      isFocused={sideBarMode === sideBarModes.ACTIVITIES}
      onClick={() => {
        typeof onClick === "function" && onClick();

        setSideBarMode((s) =>
          s === sideBarModes.ACTIVITIES ? null : sideBarModes.ACTIVITIES
        );

        setSideBarNestedMode(null);
      }}
    />
  ) : (
    <OutlineIconButton
      tooltipTitle={"More Options"}
      Icon={Activities}
      focusBGColor={
        appTheme === appThemes.LIGHT && theme.palette.lightTheme.contrastText
      }
      isFocused={sideBarMode === sideBarModes.ACTIVITIES}
      onClick={() => {
        typeof onClick === "function" && onClick();

        setSideBarMode((s) =>
          s === sideBarModes.ACTIVITIES ? null : sideBarModes.ACTIVITIES
        );
        setSideBarNestedMode(null);
      }}
    />
  );
};
const WhiteBoardBTN = ({ onClick, isMobile, isTab }) => {
  const {
    whiteboardStarted,
    whiteboardEnabled,
    canToggleWhiteboard,
    appTheme,
  } = useMeetingAppContext();
  const theme = useTheme();

  const mMeeting = useMeeting({});

  const presenterId = mMeeting?.presenterId;

  return (
    <>
      {whiteboardEnabled &&
        (isMobile || isTab ? (
          <MobileIconButton
            disabled={presenterId || !canToggleWhiteboard}
            tooltipTitle={"Whiteboard"}
            buttonText={"Whiteboard"}
            Icon={Gesture}
            isFocused={whiteboardStarted}
            focusIconColor={
              appTheme === appThemes.LIGHT &&
              theme.palette.lightTheme.contrastText
            }
            onClick={() => {
              typeof onClick === "function" && onClick();

              whiteboardStarted
                ? mMeeting.meeting.stopWhiteboard()
                : mMeeting.meeting.startWhiteboard();
            }}
          />
        ) : (
          <OutlineIconButton
            disabled={presenterId || !canToggleWhiteboard}
            tooltipTitle={"Whiteboard"}
            Icon={Gesture}
            isFocused={whiteboardStarted}
            focusBGColor={
              appTheme === appThemes.LIGHT &&
              theme.palette.lightTheme.contrastText
            }
            onClick={() => {
              typeof onClick === "function" && onClick();

              whiteboardStarted
                ? mMeeting.meeting.stopWhiteboard()
                : mMeeting.meeting.startWhiteboard();
            }}
          />
        ))}
    </>
  );
};
const ScreenShareBTN = ({ onClick, isMobile, isTab }) => {
  const mMeeting = useMeeting({});
  const {
    whiteboardStarted,
    appTheme,
    notificationSoundEnabled,
    notificationAlertsEnabled,
  } = useMeetingAppContext();
  const { enqueueSnackbar } = useSnackbar();

  const theme = useTheme();

  const localScreenShareOn = mMeeting?.localScreenShareOn;
  const presenterId = mMeeting?.presenterId;
  const presenterIdRef = useRef(presenterId);

  useEffect(() => {
    presenterIdRef.current = presenterId;
  }, [presenterId]);

  const { getCustomScreenShareTrack } = useCustomTrack();

  const toggleScreenShare = async () => {
    let track;
    if (!localScreenShareOn) track = await getCustomScreenShareTrack();

    if (presenterIdRef.current && !localScreenShareOn) {
      let participantName = null;
      mMeeting.participants.forEach((participant) => {
        if (participant.id === presenterIdRef.current) {
          participantName = participant.displayName;
        }
      });

      if (notificationSoundEnabled) {
        new Audio(
          `https://static.videosdk.live/prebuilt/notification.mp3`
        ).play();
      }

      if (notificationAlertsEnabled) {
        enqueueSnackbar(
          `Screen sharing unavailable: ${participantName} is currently presenting.`
        );
      }
    } else {
      mMeeting?.toggleScreenShare(track);
    }
  };

  return isMobile || isTab ? (
    <MobileIconButton
      tooltipTitle={
        presenterId
          ? localScreenShareOn
            ? "Stop Presenting"
            : null
          : "Present Screen"
      }
      buttonText={
        presenterId
          ? localScreenShareOn
            ? "Stop Presenting"
            : null
          : "Present Screen"
      }
      isFocused={localScreenShareOn}
      Icon={ScreenShare}
      onClick={async () => {
        await toggleScreenShare();
        typeof onClick === "function" && onClick();
      }}
      disabled={
        RDDIsMobile || RDDIsTablet
          ? true
          : whiteboardStarted
          ? true
          : presenterId
          ? localScreenShareOn
            ? false
            : true
          : false
      }
    />
  ) : (
    <OutlineIconButton
      tooltipTitle={
        presenterId
          ? localScreenShareOn
            ? "Stop Presenting"
            : null
          : "Present Screen"
      }
      isFocused={localScreenShareOn}
      focusBGColor={
        appTheme === appThemes.LIGHT && theme.palette.lightTheme.contrastText
      }
      Icon={ScreenShare}
      onClick={() => {
        typeof onClick === "function" && onClick();
        toggleScreenShare();
      }}
      disabled={
        RDDIsMobile || RDDIsTablet
          ? true
          : whiteboardStarted
          ? true
          : presenterId
          ? localScreenShareOn
            ? false
            : true
          : false
      }
    />
  );
};
const AddLiveStreamBTN = ({ isMobile, isTab }) => {
  const { sideBarMode, setSideBarMode } = useMeetingAppContext();

  return isMobile || isTab ? (
    <MobileIconButton
      tooltipTitle={"Add Live Streams"}
      Icon={AddLiveStreamIcon}
      buttonText={"Add Live Streams"}
      isFocused={sideBarMode === sideBarModes.ADD_LIVE_STREAM}
      onClick={() => {
        setSideBarMode((s) =>
          s === sideBarModes.ADD_LIVE_STREAM
            ? null
            : sideBarModes.ADD_LIVE_STREAM
        );
      }}
    />
  ) : (
    <OutlineIconTextButton
      tooltipTitle={"Add Live Streams"}
      buttonText="Add Live Streams"
      isFocused={sideBarMode === sideBarModes.ADD_LIVE_STREAM}
      onClick={() => {
        setSideBarMode((s) =>
          s === sideBarModes.ADD_LIVE_STREAM
            ? null
            : sideBarModes.ADD_LIVE_STREAM
        );
      }}
    />
  );
};
const TranscriptionBTN = ({ isMobile, isTab }) => {
  const { startTranscription, stopTranscription } = useTranscription();
  const mMeeting = useMeeting({});
  const theme = useTheme();
  // const [isTranscriptionRunning, setTranscriptionRunning] = useState(false);
  const transcriptionState = mMeeting?.transcriptionState;

  const isTranscriptionRunning = useIsTranscriptionRunning();
  const { participantCanToggleRealtimeTranscription, appTheme } =
    useMeetingAppContext();
  const { isRequestProcessing } = useMemo(
    () => ({
      isRequestProcessing:
        transcriptionState ===
          Constants.transcriptionEvents.TRANSCRIPTION_STARTING ||
        transcriptionState ===
          Constants.transcriptionEvents.TRANSCRIPTION_STOPPING,
    }),
    [transcriptionState]
  );
  const isTranscriptionRunningRef = useRef(isTranscriptionRunning);

  useEffect(() => {
    isTranscriptionRunningRef.current = isTranscriptionRunning;
  }, [isTranscriptionRunning]);

  const _handleClick = () => {
    const isTranscriptionRunning = isTranscriptionRunningRef.current;

    if (isTranscriptionRunning) {
      stopTranscription();
    } else {
      startTranscription();
    }
  };
  return (
    <>
      {isMobile || isTab ? (
        <MobileIconButton
          Icon={
            transcriptionState ===
            Constants.transcriptionEvents.TRANSCRIPTION_STARTED
              ? ClosedCaption
              : ClosedCaptionOutlined
          }
          onClick={_handleClick}
          tooltipTitle={
            transcriptionState ===
            Constants.transcriptionEvents.TRANSCRIPTION_STARTED
              ? "Stop Transcription"
              : transcriptionState ===
                Constants.transcriptionEvents.TRANSCRIPTION_STARTING
              ? "Starting Transcription"
              : transcriptionState ===
                Constants.transcriptionEvents.TRANSCRIPTION_STOPPED
              ? "Start Transcription"
              : transcriptionState ===
                Constants.transcriptionEvents.TRANSCRIPTION_STOPPING
              ? "Stopping Transcription"
              : "Start Transcription"
          }
          isFocused={isTranscriptionRunning}
          disabled={!participantCanToggleRealtimeTranscription}
          bgColor={
            appTheme === appThemes.LIGHT &&
            (transcriptionState ===
              Constants.transcriptionEvents.TRANSCRIPTION_STARTED ||
              transcriptionState ===
                Constants.transcriptionEvents.TRANSCRIPTION_STOPPING) &&
            "#EEF0F2"
          }
          buttonText={
            transcriptionState ===
            Constants.transcriptionEvents.TRANSCRIPTION_STARTED
              ? "Stop Transcription"
              : transcriptionState ===
                Constants.transcriptionEvents.TRANSCRIPTION_STARTING
              ? "Starting Transcription"
              : transcriptionState ===
                Constants.transcriptionEvents.TRANSCRIPTION_STOPPED
              ? "Start Transcription"
              : transcriptionState ===
                Constants.transcriptionEvents.TRANSCRIPTION_STOPPING
              ? "Stopping Transcription"
              : "Start Transcription"
          }
          isRequestProcessing={isRequestProcessing}
        />
      ) : (
        <OutlineIconButton
          Icon={
            transcriptionState ===
            Constants.transcriptionEvents.TRANSCRIPTION_STARTED
              ? ClosedCaption
              : ClosedCaptionOutlined
          }
          onClick={_handleClick}
          focusBGColor={
            appTheme === appThemes.LIGHT &&
            theme.palette.lightTheme.contrastText
          }
          isFocused={isTranscriptionRunning}
          tooltipTitle={
            transcriptionState ===
            Constants.transcriptionEvents.TRANSCRIPTION_STARTED
              ? "Stop Transcription"
              : transcriptionState ===
                Constants.transcriptionEvents.TRANSCRIPTION_STARTING
              ? "Starting Transcription"
              : transcriptionState ===
                Constants.transcriptionEvents.TRANSCRIPTION_STOPPED
              ? "Start Transcription"
              : transcriptionState ===
                Constants.transcriptionEvents.TRANSCRIPTION_STOPPING
              ? "Stopping Transcription"
              : "Start Transcription"
          }
          disabled={!participantCanToggleRealtimeTranscription}
          isRequestProcessing={isRequestProcessing}
        />
      )}
    </>
  );
};
const RecordingBTN = ({ isMobile, isTab }) => {
  const mMeeting = useMeeting({});
  const theme = useTheme();
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);

  const startRecording = mMeeting?.startRecording;
  const stopRecording = mMeeting?.stopRecording;
  const recordingState = mMeeting?.recordingState;

  const isRecording = useIsRecording();

  const { isRequestProcessing } = useMemo(
    () => ({
      isRequestProcessing:
        recordingState === Constants.recordingEvents.RECORDING_STARTING ||
        recordingState === Constants.recordingEvents.RECORDING_STOPPING,
    }),
    [recordingState]
  );

  const {
    recordingWebhookUrl,
    recordingAWSDirPath,
    participantCanToggleRecording,
    appMeetingLayout,
    recordingTheme,
    appTheme,
  } = useMeetingAppContext();

  const { type, priority, gridSize } = useMemo(
    () => ({
      type: appMeetingLayout.type,
      priority: appMeetingLayout.priority,
      gridSize: appMeetingLayout.gridSize,
    }),
    [appMeetingLayout]
  );

  const typeRef = useRef(type);
  const priorityRef = useRef(priority);
  const gridSizeRef = useRef(gridSize);
  const isRecordingRef = useRef(isRecording);

  useEffect(() => {
    typeRef.current = type;
  }, [type]);

  useEffect(() => {
    priorityRef.current = priority;
  }, [priority]);

  useEffect(() => {
    gridSizeRef.current = gridSize;
  }, [gridSize]);

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: recordingBlink,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
    height: 64,
    width: 160,
  };

  const _handleStartRecording = () => {
    const type = typeRef.current;
    const priority = priorityRef.current;
    const gridSize = gridSizeRef.current;

    const layout = { type, priority, gridSize };

    startRecording(recordingWebhookUrl, recordingAWSDirPath, {
      layout,
      theme: recordingTheme,
    });
  };

  const _handleClick = () => {
    const isRecording = isRecordingRef.current;

    if (isRecording) {
      stopRecording();
    } else {
      setShowConfirmationPopup(true);
    }
  };

  return (
    <>
      {isMobile || isTab ? (
        <MobileIconButton
          Icon={ScreenRecording}
          onClick={_handleClick}
          tooltipTitle={
            recordingState === Constants.recordingEvents.RECORDING_STARTED
              ? "Stop Recording"
              : recordingState === Constants.recordingEvents.RECORDING_STARTING
              ? "Starting Recording"
              : recordingState === Constants.recordingEvents.RECORDING_STOPPED
              ? "Start Recording"
              : recordingState === Constants.recordingEvents.RECORDING_STOPPING
              ? "Stopping Recording"
              : "Start Recording"
          }
          isFocused={isRecording}
          disabled={!participantCanToggleRecording}
          lottieOption={isRecording ? defaultOptions : null}
          bgColor={
            appTheme === appThemes.LIGHT &&
            (recordingState === Constants.recordingEvents.RECORDING_STARTED ||
              recordingState ===
                Constants.recordingEvents.RECORDING_STOPPING) &&
            "#EEF0F2"
          }
          buttonText={
            recordingState === Constants.recordingEvents.RECORDING_STARTED
              ? "Stop Recording"
              : recordingState === Constants.recordingEvents.RECORDING_STARTING
              ? "Starting Recording"
              : recordingState === Constants.recordingEvents.RECORDING_STOPPED
              ? "Start Recording"
              : recordingState === Constants.recordingEvents.RECORDING_STOPPING
              ? "Stopping Recording"
              : "Start Recording"
          }
          isRequestProcessing={isRequestProcessing}
        />
      ) : (
        <OutlineIconButton
          Icon={ScreenRecording}
          onClick={_handleClick}
          focusBGColor={
            appTheme === appThemes.LIGHT &&
            theme.palette.lightTheme.contrastText
          }
          tooltipTitle={
            recordingState === Constants.recordingEvents.RECORDING_STARTED
              ? "Stop Recording"
              : recordingState === Constants.recordingEvents.RECORDING_STARTING
              ? "Starting Recording"
              : recordingState === Constants.recordingEvents.RECORDING_STOPPED
              ? "Start Recording"
              : recordingState === Constants.recordingEvents.RECORDING_STOPPING
              ? "Stopping Recording"
              : "Start Recording"
          }
          isFocused={
            isRecording &&
            recordingState === Constants.recordingEvents.RECORDING_STARTED
          }
          bgColor={
            appTheme === appThemes.LIGHT &&
            (recordingState === Constants.recordingEvents.RECORDING_STARTED ||
              recordingState ===
                Constants.recordingEvents.RECORDING_STOPPING) &&
            "#EEF0F2"
          }
          disabled={!participantCanToggleRecording}
          lottieOption={
            isRecording &&
            recordingState === Constants.recordingEvents.RECORDING_STARTED
              ? defaultOptions
              : null
          }
          buttonText={
            recordingState === Constants.recordingEvents.RECORDING_STARTING
              ? "Starting"
              : recordingState === Constants.recordingEvents.RECORDING_STOPPING
              ? "Stopping"
              : ""
          }
          isRequestProcessing={isRequestProcessing}
        />
      )}
      <ConfirmBox
        title={"Start Recording"}
        subTitle={"Are you sure you want to start recording?"}
        open={showConfirmationPopup}
        successText={"Yes"}
        onSuccess={() => {
          _handleStartRecording();
          setShowConfirmationPopup(false);
        }}
        rejectText={"No"}
        onReject={() => {
          setShowConfirmationPopup(false);
        }}
      />
    </>
  );
};
const GoLiveBTN = ({ isMobile, isTab }) => {
  const mMeeting = useMeeting({});

  const [isPopupShown, setIsPopupShown] = useState(false);

  const startLivestream = mMeeting?.startLivestream;
  const stopLivestream = mMeeting?.stopLivestream;
  const livestreamState = mMeeting?.livestreamState;

  const isLiveStreaming = useIsLivestreaming();

  const { isRequestProcessing } = useMemo(
    () => ({
      isRequestProcessing:
        livestreamState === Constants.livestreamEvents.LIVESTREAM_STARTING ||
        livestreamState === Constants.livestreamEvents.LIVESTREAM_STOPPING,
    }),
    [livestreamState]
  );

  const {
    participantCanToggleLivestream,
    liveStreamConfig,
    setSideBarMode,
    setSideBarNestedMode,
    appMeetingLayout,
    liveStreamTheme,
  } = useMeetingAppContext();

  const { type, priority, gridSize } = useMemo(
    () => ({
      type: appMeetingLayout.type,
      priority: appMeetingLayout.priority,
      gridSize: appMeetingLayout.gridSize,
    }),
    [appMeetingLayout]
  );

  const typeRef = useRef(type);
  const priorityRef = useRef(priority);
  const gridSizeRef = useRef(gridSize);
  const isLiveStreamingRef = useRef(isLiveStreaming);
  const liveStreamConfigRef = useRef(liveStreamConfig);

  useEffect(() => {
    typeRef.current = type;
  }, [type]);

  useEffect(() => {
    priorityRef.current = priority;
  }, [priority]);

  useEffect(() => {
    gridSizeRef.current = gridSize;
  }, [gridSize]);

  useEffect(() => {
    isLiveStreamingRef.current = isLiveStreaming;
  }, [isLiveStreaming]);

  useEffect(() => {
    liveStreamConfigRef.current = liveStreamConfig;
  }, [liveStreamConfig]);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: liveBlink,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
    height: 64,
    width: 170,
  };

  const _handleStartLivestream = () => {
    const type = typeRef.current;
    const priority = priorityRef.current;
    const gridSize = gridSizeRef.current;

    const layout = { type, priority, gridSize };

    startLivestream(liveStreamConfig, { layout, theme: liveStreamTheme });
  };

  const _handleClick = () => {
    const isLiveStreaming = isLiveStreamingRef.current;

    if (isLiveStreaming) {
      stopLivestream();
    } else {
      if (liveStreamConfigRef.current.length > 0) {
        _handleStartLivestream();
      } else {
        setIsPopupShown(true);
      }
    }
  };

  return (
    <>
      {isMobile || isTab ? (
        <MobileIconButton
          bgColor={"#D32F2F"}
          onClick={_handleClick}
          tooltipTitle={
            livestreamState === Constants.livestreamEvents.LIVESTREAM_STARTED
              ? "Stop Live"
              : livestreamState ===
                Constants.livestreamEvents.LIVESTREAM_STARTING
              ? "Starting Livestream"
              : livestreamState ===
                Constants.livestreamEvents.LIVESTREAM_STOPPED
              ? "Go Live"
              : livestreamState ===
                Constants.livestreamEvents.LIVESTREAM_STOPPING
              ? "Stopping Livestream"
              : "Go Live"
          }
          Icon={LiveIcon}
          buttonText={
            livestreamState === Constants.livestreamEvents.LIVESTREAM_STARTED
              ? "Stop Live"
              : livestreamState ===
                Constants.livestreamEvents.LIVESTREAM_STARTING
              ? "Starting Livestream"
              : livestreamState ===
                Constants.livestreamEvents.LIVESTREAM_STOPPED
              ? "Go Live"
              : livestreamState ===
                Constants.livestreamEvents.LIVESTREAM_STOPPING
              ? "Stopping Livestream"
              : "Go Live"
          }
          isFocused={isLiveStreaming}
          lottieOption={isLiveStreaming ? defaultOptions : null}
          disabled={!participantCanToggleLivestream}
          isRequestProcessing={isRequestProcessing}
        />
      ) : (
        <OutlineIconTextButton
          bgColor={"#D32F2F"}
          onClick={_handleClick}
          tooltipTitle={
            livestreamState === Constants.livestreamEvents.LIVESTREAM_STARTED
              ? "Stop Live"
              : livestreamState ===
                Constants.livestreamEvents.LIVESTREAM_STARTING
              ? "Starting Livestream"
              : livestreamState ===
                Constants.livestreamEvents.LIVESTREAM_STOPPED
              ? "Go Live"
              : livestreamState ===
                Constants.livestreamEvents.LIVESTREAM_STOPPING
              ? "Stopping Livestream"
              : "Go Live"
          }
          buttonText="Go Live"
          textColor="#fff"
          lottieOption={isLiveStreaming ? defaultOptions : null}
          disabled={!participantCanToggleLivestream}
          isRequestProcessing={isRequestProcessing}
        />
      )}
      <ConfirmBox
        open={isPopupShown}
        title={"Add live stream configuration"}
        subTitle={
          "Please add live stream configuration to start live streaming"
        }
        successText={"Proceed"}
        onSuccess={() => {
          setSideBarMode((s) => sideBarModes.ACTIVITIES);
          setSideBarNestedMode((s) => sideBarNestedModes.ADD_LIVE_STREAM);
          setIsPopupShown(false);
        }}
        rejectText={"Cancel"}
        onReject={() => {
          setIsPopupShown(false);
        }}
      />
    </>
  );
};
const HlsBTN = ({ isMobile, isTab }) => {
  const mMeeting = useMeeting({});
  const theme = useTheme();

  const startHls = mMeeting?.startHls;
  const stopHls = mMeeting?.stopHls;
  const hlsState = mMeeting?.hlsState;

  const isHls = useIsHls();

  const { isRequestProcessing } = useMemo(
    () => ({
      isRequestProcessing:
        hlsState === Constants.hlsEvents.HLS_STARTING ||
        hlsState === Constants.hlsEvents.HLS_STOPPING,
    }),
    [hlsState]
  );

  const { appMeetingLayout, participantCanToggleHls, hlsTheme, appTheme } =
    useMeetingAppContext();

  const { type, priority, gridSize } = useMemo(
    () => ({
      type: appMeetingLayout.type,
      priority: appMeetingLayout.priority,
      gridSize: appMeetingLayout.gridSize,
    }),
    [appMeetingLayout]
  );

  const typeRef = useRef(type);
  const priorityRef = useRef(priority);
  const gridSizeRef = useRef(gridSize);
  const isHlsRef = useRef(isHls);

  useEffect(() => {
    typeRef.current = type;
  }, [type]);

  useEffect(() => {
    priorityRef.current = priority;
  }, [priority]);

  useEffect(() => {
    gridSizeRef.current = gridSize;
  }, [gridSize]);

  useEffect(() => {
    isHlsRef.current = isHls;
  }, [isHls]);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: liveHLS,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
    height: 64,
    width: 170,
  };

  const defaultOptionsStoppingHls = {
    loop: true,
    autoplay: true,
    animationData: stoppingHLS,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
    height: 64,
    width: 170,
  };

  const _handleStartHLS = () => {
    const type = typeRef.current;
    const priority = priorityRef.current;
    const gridSize = gridSizeRef.current;

    const layout = { type, priority, gridSize };

    startHls({ layout, theme: hlsTheme });
  };

  const _handleClick = () => {
    const isHls = isHlsRef.current;

    if (isHls) {
      stopHls();
    } else {
      _handleStartHLS();
    }
  };

  return isMobile || isTab ? (
    <MobileIconButton
      onClick={_handleClick}
      focusBGColor={
        appTheme === appThemes.LIGHT && theme.palette.lightTheme.contrastText
      }
      tooltipTitle={
        hlsState === Constants.hlsEvents.HLS_STARTED ||
        hlsState === Constants.hlsEvents.HLS_PLAYABLE
          ? "Stop HLS"
          : hlsState === Constants.hlsEvents.HLS_STARTING
          ? "Starting HLS"
          : hlsState === Constants.hlsEvents.HLS_STOPPED
          ? "Start HLS"
          : hlsState === Constants.hlsEvents.HLS_STOPPING
          ? "Stopping HLS"
          : "Start HLS"
      }
      Icon={LiveIcon}
      buttonText={
        hlsState === Constants.hlsEvents.HLS_STARTED ||
        hlsState === Constants.hlsEvents.HLS_PLAYABLE
          ? "Stop HLS"
          : hlsState === Constants.hlsEvents.HLS_STARTING
          ? "Starting HLS"
          : hlsState === Constants.hlsEvents.HLS_STOPPED
          ? "Start HLS"
          : hlsState === Constants.hlsEvents.HLS_STOPPING
          ? "Stopping HLS"
          : "Start HLS"
      }
      bgColor={
        appTheme === appThemes.LIGHT &&
        (hlsState === Constants.hlsEvents.HLS_STARTED ||
          hlsState === Constants.hlsEvents.HLS_STOPPING) &&
        "#EEF0F2"
      }
      isFocused={isHls}
      disabled={!participantCanToggleHls}
      lottieOption={isHls ? defaultOptions : null}
      isRequestProcessing={isRequestProcessing}
    />
  ) : (
    <OutlineIconTextButton
      onClick={_handleClick}
      tooltipTitle={
        hlsState === Constants.hlsEvents.HLS_STARTED ||
        hlsState === Constants.hlsEvents.HLS_PLAYABLE
          ? "Stop HLS"
          : hlsState === Constants.hlsEvents.HLS_STARTING
          ? "Starting HLS"
          : hlsState === Constants.hlsEvents.HLS_STOPPED
          ? "Start HLS"
          : hlsState === Constants.hlsEvents.HLS_STOPPING
          ? "Stopping HLS"
          : "Start HLS"
      }
      buttonText={
        hlsState === Constants.hlsEvents.HLS_STARTED ||
        hlsState === Constants.hlsEvents.HLS_PLAYABLE
          ? "Stop HLS"
          : hlsState === Constants.hlsEvents.HLS_STARTING
          ? "Starting HLS"
          : hlsState === Constants.hlsEvents.HLS_STOPPED
          ? "Start HLS"
          : hlsState === Constants.hlsEvents.HLS_STOPPING
          ? "Stopping HLS"
          : "Start HLS"
      }
      lottieOption={isHls ? defaultOptions : null}
      disabled={!participantCanToggleHls}
      isRequestProcessing={isRequestProcessing}
    />
  );
};

const SingleMicMenu = ({
  micArr,
  Icon,
  label,
  // classes,
  selectMicDeviceId,
  setSelectMicDeviceId,
  isOutputMics,
  changeMic,
  appTheme,
  theme,
  handleClose,
}) => {
  const BoxElement =
    appTheme === appThemes.LIGHT
      ? CustomBoxLight
      : appTheme === appThemes.DARK
      ? CustomBox
      : CustomBoxDefault;

  return (
    <Box>
      <Box
        style={{
          display: "flex",
          alignItems: "center",
          padding: 12,
          paddingBottom: 0,
        }}
      >
        <Icon />

        <Typography
          style={{
            marginLeft: 12,
            fontSize: 14,
            color: theme.palette.darkTheme.contrastText,
          }}
        >
          {label}
        </Typography>
      </Box>
      <MenuList
        disableRipple
        disableFocusRipple
        style={{
          backgroundColor:
            appTheme === appThemes.DARK
              ? theme.palette.darkTheme.slightLighter
              : appTheme === appThemes.LIGHT
              ? theme.palette.lightTheme.two
              : "",
          color:
            appTheme === appThemes.DARK
              ? theme.palette.common.white
              : appTheme === appThemes.LIGHT
              ? theme.palette.lightTheme.contrastText
              : "",
        }}
      >
        {micArr.map(({ deviceId, label }, index) => (
          <BoxElement
            style={{
              display: "flex",
              alignItems: "center",
              paddingLeft: 12,
              paddingRight: 12,
              backgroundColor:
                deviceId === selectMicDeviceId
                  ? appTheme === appThemes.DARK
                    ? "#3F4046"
                    : appTheme === appThemes.LIGHT
                    ? theme.palette.lightTheme.three
                    : "#6D6E71"
                  : "",
            }}
          >
            {deviceId === selectMicDeviceId && <SelectedIcon />}

            <CustomMenuItem
              disableRipple
              style={{
                display: "flex",
                flex: 1,
                backgroundColor:
                  deviceId === selectMicDeviceId
                    ? appTheme === appThemes.DARK
                      ? "#3F4046"
                      : appTheme === appThemes.LIGHT
                      ? theme.palette.lightTheme.three
                      : "#6D6E71"
                    : "",
              }}
              key={`mics_${deviceId}`}
              selected={deviceId === selectMicDeviceId}
              onClick={() => {
                handleClose();
                setSelectMicDeviceId(deviceId);
                if (!isOutputMics) {
                  changeMic(deviceId);
                }
              }}
            >
              {label || `Mic ${index + 1}`}
            </CustomMenuItem>
          </BoxElement>
        ))}
      </MenuList>
    </Box>
  );
};

const MicMenu = ({
  selectMicDeviceId,
  setSelectMicDeviceId,
  selectedOutputDeviceId,
  setSelectedOutputDeviceId,
  localMicOn,
  downArrow,
  mics,
  outputmics,
  // classes,
  _handleNoiseClick,
  handleClose,
  isNoiseRemovalChecked,
  theme,
  appTheme,
  tollTipEl,
  changeMic,
}) => {
  const BoxElement =
    appTheme === appThemes.LIGHT
      ? CustomBoxLight
      : appTheme === appThemes.DARK
      ? CustomBox
      : CustomBoxDefault;
  return (
    <Popover
      container={tollTipEl.current}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      anchorEl={tollTipEl.current}
      open={Boolean(downArrow)}
      onClose={handleClose}
    >
      <Box
        style={{
          backgroundColor:
            appTheme === appThemes.DARK
              ? theme.palette.darkTheme.slightLighter
              : appTheme === appThemes.LIGHT
              ? theme.palette.lightTheme.two
              : "",
        }}
      >
        <SingleMicMenu
          micArr={mics}
          label={"MICROPHONE"}
          Icon={MicrophoneIcon}
          selectMicDeviceId={selectMicDeviceId}
          setSelectMicDeviceId={setSelectMicDeviceId}
          changeMic={changeMic}
          // classes={classes}
          appTheme={appTheme}
          theme={theme}
          handleClose={handleClose}
        />
        <Box
          style={{
            height: 1,
            width: "100%",
            borderTop: `1px solid ${theme.palette.darkTheme.contrastText}`,
          }}
        ></Box>

        <SingleMicMenu
          micArr={outputmics}
          label={"SPEAKER"}
          Icon={SpeakerMenuIcon}
          selectMicDeviceId={selectedOutputDeviceId}
          setSelectMicDeviceId={setSelectedOutputDeviceId}
          isOutputMics={true}
          // classes={classes}
          changeMic={changeMic}
          appTheme={appTheme}
          theme={theme}
          handleClose={handleClose}
        />

        {localMicOn && (
          <>
            <Box
              style={{
                height: 1,
                width: "100%",
                borderTop: "1px solid #9FA0A7",
              }}
            ></Box>
            <Box>
              <MenuList
                disableRipple
                disableFocusRipple
                style={{
                  backgroundColor:
                    appTheme === appThemes.DARK
                      ? theme.palette.darkTheme.slightLighter
                      : appTheme === appThemes.LIGHT
                      ? theme.palette.lightTheme.two
                      : "",
                  color:
                    appTheme === appThemes.DARK
                      ? theme.palette.common.white
                      : appTheme === appThemes.LIGHT
                      ? theme.palette.lightTheme.contrastText
                      : "",
                }}
              >
                <BoxElement
                  style={{
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: isNoiseRemovalChecked ? 12 : 6,
                    paddingRight: 6,
                    backgroundColor: isNoiseRemovalChecked
                      ? appTheme === appThemes.DARK
                        ? "#3F4046"
                        : appTheme === appThemes.LIGHT
                        ? theme.palette.lightTheme.three
                        : "#6D6E71"
                      : "",
                  }}
                  // classes={{
                  //   root:
                  //     appTheme === appThemes.LIGHT
                  //       ? classes.popoverHover
                  //       : appTheme === appThemes.DARK
                  //       ? classes.popoverHoverDark
                  //       : classes.popoverHoverDefault,
                  // }}
                >
                  {isNoiseRemovalChecked ? (
                    <SelectedIcon />
                  ) : (
                    <BpCheckbox
                      value={isNoiseRemovalChecked}
                      checked={isNoiseRemovalChecked}
                      onClick={(e) => {
                        _handleNoiseClick({ e, selectMicDeviceId });
                      }}
                    />
                  )}

                  <MenuItem
                    disableRipple
                    style={{
                      display: "flex",
                      flex: 1,
                      backgroundColor: isNoiseRemovalChecked
                        ? appTheme === appThemes.DARK
                          ? "#3F4046"
                          : appTheme === appThemes.LIGHT
                          ? theme.palette.lightTheme.three
                          : "#6D6E71"
                        : "",
                    }}
                    key={`noise_removal`}
                    selected={isNoiseRemovalChecked}
                    onClick={(e) => {
                      handleClose();
                      _handleNoiseClick({ e, selectMicDeviceId });
                    }}
                    // classes={{
                    //   root:
                    //     appTheme === appThemes.LIGHT
                    //       ? classes.menuItemHover
                    //       : appTheme === appThemes.DARK
                    //       ? classes.menuItemDark
                    //       : classes.menuItemDefault,
                    //   gutters: isNoiseRemovalChecked
                    //     ? classes.singleMenuItemGuttersAfterSelect
                    //     : classes.singleMenuItemGutters,
                    // }}
                  >
                    AI Noise Removal
                  </MenuItem>
                </BoxElement>
              </MenuList>
            </Box>
          </>
        )}
      </Box>
    </Popover>
  );
};

const MirrorView = ({
  isMirrorViewChecked,
  _handleMirrorClick,
  localWebcamOn,
  handleClose,
  appTheme,
  theme,
}) => {
  // const classes = useStyles();

  const BoxElement =
    appTheme === appThemes.LIGHT
      ? CustomBoxLight
      : appTheme === appThemes.DARK
      ? CustomBox
      : CustomBoxDefault;

  return (
    localWebcamOn && (
      <>
        <Box
          style={{
            height: 1,
            width: "100%",
            borderTop: "1px solid #9FA0A7",
          }}
        ></Box>
        <Box>
          <MenuList
            disableRipple
            disableFocusRipple
            style={{
              backgroundColor:
                appTheme === appThemes.DARK
                  ? theme.palette.darkTheme.slightLighter
                  : appTheme === appThemes.LIGHT
                  ? theme.palette.lightTheme.two
                  : "",
              color:
                appTheme === appThemes.DARK
                  ? theme.palette.common.white
                  : appTheme === appThemes.LIGHT
                  ? theme.palette.lightTheme.contrastText
                  : "",
            }}
          >
            <BoxElement
              style={{
                display: "flex",
                alignItems: "center",
                paddingLeft: isMirrorViewChecked ? 12 : 6,
                paddingRight: 6,
                backgroundColor: isMirrorViewChecked
                  ? appTheme === appThemes.DARK
                    ? "#3F4046"
                    : appTheme === appThemes.LIGHT
                    ? theme.palette.lightTheme.three
                    : "#6D6E71"
                  : "",
              }}
              // classes={{
              //   root:
              //     appTheme === appThemes.LIGHT
              //       ? classes.popoverHover
              //       : appTheme === appThemes.DARK
              //       ? classes.popoverHoverDark
              //       : classes.popoverHoverDefault,
              // }}
            >
              {isMirrorViewChecked ? (
                <SelectedIcon />
              ) : (
                <BpCheckbox
                  value={isMirrorViewChecked}
                  checked={isMirrorViewChecked}
                  onClick={(e) => {
                    _handleMirrorClick({ e });
                  }}
                />
              )}

              <CustomMenuItem
                disableRipple
                style={{
                  display: "flex",
                  flex: 1,
                  backgroundColor: isMirrorViewChecked
                    ? appTheme === appThemes.DARK
                      ? "#3F4046"
                      : appTheme === appThemes.LIGHT
                      ? theme.palette.lightTheme.three
                      : "#6D6E71"
                    : "",
                }}
                key={`mirror_view`}
                selected={isMirrorViewChecked}
                onClick={(e) => {
                  handleClose();
                  _handleMirrorClick({ e });
                }}
                // classes={{
                //   root:
                //     appTheme === appThemes.LIGHT
                //       ? classes.menuItemHover
                //       : appTheme === appThemes.DARK
                //       ? classes.menuItemDark
                //       : classes.menuItemDefault,
                //   gutters: isMirrorViewChecked
                //     ? classes.singleMenuItemGuttersAfterSelect
                //     : classes.singleMenuItemGutters,
                // }}
              >
                Mirror View
              </CustomMenuItem>
            </BoxElement>
          </MenuList>
        </Box>
      </>
    )
  );
};

const WebcamBTN = () => {
  const theme = useTheme();
  // const classes = useStyles();
  const mMeeting = useMeeting({});
  const {
    appTheme,
    selectWebcamDeviceId,
    setSelectWebcamDeviceId,
    notificationSoundEnabled,
    notificationAlertsEnabled,
    isMirrorViewChecked,
    setIsMirrorViewChecked,
    cameraId,
  } = useMeetingAppContext();
  const { enqueueSnackbar } = useSnackbar();
  const { getCustomVideoTrack } = useCustomTrack();

  const [downArrow, setDownArrow] = useState(null);
  const [webcams, setWebcams] = useState([]);

  const localWebcamOn = mMeeting?.localWebcamOn;
  const toggleWebcam = async () => {
    let track;
    if (!localWebcamOn)
      track = await getCustomVideoTrack(
        cameraId === selectWebcamDeviceId ? cameraId : selectWebcamDeviceId
      );
    mMeeting?.toggleWebcam(track);
  };
  const changeWebcam = async (deviceId) => {
    console.log("deviceId", deviceId);
    const track = await getCustomVideoTrack(deviceId);
    mMeeting?.changeWebcam(track ? track : deviceId);
  };

  const handleClick = (event) => {
    setDownArrow(event.currentTarget);
  };

  const handleClose = () => {
    setDownArrow(null);
  };

  const getWebcams = async (mGetWebcams) => {
    const webcams = await mGetWebcams();

    webcams && webcams?.length && setWebcams(webcams);
  };

  const tollTipEl = useRef();

  const _handleMirrorClick = async ({ e }) => {
    e.stopPropagation();
    var _isMirrorViewChecked;

    setIsMirrorViewChecked((s) => {
      const notS = !s;
      _isMirrorViewChecked = notS;
      return notS;
    });

    if (_isMirrorViewChecked) {
      if (notificationSoundEnabled) {
        new Audio(
          `https://static.videosdk.live/prebuilt/notification.mp3`
        ).play();
      }

      if (notificationAlertsEnabled) {
        enqueueSnackbar("Camera mirror view enabled.");
      }
    }
  };

  const BoxElement =
    appTheme === appThemes.LIGHT
      ? CustomBoxLight
      : appTheme === appThemes.DARK
      ? CustomBox
      : CustomBoxDefault;

  return (
    <Box
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      ref={tollTipEl}
    >
      <OutlineIconButton
        btnID={"btnWebcam"}
        tooltipTitle={localWebcamOn ? "Turn off webcam" : "Turn on webcam"}
        isFocused={localWebcamOn}
        Icon={localWebcamOn ? WebCamOnIcon : WebCamOffIcon}
        onClick={() => {
          toggleWebcam();
        }}
        focusBGColor={
          appTheme === appThemes.LIGHT
            ? theme.palette.lightTheme.contrastText
            : "#ffffff33"
        }
        focusIconColor={theme.palette.common.white}
        renderRightComponent={() => {
          return (
            <Tooltip placement="bottom" title={"Change webcam"}>
              <CustomIconButton
                onClick={(e) => {
                  getWebcams(mMeeting?.getWebcams);
                  handleClick(e);
                }}
                size={"small"}
              >
                <ArrowDropDownIcon
                  fontSize={"small"}
                  style={{
                    color: localWebcamOn
                      ? "white"
                      : appTheme === appThemes.LIGHT
                      ? theme.palette.lightTheme.contrastText
                      : "white",
                  }}
                />
              </CustomIconButton>
            </Tooltip>
          );
        }}
      />
      <Popover
        container={tollTipEl.current}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        anchorEl={tollTipEl.current}
        open={Boolean(downArrow)}
        onClose={handleClose}
      >
        <MenuList
          style={{
            backgroundColor:
              appTheme === appThemes.DARK
                ? theme.palette.darkTheme.slightLighter
                : appTheme === appThemes.LIGHT
                ? theme.palette.lightTheme.two
                : "",
            color:
              appTheme === appThemes.DARK
                ? theme.palette.common.white
                : appTheme === appThemes.LIGHT
                ? theme.palette.lightTheme.contrastText
                : "",
          }}
        >
          {webcams.map(({ deviceId, label }, index) => (
            <BoxElement
              style={{
                display: "flex",
                alignItems: "center",

                backgroundColor:
                  deviceId === selectWebcamDeviceId
                    ? appTheme === appThemes.DARK
                      ? "#3F4046"
                      : appTheme === appThemes.LIGHT
                      ? theme.palette.lightTheme.three
                      : "#6D6E71"
                    : "",
              }}
            >
              <CustomWebcamMenuItem
                key={`output_webcams_${deviceId}`}
                selected={deviceId === selectWebcamDeviceId}
                onClick={() => {
                  handleClose();
                  setSelectWebcamDeviceId(deviceId);
                  changeWebcam(deviceId);
                }}
                // classes={{
                //   root:
                //     appTheme === appThemes.LIGHT
                //       ? classes.popoverHover
                //       : appTheme === appThemes.DARK
                //       ? classes.popoverHoverDark
                //       : "",
                // }}
              >
                {label || `Webcam ${index + 1}`}
              </CustomWebcamMenuItem>
            </BoxElement>
          ))}
        </MenuList>

        <MirrorView
          isMirrorViewChecked={isMirrorViewChecked}
          localWebcamOn={localWebcamOn}
          _handleMirrorClick={_handleMirrorClick}
          handleClose={handleClose}
          appTheme={appTheme}
          theme={theme}
        />
      </Popover>
    </Box>
  );
};
const MicBTN = () => {
  const {
    appTheme,
    notificationSoundEnabled,
    notificationAlertsEnabled,
    selectMicDeviceId,
    setSelectMicDeviceId,
    selectedOutputDeviceId,
    setSelectedOutputDeviceId,
  } = useMeetingAppContext();

  const [isNoiseRemovalChecked, setIsNoiseRemovalChecked] = useState(false);
  const [downArrow, setDownArrow] = useState(null);
  const [mics, setMics] = useState([]);
  const [outputmics, setOutputMics] = useState([]);
  const mMeeting = useMeeting({});
  const theme = useTheme();
  // const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { getCustomAudioTrack } = useCustomTrack();
  const { getPlaybackDevices } = useMediaDevice({ onDeviceChanged });

  const getSpeakers = async () => {
    const devices = await getPlaybackDevices();
    const outputMics = devices.filter(
      (d) => d.deviceId !== "default" && d.deviceId !== "communications"
    );

    outputMics && outputMics?.length && setOutputMics(outputMics);
  };

  function onDeviceChanged() {
    getSpeakers();
  }

  const handleClick = (event) => {
    setDownArrow(event.currentTarget);
  };

  const handleClose = () => {
    setDownArrow(null);
  };

  const localMicOn = mMeeting?.localMicOn;
  const toggleMic = async () => {
    let track;
    if (!localMicOn) track = await getCustomAudioTrack(selectMicDeviceId);
    mMeeting?.toggleMic(track);
  };
  const changeMic = mMeeting?.changeMic;

  const getMics = async (mGetMics) => {
    const mics = await mGetMics();

    mics && mics?.length && setMics(mics);
  };

  const tollTipEl = useRef();

  const getOutputDevices = async () => {
    await getSpeakers();
  };

  const _handleNoiseClick = async ({ e, selectMicDeviceId }) => {
    e.stopPropagation();
    let _isNoiseRemovalChecked;
    setIsNoiseRemovalChecked((s) => {
      const notS = !s;
      _isNoiseRemovalChecked = notS;
      return notS;
    });

    try {
      const processor = new VideoSDKNoiseSuppressor();

      const stream = await getCustomAudioTrack(selectMicDeviceId);
      const processedStream = await processor.getNoiseSuppressedAudioStream(
        stream
      );

      changeMic(processedStream);
    } catch (error) {
      console.log(error);
    }

    if (_isNoiseRemovalChecked) {
      if (notificationSoundEnabled) {
        new Audio(
          `https://static.videosdk.live/prebuilt/notification.mp3`
        ).play();
      }

      if (notificationAlertsEnabled) {
        enqueueSnackbar("Noise removal activated");
      }
    }
  };

  return (
    <Box
      ref={tollTipEl}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <OutlineIconButton
        btnID={"btnMic"}
        tooltipTitle={
          isNoiseRemovalChecked
            ? "Noise Removal Activated"
            : localMicOn
            ? "Turn off mic"
            : "Turn on mic"
        }
        isFocused={localMicOn}
        Icon={localMicOn ? MicOn : MicOffIcon}
        onClick={toggleMic}
        focusBGColor={
          appTheme === appThemes.LIGHT
            ? theme.palette.lightTheme.contrastText
            : "#ffffff33"
        }
        focusBorderColor={isNoiseRemovalChecked && localMicOn ? "#7dcc7d" : ""}
        focusIconColor={theme.palette.common.white}
        renderRightComponent={() => {
          return (
            <Tooltip placement="bottom" title={"Change microphone"}>
              <CustomIconButton
                p={0}
                onClick={(e) => {
                  getMics(mMeeting.getMics);
                  getOutputDevices();
                  handleClick(e);
                }}
                size={"small"}
              >
                <ArrowDropDownIcon
                  fontSize={"small"}
                  style={{
                    color: localMicOn
                      ? "white"
                      : appTheme === appThemes.LIGHT
                      ? theme.palette.lightTheme.contrastText
                      : "white",
                  }}
                />
              </CustomIconButton>
            </Tooltip>
          );
        }}
      />
      <MicMenu
        selectMicDeviceId={selectMicDeviceId}
        setSelectMicDeviceId={setSelectMicDeviceId}
        selectedOutputDeviceId={selectedOutputDeviceId}
        setSelectedOutputDeviceId={setSelectedOutputDeviceId}
        isNoiseRemovalChecked={isNoiseRemovalChecked}
        localMicOn={localMicOn}
        theme={theme}
        appTheme={appTheme}
        downArrow={downArrow}
        tollTipEl={tollTipEl}
        changeMic={changeMic}
        mics={mics}
        outputmics={outputmics}
        // classes={classes}
        _handleNoiseClick={_handleNoiseClick}
        handleClose={handleClose}
      />
    </Box>
  );
};
const EndCallBTN = () => {
  const mMeeting = useMeeting({});
  // const classes = useStyles();

  const [isEndMeeting, setIsEndMeeting] = useState(false);
  const {
    endCallContainerRef,
    participantCanEndMeeting,
    participantCanLeave,
    meetingMode,
    appTheme,
  } = useMeetingAppContext();

  const sendChatMessage = mMeeting?.sendChatMessage;

  const leave = mMeeting?.leave;
  const end = mMeeting?.end;

  const tollTipEl = useRef();

  const theme = useTheme();

  const [downArrow, setDownArrow] = useState(null);

  const handleClick = (event) => {
    setDownArrow(event.currentTarget);
  };

  const handleClose = () => {
    setDownArrow(null);
  };

  return (
    <Box
      ref={tollTipEl}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <OutlineIconButton
        ref={endCallContainerRef}
        tooltipTitle={
          !participantCanLeave && meetingMode === meetingModes.CONFERENCE
            ? "End Call"
            : participantCanEndMeeting &&
              meetingMode === meetingModes.CONFERENCE
            ? "Open popup"
            : "Leave Call"
        }
        bgColor={theme.palette.error.main}
        color={theme.palette.common.white}
        Icon={EndCall}
        onClick={(e) => {
          window.onbeforeunload = null;
          !participantCanLeave && meetingMode === meetingModes.CONFERENCE
            ? setIsEndMeeting(true)
            : participantCanEndMeeting &&
              meetingMode === meetingModes.CONFERENCE
            ? handleClick(e)
            : leave();
        }}
      />
      {participantCanEndMeeting && (
        <>
          <Popover
            container={tollTipEl.current}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            anchorEl={tollTipEl.current}
            open={Boolean(downArrow)}
            onClose={handleClose}
            // classes={{
            //   paper: classes.popoverBorder,
            // }}
          >
            <MenuList
              style={{
                backgroundColor:
                  appTheme === appThemes.DARK
                    ? theme.palette.darkTheme.slightLighter
                    : appTheme === appThemes.LIGHT
                    ? theme.palette.lightTheme.two
                    : "",
                color:
                  appTheme === appThemes.DARK
                    ? theme.palette.common.white
                    : appTheme === appThemes.LIGHT
                    ? theme.palette.lightTheme.contrastText
                    : "",
              }}
            >
              <MenuItem
                key={`leave`}
                onClick={() => {
                  window.onbeforeunload = null;
                  leave();
                }}
                // classes={{
                //   root:
                //     appTheme === appThemes.LIGHT
                //       ? classes.popoverHover
                //       : appTheme === appThemes.DARK
                //       ? classes.popoverHoverDark
                //       : "",
                // }}
              >
                <Box style={{ display: "flex", flexDirection: "row" }}>
                  <Box
                    style={{
                      backgroundColor:
                        appTheme === appThemes.DARK
                          ? theme.palette.darkTheme.seven
                          : appTheme === appThemes.LIGHT
                          ? theme.palette.lightTheme.three
                          : theme.palette.common.sidePanel,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 42,
                      width: 42,
                      borderRadius: 4,
                    }}
                  >
                    <LeaveMeetingIcon
                      height={22}
                      width={22}
                      fill={
                        appTheme === appThemes.LIGHT &&
                        theme.palette.lightTheme.contrastText
                      }
                    />
                  </Box>
                  <Box
                    style={{
                      display: "flex",
                      flex: 1,
                      flexDirection: "column",
                      marginLeft: 12,
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      style={{
                        fontSize: 14,
                        color:
                          appTheme === appThemes.LIGHT &&
                          theme.palette.lightTheme.contrastText,
                      }}
                    >
                      Leave
                    </Typography>
                    <Typography
                      color={"textSecondary"}
                      style={{
                        fontSize: "0.9rem",
                        color:
                          appTheme === appThemes.DARK
                            ? theme.palette.darkTheme.four
                            : appTheme === appThemes.LIGHT
                            ? theme.palette.lightTheme.five
                            : "",
                      }}
                    >
                      Only you will leave the call.
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
              <MenuItem
                style={{ marginTop: 4 }}
                key={`end`}
                onClick={() => {
                  setIsEndMeeting(true);
                }}
                // classes={{
                //   root:
                //     appTheme === appThemes.LIGHT
                //       ? classes.popoverHover
                //       : appTheme === appThemes.DARK
                //       ? classes.popoverHoverDark
                //       : "",
                // }}
              >
                <Box style={{ display: "flex", flexDirection: "row" }}>
                  <Box
                    style={{
                      backgroundColor:
                        appTheme === appThemes.DARK
                          ? theme.palette.darkTheme.seven
                          : appTheme === appThemes.LIGHT
                          ? theme.palette.lightTheme.three
                          : theme.palette.common.sidePanel,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 42,
                      width: 42,
                      borderRadius: 4,
                    }}
                  >
                    <EndCallIcon
                      fill={
                        appTheme === appThemes.LIGHT &&
                        theme.palette.lightTheme.contrastText
                      }
                    />
                  </Box>
                  <Box
                    style={{
                      display: "flex",
                      marginLeft: 12,
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      style={{
                        fontSize: 14,
                        lineHeight: 1.5,
                        color:
                          appTheme === appThemes.LIGHT &&
                          theme.palette.lightTheme.contrastText,
                      }}
                    >
                      End
                    </Typography>
                    <Typography
                      style={{
                        fontSize: "0.9rem",
                        color:
                          appTheme === appThemes.DARK
                            ? theme.palette.darkTheme.four
                            : appTheme === appThemes.LIGHT
                            ? theme.palette.lightTheme.five
                            : "",
                      }}
                      color={"textSecondary"}
                    >
                      End call for all participants.
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            </MenuList>
          </Popover>

          <ConfirmBox
            open={isEndMeeting}
            title={"Are you sure to end this call for everyone?"}
            successText={"End Call"}
            onSuccess={() => {
              sendChatMessage(
                JSON.stringify({ buttonType: "END_CALL", data: {} })
              );
              setTimeout(() => {
                window.onbeforeunload = null;
                end();
              }, 1000);
            }}
            rejectText="Cancel"
            onReject={() => {
              setIsEndMeeting(false);
            }}
          />
        </>
      )}
    </Box>
  );
};

const TopBar = ({ topBarHeight }) => {
  // const classes = useStyles();
  const [open, setOpen] = useState(false);

  const [defaultBrandLogoUrl, setDefaultBrandLogoUrl] = useState(null);

  const {
    chatEnabled,
    screenShareEnabled,
    canChangeLayout,
    participantCanToggleLivestream,
    liveStreamEnabled,
    hlsEnabled,
    pollEnabled,
    whiteboardEnabled,
    participantCanToggleSelfWebcam,
    participantCanToggleSelfMic,
    raiseHandEnabled,
    recordingEnabled,
    realtimeTranscriptionEnabled,
    brandingEnabled,
    brandLogoURL,
    brandName,
    participantCanLeave,
    poweredBy,
    participantCanEndMeeting,
    animationsEnabled,
    meetingMode,
    participantTabPanelEnabled,
    moreOptionsEnabled,
    appTheme,
  } = useMeetingAppContext();

  const handleClickFAB = () => {
    setOpen(true);
  };

  const handleCloseFAB = () => {
    console.log("asdas");
    setOpen(false);
  };

  const isMobile = useIsMobile();
  const isTab = useIsTab();
  const theme = useTheme();

  const topBarButtonTypes = useMemo(
    () => ({
      END_CALL: "END_CALL",
      ACTIVITIES: "ACTIVITIES",
      CHAT: "CHAT",
      PARTICIPANTS: "PARTICIPANTS",
      SCREEN_SHARE: "SCREEN_SHARE",
      WEBCAM: "WEBCAM",
      MIC: "MIC",
      RAISE_HAND: "RAISE_HAND",
      RECORDING: "RECORDING",
      CLOSE_CAPTION: "CLOSE_CAPTION",
      HLS: "HLS",
      WHITEBOARD: "WHITEBOARD",
      ADD_LIVE_STREAM: "ADD_LIVE_STREAM",
      CONFIGURATION: "CONFIGURATION",
      GO_LIVE: "GO_LIVE",
    }),
    []
  );

  const { topBarIcons, firstFourElements, excludeFirstFourElements } =
    useMemo(() => {
      const arr = [];
      const mobileIconArr = [];

      if (participantCanLeave || participantCanEndMeeting) {
        arr.unshift([topBarButtonTypes.END_CALL]);
        mobileIconArr.unshift({
          buttonType: topBarButtonTypes.END_CALL,
          priority: 1,
        });
      }

      const arrSideBar = [];

      if (canChangeLayout && meetingMode === meetingModes.CONFERENCE) {
        arrSideBar.unshift(topBarButtonTypes.CONFIGURATION);
        mobileIconArr.unshift({
          buttonType: topBarButtonTypes.CONFIGURATION,
          priority: 7,
        });
      }
      if (chatEnabled) {
        arrSideBar.unshift(topBarButtonTypes.CHAT);
        mobileIconArr.unshift({
          buttonType: topBarButtonTypes.CHAT,
          priority: 5,
        });
      }
      if (participantTabPanelEnabled) {
        arrSideBar.unshift(topBarButtonTypes.PARTICIPANTS);
        mobileIconArr.unshift({
          buttonType: topBarButtonTypes.PARTICIPANTS,
          priority: 10,
        });
      }

      if (moreOptionsEnabled) {
        arrSideBar.unshift(topBarButtonTypes.ACTIVITIES);
        mobileIconArr.unshift({
          buttonType: topBarButtonTypes.ACTIVITIES,
          // priority: 10,
        });
      }

      arr.unshift(arrSideBar);

      const arrMedia = [];

      if (screenShareEnabled && meetingMode === meetingModes.CONFERENCE) {
        arrMedia.unshift(topBarButtonTypes.SCREEN_SHARE);
        mobileIconArr.unshift({
          buttonType: topBarButtonTypes.SCREEN_SHARE,
          priority: 6,
        });
      }
      if (
        participantCanToggleSelfWebcam &&
        meetingMode === meetingModes.CONFERENCE
      ) {
        arrMedia.unshift(topBarButtonTypes.WEBCAM);
        mobileIconArr.unshift({
          buttonType: topBarButtonTypes.WEBCAM,
          priority: 2,
        });
      }
      if (
        participantCanToggleSelfMic &&
        meetingMode === meetingModes.CONFERENCE
      ) {
        arrMedia.unshift(topBarButtonTypes.MIC);
        mobileIconArr.unshift({
          buttonType: topBarButtonTypes.MIC,
          priority: 3,
        });
      }

      if (arrMedia.length) {
        arr.unshift(arrMedia);
      }

      const utilsArr = [];

      if (raiseHandEnabled) {
        utilsArr.unshift(topBarButtonTypes.RAISE_HAND);
        mobileIconArr.unshift({
          buttonType: topBarButtonTypes.RAISE_HAND,
          priority: 13,
        });
      }
      //
      if (
        realtimeTranscriptionEnabled &&
        meetingMode === meetingModes.CONFERENCE
      ) {
        utilsArr.unshift(topBarButtonTypes.CLOSE_CAPTION);
        mobileIconArr.unshift({
          buttonType: topBarButtonTypes.CLOSE_CAPTION,
          // priority: 5,
        });
      }

      if (recordingEnabled && meetingMode === meetingModes.CONFERENCE) {
        utilsArr.unshift(topBarButtonTypes.RECORDING);
        mobileIconArr.unshift({
          buttonType: topBarButtonTypes.RECORDING,
          priority: 4,
        });
      }

      // if (whiteboardEnabled && meetingMode === meetingModes.CONFERENCE) {
      //   utilsArr.unshift(topBarButtonTypes.WHITEBOARD);
      //   mobileIconArr.unshift({
      //     buttonType: topBarButtonTypes.WHITEBOARD,
      //     priority: 11,
      //   });
      // }

      if (
        liveStreamEnabled &&
        !participantCanToggleLivestream &&
        meetingMode === meetingModes.CONFERENCE
      ) {
        utilsArr.unshift(topBarButtonTypes.GO_LIVE);
        mobileIconArr.unshift({
          buttonType: topBarButtonTypes.GO_LIVE,
          priority: 9,
        });
      }

      if (hlsEnabled && meetingMode === meetingModes.CONFERENCE) {
        utilsArr.unshift(topBarButtonTypes.HLS);
        mobileIconArr.unshift({
          buttonType: topBarButtonTypes.HLS,
          priority: 14,
        });
      }

      if (
        participantCanToggleLivestream &&
        liveStreamEnabled &&
        meetingMode === meetingModes.CONFERENCE
      ) {
        //liveStreamIcon
        utilsArr.unshift(topBarButtonTypes.GO_LIVE);
        mobileIconArr.unshift({
          buttonType: topBarButtonTypes.GO_LIVE,
          priority: 9,
        });
        //AddLiveStreamIcon
        // utilsArr.unshift(topBarButtonTypes.ADD_LIVE_STREAM);
        // mobileIconArr.unshift({
        //   buttonType: topBarButtonTypes.ADD_LIVE_STREAM,
        //   priority: 8,
        // });
      }

      if (participantCanToggleLivestream && !liveStreamEnabled) {
      }

      if (utilsArr.length) {
        arr.unshift(utilsArr);
      }

      //sorting mobile icon
      mobileIconArr
        .sort((iconA, iconB) => iconA.priority - iconB.priority)
        .map((icon) => icon.buttonType);

      const firstFourElements = mobileIconArr.slice(0, 4);

      const excludeFirstFourElements = mobileIconArr.slice(4);

      return {
        topBarIcons: arr,
        mobileIcons: mobileIconArr,
        firstFourElements,
        excludeFirstFourElements,
      };
    }, [
      participantCanToggleSelfMic,
      participantCanToggleSelfWebcam,
      screenShareEnabled,
      pollEnabled,
      whiteboardEnabled,
      chatEnabled,
      raiseHandEnabled,
      topBarButtonTypes,
      recordingEnabled,
      realtimeTranscriptionEnabled,
      meetingMode,
    ]);

  const [topBarVisible, setTopBarVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setTopBarVisible(true);
    }, 100);
  }, []);

  return isTab || isMobile ? (
    <Box
      style={{
        height: topBarHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor:
          appTheme === appThemes.DARK
            ? theme.palette.darkTheme.main
            : appTheme === appThemes.LIGHT
            ? theme.palette.lightTheme.main
            : theme.palette.background.default,
      }}
    >
      {firstFourElements.map((icon, i) => {
        return (
          <Box key={`topbar_controls_j_${i}`} ml={i === 0 ? 0 : 1.5}>
            {icon.buttonType === topBarButtonTypes.RAISE_HAND ? (
              <RaiseHandBTN />
            ) : icon.buttonType === topBarButtonTypes.MIC ? (
              <MicBTN />
            ) : icon.buttonType === topBarButtonTypes.WEBCAM ? (
              <WebcamBTN />
            ) : icon.buttonType === topBarButtonTypes.SCREEN_SHARE ? (
              <ScreenShareBTN />
            ) : icon.buttonType === topBarButtonTypes.PARTICIPANTS ? (
              <ParticipantsBTN />
            ) : icon.buttonType === topBarButtonTypes.CHAT ? (
              <ChatBTN />
            ) : icon.buttonType === topBarButtonTypes.ACTIVITIES ? (
              <ActivitiesBTN />
            ) : icon.buttonType === topBarButtonTypes.END_CALL ? (
              <EndCallBTN />
            ) : icon.buttonType === topBarButtonTypes.CLOSE_CAPTION ? (
              <TranscriptionBTN />
            ) : icon.buttonType === topBarButtonTypes.RECORDING ? (
              <RecordingBTN />
            ) : icon.buttonType === topBarButtonTypes.HLS ? (
              <HlsBTN />
            ) : icon.buttonType === topBarButtonTypes.GO_LIVE ? (
              <GoLiveBTN />
            ) : icon.buttonType === topBarButtonTypes.WHITEBOARD ? (
              <WhiteBoardBTN />
            ) : icon.buttonType === topBarButtonTypes.ADD_LIVE_STREAM ? (
              <AddLiveStreamBTN />
            ) : icon.buttonType === topBarButtonTypes.CONFIGURATION ? (
              <ConfigBTN />
            ) : null}
          </Box>
        );
      })}

      {excludeFirstFourElements.length >= 1 && (
        <Box ml={2}>
          <OutlineIconButton
            Icon={MoreHorizIcon}
            // Icon={Boolean(anchorEl) ? CloseIcon : MoreHorizIcon}
            // isFocused={anchorEl}
            onClick={handleClickFAB}
          />
        </Box>
      )}

      <SwipeableDrawer
        anchor={"bottom"}
        open={Boolean(open)}
        onClose={handleCloseFAB}
        onOpen={handleClickFAB}
        style={{ paddingBottom: "100px" }}
      >
        <Grid
          container
          style={{
            backgroundColor:
              appTheme === appThemes.DARK
                ? theme.palette.darkTheme.main
                : appTheme === appThemes.LIGHT
                ? theme.palette.lightTheme.main
                : theme.palette.background.default,
          }}
        >
          {excludeFirstFourElements.map((icon, i) => {
            return (
              <Grid
                item
                xs={4}
                sm={3}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {icon.buttonType === topBarButtonTypes.RAISE_HAND ? (
                  <RaiseHandBTN
                    onClick={handleCloseFAB}
                    isMobile={isMobile}
                    isTab={isTab}
                  />
                ) : icon.buttonType === topBarButtonTypes.MIC ? (
                  <MicBTN
                    onClick={handleCloseFAB}
                    isMobile={isMobile}
                    isTab={isTab}
                  />
                ) : icon.buttonType === topBarButtonTypes.WEBCAM ? (
                  <WebcamBTN
                    onClick={handleCloseFAB}
                    isMobile={isMobile}
                    isTab={isTab}
                  />
                ) : icon.buttonType === topBarButtonTypes.SCREEN_SHARE ? (
                  <ScreenShareBTN
                    onClick={handleCloseFAB}
                    isMobile={isMobile}
                    isTab={isTab}
                  />
                ) : icon.buttonType === topBarButtonTypes.PARTICIPANTS ? (
                  <ParticipantsBTN
                    onClick={handleCloseFAB}
                    isMobile={isMobile}
                    isTab={isTab}
                  />
                ) : icon.buttonType === topBarButtonTypes.CHAT ? (
                  <ChatBTN
                    onClick={handleCloseFAB}
                    isMobile={isMobile}
                    isTab={isTab}
                  />
                ) : icon.buttonType === topBarButtonTypes.ACTIVITIES ? (
                  <ActivitiesBTN
                    onClick={handleCloseFAB}
                    isMobile={isMobile}
                    isTab={isTab}
                  />
                ) : icon.buttonType === topBarButtonTypes.END_CALL ? (
                  <EndCallBTN
                    onClick={handleCloseFAB}
                    isMobile={isMobile}
                    isTab={isTab}
                  />
                ) : icon.buttonType === topBarButtonTypes.CLOSE_CAPTION ? (
                  <TranscriptionBTN
                    onClick={handleCloseFAB}
                    isMobile={isMobile}
                    isTab={isTab}
                  />
                ) : icon.buttonType === topBarButtonTypes.RECORDING ? (
                  <RecordingBTN
                    onClick={handleCloseFAB}
                    isMobile={isMobile}
                    isTab={isTab}
                  />
                ) : icon.buttonType === topBarButtonTypes.HLS ? (
                  <HlsBTN
                    onClick={handleCloseFAB}
                    isMobile={isMobile}
                    isTab={isTab}
                  />
                ) : icon.buttonType === topBarButtonTypes.GO_LIVE ? (
                  <GoLiveBTN
                    onClick={handleCloseFAB}
                    isMobile={isMobile}
                    isTab={isTab}
                  />
                ) : icon.buttonType === topBarButtonTypes.WHITEBOARD ? (
                  <WhiteBoardBTN
                    onClick={handleCloseFAB}
                    isMobile={isMobile}
                    isTab={isTab}
                  />
                ) : icon.buttonType === topBarButtonTypes.ADD_LIVE_STREAM ? (
                  <AddLiveStreamBTN
                    onClick={handleCloseFAB}
                    isMobile={isMobile}
                    isTab={isTab}
                  />
                ) : icon.buttonType === topBarButtonTypes.CONFIGURATION ? (
                  <ConfigBTN
                    onClick={handleCloseFAB}
                    isMobile={isMobile}
                    isTab={isTab}
                  />
                ) : null}
              </Grid>
            );
          })}
        </Grid>
      </SwipeableDrawer>
    </Box>
  ) : (
    <Box
      style={{
        height: topBarHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor:
          appTheme === appThemes.DARK
            ? theme.palette.darkTheme.main
            : appTheme === appThemes.LIGHT
            ? theme.palette.lightTheme.main
            : theme.palette.background.default,
        borderBottom: `1px solid ${
          appTheme === appThemes.LIGHT
            ? theme.palette.lightTheme.outlineColor
            : "#ffffff33"
        }`,
        position: "relative",
        top: topBarVisible ? 0 : -topBarHeight,
        transition: `all ${400 * (animationsEnabled ? 1 : 0.5)}ms`,
        transitionTimingFunction: "ease-in-out",
      }}
    >
      <Box
        style={{
          display: "flex",
          height: topBarHeight,
          paddingLeft: theme.spacing(2),
          position: "relative",
          alignItems: "center",
        }}
      >
        {brandingEnabled && (
          <>
            <img
              alt={"App Logo"}
              style={{
                display: "inline-block",
                height: topBarHeight,
              }}
              src={
                defaultBrandLogoUrl ||
                brandLogoURL ||
                `https://static.videosdk.live/prebuilt/videosdk_logo_circle.png`
              }
              onError={() => {
                setDefaultBrandLogoUrl(
                  `https://static.videosdk.live/prebuilt/videosdk_logo_circle.png`
                );
              }}
            />
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
              ml={1}
            >
              <Typography
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "600",
                  color:
                    appTheme === appThemes.LIGHT
                      ? theme.palette.lightTheme.contrastText
                      : "white",
                }}
              >
                {brandName}
              </Typography>
              {poweredBy ? (
                <Typography
                  style={{
                    fontSize: "0.9rem",
                    wordBreak: "break-all",
                    display: "flex",
                    alignItems: "center",
                    color:
                      appTheme === appThemes.LIGHT &&
                      theme.palette.lightTheme.contrastText,
                  }}
                  color={"textSecondary"}
                >
                  Powered by&nbsp;
                  <Link
                    style={{ textDecorationColor: "#fa3a57" }}
                    target={"_blank"}
                    href={"https://videosdk.live"}
                  >
                    <Typography
                      style={{
                        color: "#fa3a57",
                        textTransform: "lowercase",
                        fontSize: "0.9rem",
                      }}
                    >
                      videosdk.live
                    </Typography>
                  </Link>
                </Typography>
              ) : null}
            </Box>
          </>
        )}
      </Box>

      <Box
        display={"flex"}
        alignItems={"center"}
        // className={classes.row}
        p={2}
      >
        {topBarIcons.map((row, i) => {
          return (
            <React.Fragment key={`topbar_controls_i_${i}`}>
              {i !== 0 && (
                <Box
                  style={{
                    backgroundColor:
                      appTheme === appThemes.LIGHT
                        ? theme.palette.lightTheme.outlineColor
                        : "#ffffff33",
                    width: 1,
                    height: topBarHeight - theme.spacing(1.5),
                    flex: 1,
                  }}
                />
              )}
              <Box
                ml={i === 0 ? 0 : 2}
                mr={i === topBarIcons.length - 1 ? 0 : 2}
                display={"flex"}
                alignItems={"center"}
                // className={classes.row}
              >
                {row.map((buttonType, j) => {
                  return (
                    <Box key={`topbar_controls_j_${j}`} ml={j === 0 ? 0 : 1.5}>
                      {buttonType === topBarButtonTypes.RAISE_HAND ? (
                        <RaiseHandBTN />
                      ) : buttonType === topBarButtonTypes.MIC ? (
                        <MicBTN />
                      ) : buttonType === topBarButtonTypes.WEBCAM ? (
                        <WebcamBTN />
                      ) : buttonType === topBarButtonTypes.SCREEN_SHARE ? (
                        <ScreenShareBTN />
                      ) : buttonType === topBarButtonTypes.PARTICIPANTS ? (
                        <ParticipantsBTN />
                      ) : buttonType === topBarButtonTypes.CHAT ? (
                        <ChatBTN />
                      ) : buttonType === topBarButtonTypes.ACTIVITIES ? (
                        <ActivitiesBTN />
                      ) : buttonType === topBarButtonTypes.END_CALL ? (
                        <EndCallBTN />
                      ) : buttonType === topBarButtonTypes.CLOSE_CAPTION ? (
                        <TranscriptionBTN />
                      ) : buttonType === topBarButtonTypes.RECORDING ? (
                        <RecordingBTN />
                      ) : buttonType === topBarButtonTypes.HLS ? (
                        <HlsBTN />
                      ) : buttonType === topBarButtonTypes.GO_LIVE ? (
                        <GoLiveBTN />
                      ) : buttonType === topBarButtonTypes.WHITEBOARD ? (
                        <WhiteBoardBTN />
                      ) : buttonType === topBarButtonTypes.ADD_LIVE_STREAM ? (
                        <AddLiveStreamBTN />
                      ) : buttonType === topBarButtonTypes.CONFIGURATION ? (
                        <ConfigBTN />
                      ) : null}
                    </Box>
                  );
                })}
              </Box>
            </React.Fragment>
          );
        })}
      </Box>
    </Box>
  );
};

export default TopBar;
