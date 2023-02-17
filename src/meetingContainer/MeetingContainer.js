import React, { useEffect, useMemo, useRef, useState } from "react";
import MainViewContainer from "./mainViewContainer/MainViewContainer";
import SideViewContainer from "./sideViewContainer/SideViewContainer";
import TopBar from "./TopBar";
import {
  meetingLayouts,
  appThemes,
  useMeetingAppContext,
} from "../MeetingAppContextDef";
import useSortActiveParticipants from "./useSortActiveParticipants";
import { useMeeting } from "@videosdk.live/react-sdk";
import useIsTab from "../utils/useIsTab";
import useIsMobile from "../utils/useIsMobile";
import { usePubSub, Constants } from "@videosdk.live/react-sdk";
import {
  appEvents,
  eventEmitter,
  getUniqueId,
  json_verify,
  nameTructed,
  trimSnackBarText,
} from "../utils/common";
import { useSnackbar } from "notistack";
import useResponsiveSize from "../utils/useResponsiveSize";
import useRaisedHandParticipants from "./useRaisedHandParticipants";
import MediaRequested from "../components/MediaRequested";
import RequestedEntries from "../components/RequestedEntries";
import ClickAnywhereToContinue from "../components/ClickAnywhereToContinue";
import PinnedLayoutViewContainer from "./pinnedLayoutViewContainer/PinnedLayoutViewContainer";
import ParticipantsAudioPlayer from "./mainViewContainer/ParticipantsAudioPlayer";
import useWhiteBoard from "./useWhiteBoard";
import ConfirmBox from "../components/ConfirmBox";
import WaitingToJoin from "../components/WaitingToJoin";
import HLSContainer from "./hlsViewContainer/HLSContainer";
import ModeListner from "../components/ModeListner";
import useIsRecording from "./useIsRecording";
import useIsLivestreaming from "./useIsLivestreaming";
import useIsHls from "./useIsHls";
import PauseInvisibleParticipants from "./mainViewContainer/PauseInvisibleParticipants";
import {
  meetingModes,
  RECORDER_MAX_GRID_SIZE,
  RECORDER_MAX_GRID_SIZE_WITH_SCREENSCHARE_ENABLED,
} from "../CONSTS";
import { Box, CircularProgress } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import PollsListner from "../components/PollListner";
import RecordingLoader from "../components/RecordingLoader";
import useCustomTrack from "../utils/useCustomTrack";

const getPinMsg = ({
  localParticipant,
  participantId,
  pinnedBy,
  state,
  pinnedByDisplayName,
  partcipantDisplayName,
}) => {
  const pinEnabled = state.cam || state.share;
  const pinnedSelf = participantId === pinnedBy;
  const pinStateText = pinEnabled ? "pinned" : "unpinned";
  const localParticipantWasPinned = localParticipant === participantId;
  const localParticipantPinned = localParticipant === pinnedBy;

  if (pinnedSelf && localParticipantWasPinned && localParticipantPinned) {
    return `You ${pinStateText} yourself`;
  } else if (pinnedSelf && !localParticipantWasPinned) {
    return `${nameTructed(partcipantDisplayName, 15)}  was ${pinStateText}`;
  } else if (!localParticipantWasPinned && !localParticipantPinned) {
    return `${nameTructed(
      partcipantDisplayName,
      15
    )} was ${pinStateText} by ${nameTructed(pinnedByDisplayName, 15)}`;
  } else if (localParticipantWasPinned && !localParticipantPinned) {
    return `You were ${pinStateText} by ${nameTructed(
      pinnedByDisplayName,
      15
    )}`;
  } else if (!localParticipantWasPinned && localParticipantPinned) {
    return ` You ${pinStateText} ${nameTructed(partcipantDisplayName, 15)}`;
  } else if (!pinnedBy) {
    if (localParticipantWasPinned) {
      return `You were ${pinStateText}`;
    } else {
      return `${nameTructed(partcipantDisplayName, 15)} was ${pinStateText}`;
    }
  }
};

