import React, { useEffect, useRef, useState } from "react";
import MainViewContainer from "./mainViewContainer/MainViewContainer";
import SideViewContainer from "./sideViewContainer/SideViewContainer";
import TopBar from "./TopBar";
import { meetingLayouts, useMeetingAppContext } from "../MeetingAppContextDef";
import useSortActiveParticipants from "./useSortActiveParticipants";
import { useMeeting } from "@videosdk.live/react-sdk";
import useIsTab from "../utils/useIsTab";
import useIsMobile from "../utils/useIsMobile";
import {
  appEvents,
  eventEmitter,
  json_verify,
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

  // if (!pinnedByDisplayName) {
  //   return `${partcipantDisplayName} was ${pinStateText}`;
  // } else
  if (pinnedSelf && localParticipantWasPinned && localParticipantPinned) {
    return `You ${pinStateText} yourself`;
  } else if (pinnedSelf && !localParticipantWasPinned) {
    return `${partcipantDisplayName}  was ${pinStateText}`;
  } else if (!localParticipantWasPinned && !localParticipantPinned) {
    return `${partcipantDisplayName} was ${pinStateText} by ${pinnedByDisplayName}`;
  } else if (localParticipantWasPinned && !localParticipantPinned) {
    return `You were ${pinStateText} by ${pinnedByDisplayName}`;
  } else if (!localParticipantWasPinned && localParticipantPinned) {
    return ` You ${pinStateText} ${partcipantDisplayName}`;
  } else if (!pinnedBy) {
    if (localParticipantWasPinned) {
      return `You were ${pinStateText}`;
    } else {
      return `${partcipantDisplayName} was ${pinStateText}`;
    }
  }
};

const MeetingContainer = () => {
  const showJoinNotificationRef = useRef(false);
  const localParticipantAutoPinnedOnShare = useRef(false);

  const mMeetingRef = useRef();

  const [containerHeight, setContainerHeight] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [localParticipantAllowedJoin, setLocalParticipantAllowedJoin] =
    useState(null);
  const { enqueueSnackbar } = useSnackbar();

  useSortActiveParticipants();
  const { participantRaisedHand } = useRaisedHandParticipants();

  const topBarHeight = 60;

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

  const {
    redirectOnLeave,
    sideBarMode,
    containerRef,
    participantCanToggleRecording,
    autoStartLiveStream,
    liveStreamOutputs,
    askJoin,
    notificationSoundEnabled,
    meetingLayout,
  } = useMeetingAppContext();

  const isTab = useIsTab();
  const isMobile = useIsMobile();

  const _handleOnMeetingJoined = () => {
    // if (liveStreamEnabled && autoStartLiveStream) {

    if (autoStartLiveStream && liveStreamOutputs?.length) {
      const { startLivestream } = mMeetingRef.current;

      startLivestream(liveStreamOutputs);
    }
    // const meeting = mMeetingRef.current;
    // window.top.postMessage("OnMeetingJoined", "*", [meeting]);
  };

  const _handleMeetingLeft = () => {
    window.parent.location = redirectOnLeave;
  };

  const _handleChatMessage = (data) => {
    const localParticipantId = mMeetingRef.current?.localParticipant?.id;

    const { senderId, senderName, text } = data;

    const isLocal = senderId === localParticipantId;

    if (json_verify(text)) {
      const { type } = JSON.parse(text);
      if (type === "CHAT") {
        const { data: messageData } = JSON.parse(text);
        if (!isLocal) {
          if (notificationSoundEnabled) {
            new Audio(
              `https://static.zujonow.com/prebuilt/notification.mp3`
            ).play();
          }
          enqueueSnackbar(
            trimSnackBarText(`${senderName} says: ${messageData.message}`)
          );
        }
      }

      if (type === "RAISE_HAND") {
        if (notificationSoundEnabled) {
          new Audio(
            `https://static.zujonow.com/prebuilt/notification.mp3`
          ).play();
        }
        enqueueSnackbar(`${isLocal ? "You" : senderName} raised hand 🖐🏼`);
        participantRaisedHand(senderId);
      }
    }
  };

  const _handleParticipantJoined = (data) => {
    // if (showJoinNotificationRef.current) {
    //   const { displayName } = data;
    //   new Audio(`https://static.zujonow.com/prebuilt/notification.mp3`).play();
    //   enqueueSnackbar(`${displayName} joined the meeting`, {});
    // }
  };

  const _handleParticipantLeft = (data) => {
    // const { displayName } = data;
    // new Audio(`https://static.zujonow.com/prebuilt/notification.mp3`).play();
    // enqueueSnackbar(`${displayName} left the meeting`, {});
  };

  const _handlePresenterChanged = (presenterId) => {
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

      new Audio(`https://static.zujonow.com/prebuilt/notification.mp3`).play();
      enqueueSnackbar(
        `${isLocal ? "You" : mPresenter.displayName} started presenting`
      );
    }
  };

  const _handleOnRecordingStarted = () => {
    if (participantCanToggleRecording) {
      enqueueSnackbar("Meeting recording is started.");
    }
  };

  const _handleOnRecordingStopped = () => {
    if (participantCanToggleRecording) {
      enqueueSnackbar("Meeting recording stopped.");
    }
  };

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

    if (showJoinNotificationRef.current) {
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

  const mMeeting = useMeeting({
    onMeetingJoined: _handleOnMeetingJoined,
    onMeetingLeft: _handleMeetingLeft,
    onChatMessage: _handleChatMessage,
    onParticipantJoined: _handleParticipantJoined,
    onParticipantLeft: _handleParticipantLeft,
    onPresenterChanged: _handlePresenterChanged,
    onRecordingStarted: _handleOnRecordingStarted,
    onRecordingStopped: _handleOnRecordingStopped,
    onEntryRequested: _handleOnEntryRequested,
    onEntryResponded: _handleOnEntryResponded,
    onPinStateChanged: _handleOnPinStateChanged,
  });

  const _handleToggleFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      const elem = containerRef.current;
      if (elem) {
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
          /* Safari */
          elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
          /* IE11 */
          elem.msRequestFullscreen();
        }
      }
    }
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

  return (
    <div
      ref={containerRef}
      style={{
        height: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {typeof localParticipantAllowedJoin === "boolean" ? (
        localParticipantAllowedJoin ? (
          <>
            <ParticipantsAudioPlayer />
            <div
              style={{
                display: "flex",
                flex: 1,
                flexDirection: isTab || isMobile ? "column-reverse" : "column",
              }}
            >
              <TopBar {...{ topBarHeight }} />
              <div
                style={{
                  display: "flex",
                  height: containerHeight - topBarHeight,
                }}
              >
                {mMeeting?.pinnedParticipants.size > 0 &&
                meetingLayout !== meetingLayouts.GRID ? (
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
                    }}
                  />
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
            <MediaRequested />
            <RequestedEntries />
          </>
        ) : (
          <ClickAnywhereToContinue title="Entry denied!" />
        )
      ) : askJoin ? (
        <ClickAnywhereToContinue title="Waiting to join..." />
      ) : null}
    </div>
  );
};

export default MeetingContainer;