const MeetingContainer = () => {
  const showJoinNotificationRef = useRef(false);
  const localParticipantAutoPinnedOnShare = useRef(false);

  const mMeetingRef = useRef();

  const [containerHeight, setContainerHeight] = useState(0);
  const [meetingError, setMeetingError] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [localParticipantAllowedJoin, setLocalParticipantAllowedJoin] =
    useState(null);
  const { enqueueSnackbar } = useSnackbar();
  useWhiteBoard();

  useSortActiveParticipants();
  const { participantRaisedHand } = useRaisedHandParticipants();
  const isLiveStreaming = useIsLivestreaming();
  const isRecording = useIsRecording();
  const isHls = useIsHls();

  const isLiveStreamingRef = useRef(isLiveStreaming);
  const isRecordingRef = useRef(isRecording);
  const isHlsRef = useRef(isHls);

  const sideBarContainerWidth = useResponsiveSize({
    xl: 400,
    lg: 360,
    md: 320,
    sm: 280,
    xs: 240,
  });

  useEffect(() => {
    containerRef.current?.offsetHeight &&
      setContainerHeight(containerRef.current.offsetHeight);
    containerRef.current?.offsetWidth &&
      setContainerWidth(containerRef.current.offsetWidth);

    window.addEventListener("resize", ({ target }) => {
      containerRef.current?.offsetHeight &&
        setContainerHeight(containerRef.current.offsetHeight);
      containerRef.current?.offsetWidth &&
        setContainerWidth(containerRef.current.offsetWidth);
    });
  }, []);

  useEffect(() => {
    isLiveStreamingRef.current = isLiveStreaming;
  }, [isLiveStreaming]);

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  useEffect(() => {
    isHlsRef.current = isHls;
  }, [isHls]);

  const {
    redirectOnLeave,
    sideBarMode,
    containerRef,
    participantCanToggleRecording,
    participantCanToggleHls,
    participantCanToggleLivestream,
    autoStartLiveStream,
    autoStartRecording,
    autoStartHls,
    recordingWebhookUrl,
    recordingAWSDirPath,
    liveStreamOutputs,
    askJoin,
    notificationSoundEnabled,
    meetingLayout,
    selectedMic,
    selectedWebcam,
    joinScreenWebCam,
    joinScreenMic,
    canDrawOnWhiteboard,
    setMeetingLeft,
    appMeetingLayout,
    setAppMeetingLayout,
    topbarEnabled,
    notificationAlertsEnabled,
    debug,
    meetingLayoutTopic,
    setLiveStreamConfig,
    liveStreamConfig,
    meetingMode,
    isRecorder,
    setDownstreamUrl,
    setAfterMeetingJoinedHLSState,
    appTheme,
    recordingTheme,
    hlsTheme,
    liveStreamTheme,
  } = useMeetingAppContext();

  const { getCustomAudioTrack, getCustomVideoTrack } = useCustomTrack();

  const topBarHeight = topbarEnabled ? 60 : 0;

  const isTab = useIsTab();
  const isMobile = useIsMobile();

  const { type, priority, gridSize } = useMemo(
    () => ({
      type: appMeetingLayout.type,
      priority: appMeetingLayout.priority,
      gridSize: appMeetingLayout.gridSize,
    }),
    [appMeetingLayout]
  );

  const liveStreamConfigRef = useRef(liveStreamConfig);
  const typeRef = useRef(type);
  const priorityRef = useRef(priority);
  const gridSizeRef = useRef(gridSize);
  const meetingModeRef = useRef(meetingMode);

  useEffect(() => {
    liveStreamConfigRef.current = liveStreamConfig;
  }, [liveStreamConfig]);

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
    meetingModeRef.current = meetingMode;
  }, [meetingMode]);

  usePubSub(meetingLayoutTopic, {
    onMessageReceived: (data) => {
      setAppMeetingLayout({
        ...data.message.layout,
        gridSize: isRecorder
          ? mMeetingRef.current?.presenterId
            ? data.message.layout.gridSize >
              RECORDER_MAX_GRID_SIZE_WITH_SCREENSCHARE_ENABLED
              ? RECORDER_MAX_GRID_SIZE_WITH_SCREENSCHARE_ENABLED
              : data.message.layout.gridSize
            : data.message.layout.gridSize > RECORDER_MAX_GRID_SIZE
            ? RECORDER_MAX_GRID_SIZE
            : data.message.layout.gridSize
          : data.message.layout.gridSize,
      });
    },
    onOldMessagesReceived: (messages) => {
      const latestMessage = messages.sort((a, b) => {
        if (a.timestamp > b.timestamp) {
          return -1;
        }
        if (a.timestamp < b.timestamp) {
          return 1;
        }
        return 0;
      })[0];

      if (latestMessage) {
        setAppMeetingLayout({
          ...latestMessage.message.layout,
          gridSize: isRecorder
            ? mMeetingRef.current?.presenterId
              ? latestMessage.message.layout.gridSize >
                RECORDER_MAX_GRID_SIZE_WITH_SCREENSCHARE_ENABLED
                ? RECORDER_MAX_GRID_SIZE_WITH_SCREENSCHARE_ENABLED
                : latestMessage.message.layout.gridSize
              : latestMessage.message.layout.gridSize > RECORDER_MAX_GRID_SIZE
              ? RECORDER_MAX_GRID_SIZE
              : latestMessage.message.layout.gridSize
            : latestMessage.message.layout.gridSize,
        });
      }
    },
  });

  const { publish: liveStreamConfigPublish } = usePubSub("LIVE_STREAM_CONFIG", {
    onMessageReceived: (data) => {
      setLiveStreamConfig(data.message.config);
    },

    onOldMessagesReceived: (messages) => {
      const latestMessage = messages.sort((a, b) => {
        if (a.timestamp > b.timestamp) {
          return -1;
        }
        if (a.timestamp < b.timestamp) {
          return 1;
        }
        return 0;
      })[0];

      if (latestMessage) {
        setLiveStreamConfig(latestMessage.message.config);
      }
    },
  });

  const liveStreamConfigPublishRef = useRef();

  useEffect(() => {
    liveStreamConfigPublishRef.current = liveStreamConfigPublish;
  }, [liveStreamConfigPublish]);

  const _handleOnMeetingJoined = async () => {
    const { changeWebcam, changeMic, muteMic, disableWebcam } =
      mMeetingRef.current;

    setTimeout(() => {
      const { startLivestream, startRecording, startHls } = mMeetingRef.current;

      const isLiveStreaming = isLiveStreamingRef.current;
      const isRecording = isRecordingRef.current;
      const isHls = isHlsRef.current;

      const outputs = liveStreamConfigRef?.current?.length
        ? liveStreamConfigRef.current
        : liveStreamOutputs?.length
        ? liveStreamOutputs
        : null;

      const type = typeRef.current;
      const priority = priorityRef.current;
      const gridSize = gridSizeRef.current;

      const layout = { type, priority, gridSize };

      //
      //

      if (autoStartLiveStream && !isLiveStreaming && outputs?.length) {
        startLivestream(outputs, { layout, theme: liveStreamTheme });

        liveStreamConfigPublishRef.current(
          {
            config: outputs.map((output) => {
              return { ...output, id: getUniqueId() };
            }),
          },
          { persist: true }
        );
      }

      //
      //

      if (autoStartRecording && !isRecording) {
        startRecording(recordingWebhookUrl, recordingAWSDirPath, {
          layout,
          theme: recordingTheme,
        });
      }

      //
      //

      if (autoStartHls && !isHls) {
        startHls({ layout, theme: hlsTheme });
      }
    }, 3000);

    if (joinScreenWebCam && selectedWebcam.id) {
      await new Promise((resolve) => {
        disableWebcam();
        setTimeout(async () => {
          const track = await getCustomVideoTrack(selectedWebcam.id);
          changeWebcam(track);
          resolve();
        }, 500);
      });
    }

    if (joinScreenMic && selectedMic.id) {
      await new Promise((resolve) => {
        muteMic();
        setTimeout(async () => {
          const audioTrack = await getCustomAudioTrack(selectedMic.id);
          changeMic(audioTrack);
          // changeMic(selectedMic.id);
          resolve();
        }, 500);
      });
    }
  };

  const _handleMeetingLeft = () => {
    if (redirectOnLeave && redirectOnLeave !== "undefined") {
      window.parent.location = redirectOnLeave;
    } else {
      setMeetingLeft(true);
    }
  };

  usePubSub("CHAT", {
    onMessageReceived: (data) => {
      const localParticipantId = mMeetingRef.current?.localParticipant?.id;

      const { senderId, senderName, message } = data;

      const isLocal = senderId === localParticipantId;

      if (!isLocal) {
        if (notificationSoundEnabled) {
          new Audio(
            `https://static.videosdk.live/prebuilt/notification.mp3`
          ).play();
        }
        if (notificationAlertsEnabled) {
          enqueueSnackbar(
            trimSnackBarText(`${nameTructed(senderName, 15)} says: ${message}`)
          );
        }
      }
    },
  });

  usePubSub("RAISE_HAND", {
    onMessageReceived: (data) => {
      const localParticipantId = mMeetingRef.current?.localParticipant?.id;

      const { senderId, senderName } = data;

      const isLocal = senderId === localParticipantId;
      if (notificationSoundEnabled) {
        new Audio(
          `https://static.videosdk.live/prebuilt/notification.mp3`
        ).play();
      }
      if (notificationAlertsEnabled) {
        enqueueSnackbar(
          `${isLocal ? "You" : nameTructed(senderName, 15)} raised hand 🖐🏼`
        );
      }
      participantRaisedHand(senderId);
    },
  });

  const _handleChatMessage = (data) => {
    const localParticipantId = mMeetingRef.current?.localParticipant?.id;

    const { senderId, senderName, text } = data;

    const isLocal = senderId === localParticipantId;

    if (json_verify(text)) {
      const { type } = JSON.parse(text);

      if (type === "END_CALL") {
        if (notificationSoundEnabled) {
          new Audio(
            `https://static.videosdk.live/prebuilt/notification.mp3`
          ).play();
        }

        if (notificationAlertsEnabled) {
          enqueueSnackbar(
            `${
              isLocal
                ? "You end the call"
                : " This meeting has been ended by host"
            }`
          );
        }
      }
    }
  };

  const _handleParticipantJoined = (data) => {
    // if (showJoinNotificationRef.current) {
    //   const { displayName } = data;
    // if (notificationSoundEnabled) {
    //   new Audio(`https://static.videosdk.live/prebuilt/notification.mp3`).play();
    // }
    // if (notificationAlertsEnabled) {
    //   enqueueSnackbar(`${displayName} joined the meeting`, {});
    // }
    // }
  };

  const _handleParticipantLeft = (data) => {
    // const { displayName } = data;
    // if (notificationSoundEnabled) {
    // new Audio(`https://static.videosdk.live/prebuilt/notification.mp3`).play();
    // }
    // if (notificationAlertsEnabled) {
    // enqueueSnackbar(`${displayName} left the meeting`, {});
    // }
  };

  const _handlePresenterChanged = (presenterId) => {
    // reduce grid size in recorder if presenter changes
    if (isRecorder) {
      if (presenterId) {
        setAppMeetingLayout((s) => ({
          ...s,
          gridSize:
            s.gridSize > RECORDER_MAX_GRID_SIZE_WITH_SCREENSCHARE_ENABLED
              ? RECORDER_MAX_GRID_SIZE_WITH_SCREENSCHARE_ENABLED
              : s.gridSize,
        }));
      } else {
        setAppMeetingLayout((s) => ({
          ...s,
          gridSize:
            s.gridSize > RECORDER_MAX_GRID_SIZE
              ? RECORDER_MAX_GRID_SIZE
              : s.gridSize,
        }));
      }
    }

    if (!presenterId && localParticipantAutoPinnedOnShare.current === true) {
      mMeetingRef.current?.localParticipant.unpin();
      localParticipantAutoPinnedOnShare.current = false;
    }

    const localParticipantId = mMeetingRef.current?.localParticipant?.id;
    const participants = mMeetingRef.current?.participants;
    const pinnedParticipants = new Map(mMeetingRef.current?.pinnedParticipants);

    const mPresenter = participants.get(presenterId);

    const isLocal = presenterId === localParticipantId;

    if (mPresenter) {
      if (isLocal) {
        if (pinnedParticipants.size) {
          const localIsPinned = pinnedParticipants.get(presenterId);
          if (!localIsPinned) {
            localParticipantAutoPinnedOnShare.current = true;

            mMeetingRef.current?.localParticipant.pin();
          }
        }
      }
      if (
        notificationSoundEnabled &&
        meetingModeRef.current === meetingModes.CONFERENCE
      ) {
        new Audio(
          `https://static.videosdk.live/prebuilt/notification.mp3`
        ).play();
      }

      if (
        notificationAlertsEnabled &&
        meetingModeRef.current === meetingModes.CONFERENCE
      ) {
        enqueueSnackbar(
          `${
            isLocal ? "You" : nameTructed(mPresenter.displayName, 15)
          } started presenting`
        );
      }
    }
  };

  const _handleOnRecordingStarted = () => {};

  const _handleOnRecordingStopped = () => {};

  const _handleOnLiveStreamStarted = () => {};

  const _handleOnLiveStreamStopped = () => {};

  const _handleOnRecordingStateChanged = ({ status }) => {
    if (
      participantCanToggleRecording &&
      notificationAlertsEnabled &&
      meetingModeRef.current === meetingModes.CONFERENCE &&
      (status === Constants.recordingEvents.RECORDING_STARTED ||
        status === Constants.recordingEvents.RECORDING_STOPPED)
    ) {
      enqueueSnackbar(
        status === Constants.recordingEvents.RECORDING_STARTED
          ? "Meeting recording is started."
          : "Meeting recording is stopped."
      );
    }
  };

  const _handleOnLivestreamStateChanged = ({ status }) => {
    if (
      participantCanToggleLivestream &&
      notificationAlertsEnabled &&
      meetingModeRef.current === meetingModes.CONFERENCE &&
      (status === Constants.livestreamEvents.LIVESTREAM_STARTED ||
        status === Constants.livestreamEvents.LIVESTREAM_STOPPED)
    ) {
      enqueueSnackbar(
        status === Constants.livestreamEvents.LIVESTREAM_STARTED
          ? "Meeting livestreaming is started."
          : "Meeting livestreaming is stopped."
      );
    }
  };

  function onMeetingStateChanged(data) {
    const { state } = data;

    enqueueSnackbar(
      state === "CONNECTED"
        ? "Meeting is connected"
        : state === "CONNECTING"
        ? "Meeting is connecting"
        : state === "FAILED"
        ? "Meeting connection failed"
        : state === "DISCONNECTED"
        ? "Meeting connection disconnected abruptly"
        : state === "CLOSING"
        ? "Meeting is closing"
        : state === "CLOSED"
        ? "Meeting connection closed"
        : ""
    );
  }

  const _handleOnHlsStateChanged = (data) => {
    //
    if (
      participantCanToggleHls &&
      notificationAlertsEnabled &&
      meetingModeRef.current === meetingModes.CONFERENCE && // trigger on conference mode only
      (data.status === Constants.hlsEvents.HLS_STARTED ||
        data.status === Constants.hlsEvents.HLS_STOPPED)
    ) {
      enqueueSnackbar(
        data.status === Constants.hlsEvents.HLS_STARTED
          ? "Meeting HLS is started."
          : "Meeting HLS is stopped."
      );
    }

    if (
      data.status === Constants.hlsEvents.HLS_STARTED ||
      data.status === Constants.hlsEvents.HLS_STOPPED
    ) {
      setDownstreamUrl(
        data.status === Constants.hlsEvents.HLS_STARTED
          ? data.downstreamUrl
          : null
      );
    }

    if (data.status === Constants.hlsEvents.HLS_STARTED) {
      setAfterMeetingJoinedHLSState("STARTED");
    }

    if (data.status === Constants.hlsEvents.HLS_STOPPED) {
      setAfterMeetingJoinedHLSState("STOPPED");
    }

    //set downstream url on basis of started or stopped
  };

  const _handleOnHlsStarted = (data) => {};

  const _handleOnHlsStopped = () => {};

  const _handleOnEntryRequested = () => {};

  const _handleOnEntryResponded = (participantId, decision) => {
    if (mMeetingRef.current?.localParticipant?.id === participantId) {
      if (decision === "allowed") {
        setLocalParticipantAllowedJoin(true);
      } else {
        setLocalParticipantAllowedJoin(false);
        setTimeout(() => {
          _handleMeetingLeft();
        }, 3000);
      }
    }
  };

  const _handleOnPinStateChanged = (data) => {
    let localParticipant = mMeetingRef.current?.localParticipant?.id;
    let participantId = data.participantId;
    let pinnedBy = data.pinnedBy;
    let state = data.state;

    const pinnedByDisplayName =
      mMeetingRef.current.participants.get(pinnedBy)?.displayName || "";
    const partcipantDisplayName =
      mMeetingRef.current.participants.get(participantId)?.displayName || "";

    if (
      showJoinNotificationRef.current &&
      notificationAlertsEnabled &&
      meetingModeRef.current === meetingModes.CONFERENCE
    ) {
      enqueueSnackbar(
        getPinMsg({
          localParticipant,
          participantId,
          pinnedBy,
          state,
          partcipantDisplayName,
          pinnedByDisplayName,
        })
      );
    }
  };

  const _handleOnError = (data) => {
    const { code, message } = data;

    const joiningErrCodes = [
      4001, 4002, 4003, 4004, 4005, 4006, 4007, 4008, 4009, 4010,
    ];

    const isJoiningError = joiningErrCodes.findIndex((c) => c === code) !== -1;
    const isCriticalError = `${code}`.startsWith("500");

    new Audio(
      isCriticalError
        ? `https://static.videosdk.live/prebuilt/notification_critical_err.mp3`
        : `https://static.videosdk.live/prebuilt/notification_err.mp3`
    ).play();

    setMeetingError({
      code,
      message: debug
        ? message
        : isJoiningError
        ? "Unable to join meeting!"
        : message,
    });
  };

  const mMeeting = useMeeting({
    onMeetingJoined: _handleOnMeetingJoined,
    onMeetingLeft: _handleMeetingLeft,
    onChatMessage: _handleChatMessage,
    onParticipantJoined: _handleParticipantJoined,
    onParticipantLeft: _handleParticipantLeft,
    onPresenterChanged: _handlePresenterChanged,
    onRecordingStarted: _handleOnRecordingStarted,
    onRecordingStopped: _handleOnRecordingStopped,
    onLiveStreamStarted: _handleOnLiveStreamStarted,
    onLiveStreamStopped: _handleOnLiveStreamStopped,
    onEntryRequested: _handleOnEntryRequested,
    onEntryResponded: _handleOnEntryResponded,
    onPinStateChanged: _handleOnPinStateChanged,
    onError: _handleOnError,
    onMeetingStateChanged,
    onRecordingStateChanged: _handleOnRecordingStateChanged,
    onLivestreamStateChanged: _handleOnLivestreamStateChanged,
    onHlsStateChanged: _handleOnHlsStateChanged,
    onHlsStarted: _handleOnHlsStarted,
    onHlsStopped: _handleOnHlsStopped,
  });

  const _handleToggleFullScreen = () => {
    try {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        const elem = containerRef.current;
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch((e) => {
            console.log(`request to full screen is rejected due to ${e}`);
          });
        } else if (document.documentElement.webkitRequestFullscreen) {
          /*  Safari */
          document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
          /*  IE11 */
          document.documentElement.msRequestFullscreen();
        }
      }
    } catch (error) {}
  };

  useEffect(() => {
    mMeetingRef.current = mMeeting;
  }, [mMeeting]);

  useEffect(() => {
    eventEmitter.on(appEvents["toggle-full-screen"], _handleToggleFullScreen);
    setTimeout(() => {
      showJoinNotificationRef.current = true;
    }, 3000);

    return () => {
      eventEmitter.off(
        appEvents["toggle-full-screen"],
        _handleToggleFullScreen
      );
    };
  }, []);

  const whiteboardToolbarWidth = canDrawOnWhiteboard ? 48 : 0;
  const whiteboardSpacing = canDrawOnWhiteboard ? 16 : 0;

  const theme = useTheme();

  return (
    <div
      ref={containerRef}
      style={{
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        backgroundColor:
          appTheme === appThemes.LIGHT
            ? theme.palette.lightTheme.main
            : appTheme === appThemes.DARK
            ? theme.palette.darkTheme.main
            : theme.palette.background.default,
      }}
    >
      <ConfirmBox
        open={meetingError}
        successText="OKAY"
        onSuccess={() => {
          setMeetingError(false);
        }}
        title={`Error Code: ${meetingError.code}`}
        subTitle={meetingError.message}
      />

      {typeof localParticipantAllowedJoin === "boolean" ? (
        localParticipantAllowedJoin ? (
          <>
            <ModeListner />
            <PollsListner />
            <PauseInvisibleParticipants />

            <div
              style={{
                display: "flex",
                flex: 1,
                flexDirection: isTab || isMobile ? "column-reverse" : "column",
              }}
            >
              {topbarEnabled && <TopBar {...{ topBarHeight }} />}
              <div
                style={{
                  display: "flex",
                  height: containerHeight - topBarHeight,
                  position: "relative",
                }}
              >
                {meetingMode === meetingModes.CONFERENCE ? (
                  <>
                    {mMeeting?.pinnedParticipants.size > 0 &&
                    (meetingLayout === meetingLayouts.SPOTLIGHT ||
                      meetingLayout === meetingLayouts.SIDEBAR) ? (
                      <PinnedLayoutViewContainer
                        {...{
                          height: containerHeight - topBarHeight,
                          width:
                            containerWidth -
                            (isTab || isMobile
                              ? 0
                              : typeof sideBarMode === "string"
                              ? sideBarContainerWidth
                              : 0),
                          whiteboardToolbarWidth,
                          whiteboardSpacing,
                        }}
                      />
                    ) : (
                      <MainViewContainer
                        {...{
                          height: containerHeight - topBarHeight,
                          width:
                            containerWidth -
                            (isTab || isMobile
                              ? 0
                              : typeof sideBarMode === "string"
                              ? sideBarContainerWidth
                              : 0),
                          whiteboardToolbarWidth,
                          whiteboardSpacing,
                        }}
                      />
                    )}
                    <ParticipantsAudioPlayer />
                    <MediaRequested />
                    <RequestedEntries />
                  </>
                ) : (
                  <>
                    <HLSContainer
                      {...{
                        width:
                          containerWidth -
                          (isTab || isMobile
                            ? 0
                            : typeof sideBarMode === "string"
                            ? sideBarContainerWidth
                            : 0),
                      }}
                    />
                  </>
                )}

                <SideViewContainer
                  {...{
                    topBarHeight,
                    width: sideBarContainerWidth,
                    height: containerHeight - topBarHeight,
                  }}
                />
              </div>
            </div>
          </>
        ) : (
          <ClickAnywhereToContinue title="Entry denied!" />
        )
      ) : askJoin ? (
        <ClickAnywhereToContinue title="Waiting to join..." />
      ) : !mMeeting.isMeetingJoined ? (
        isRecorder ? (
          <Box
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              height: "100vh",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor:
                appTheme === appThemes.DARK
                  ? theme.palette.darkTheme.slightLighter
                  : appTheme === appThemes.LIGHT
                  ? theme.palette.lightTheme.two
                  : theme.palette.background.default,
            }}
          >
            <RecordingLoader {...{ meetingLayout, appTheme }} />
          </Box>
        ) : (
          <WaitingToJoin />
        )
      ) : null}
    </div>
  );
};

export default MeetingContainer;
