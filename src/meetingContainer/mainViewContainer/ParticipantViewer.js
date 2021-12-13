import { Box, Typography, useTheme } from "@material-ui/core";
import { useMeeting, useParticipant } from "@videosdk.live/react-sdk";
import React, { useEffect, useRef, useMemo, useState } from "react";
import { MicOff } from "../../icons";
import { IconButton } from "@material-ui/core";
import { useMeetingAppContext } from "../../MeetingAppContextDef";
import {
  invertColor,
  getRandomColor,
  eventEmitter,
  appEvents,
} from "../../utils/common";
import useIsMobile from "../../utils/useIsMobile";
import useIsTab from "../../utils/useIsTab";
import VisibilitySensor from "react-visibility-sensor";
import useResponsiveSize from "../../utils/useResponsiveSize";
import Lottie from "react-lottie";
import animationData from "../../animations/equaliser.json";
import circleRipple from "../../animations/circleRipple.json";
import { Pin } from "../../icons";
import useIsLGDesktop from "../../utils/useIsLGDesktop";
import ReactPlayer from "react-player";

export const CornerDisplayName = ({
  isPresenting,
  displayName,
  isLocal,
  micOn,
  isActiveSpeaker,
  webcamOn,
  pinState,
  pin,
  unpin,
  participantId,
  mouseOver,
}) => {
  const theme = useTheme();

  const isMobile = useIsMobile();
  const isTab = useIsTab();
  const isLGDesktop = useIsLGDesktop();

  const { overlaidInfoVisible, canPin } = useMeetingAppContext();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const analyzerSize = useResponsiveSize({
    xl: 32,
    lg: 28,
    md: 24,
    sm: 20,
    xs: 18,
  });

  const show = useMemo(
    () =>
      mouseOver
        ? true
        : isActiveSpeaker
        ? true
        : overlaidInfoVisible
        ? true
        : false,
    [isActiveSpeaker, overlaidInfoVisible, mouseOver]
  );

  const isPinned = useMemo(() => pinState?.share || pinState?.cam, [pinState]);

  const showPin = useMemo(
    () =>
      isMobile || isTab ? show : isPinned ? true : mouseOver ? true : false,
    [mouseOver, isMobile, isTab, isPinned]
  );

  return (
    <>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        style={{
          position: "absolute",
          bottom: show ? (isMobile ? 4 : isTab ? 8 : 12) : -32,
          left: show ? (isMobile ? 4 : isTab ? 8 : 12) : -42,
          opacity: show ? 1 : 0,
          paddingTop: isMobile ? 2 : isTab ? 3 : 4,
          paddingBottom: isMobile ? 2 : isTab ? 3 : 4,
          paddingLeft: isMobile ? 4 : isTab ? 6 : 8,
          paddingRight: isMobile ? 4 : isTab ? 6 : 8,
          transform: `scale(${show ? 1 : 0})`,
          backgroundColor: "#00000066",
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 200ms",
          transitionTimingFunction: "linear",
        }}
      >
        <Typography variant={isLGDesktop ? "subtitle1" : "subtitle2"}>
          {isPresenting
            ? isLocal
              ? `You are presenting`
              : `${displayName} is presenting`
            : isLocal
            ? "You"
            : displayName}
        </Typography>
      </div>
      {canPin && (
        <div
          className="pinClass"
          style={{
            position: "absolute",
            right: showPin ? (isMobile ? 4 : isTab ? 8 : 12) : -42,
            bottom: showPin ? (isMobile ? 4 : isTab ? 8 : 12) : -32,
            transform: `scale(${showPin ? 1 : 0})`,
            transition: "all 200ms",
            transitionTimingFunction: "linear",
          }}
        >
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              isPinned ? unpin() : pin();
            }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: isMobile ? 3 : isTab ? 4 : 5,
              backgroundColor: isPinned ? "white" : "#0000004d",
            }}
          >
            <Pin
              fill={isPinned ? "#000" : "#ffffffb3"}
              style={{
                height: analyzerSize * 0.6,
                width: analyzerSize * 0.6,
              }}
            />
          </IconButton>
        </div>
      )}
      {(!micOn || (webcamOn && isActiveSpeaker)) && (
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          style={{
            position: "absolute",
            top: show ? (isMobile ? 4 : isTab ? 8 : 12) : -32,
            right: show ? (isMobile ? 4 : isTab ? 8 : 12) : -42,
            transform: `scale(${show ? 1 : 0})`,

            padding: isMobile ? 2 : isTab ? 3 : 4,
            backgroundColor: isActiveSpeaker
              ? "#00000066"
              : micOn
              ? undefined
              : "#D32F2Fcc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 24,
            transition: "all 200ms",
            transitionTimingFunction: "linear",
          }}
        >
          {webcamOn && isActiveSpeaker ? (
            <Lottie
              options={defaultOptions}
              eventListeners={[{ eventName: "done" }]}
              height={analyzerSize}
              width={analyzerSize}
            />
          ) : micOn ? null : (
            <MicOff
              style={{
                color: theme.palette.common.white,
                height: (analyzerSize * 2) / 3,
                width: (analyzerSize * 2) / 3,
              }}
            />
          )}
        </div>
      )}
    </>
  );
};

const ParticipantViewer = ({ participantId, quality, useVisibilitySensor }) => {
  const videoPlayer = useRef();
  const [mouseOver, setMouseOver] = useState(false);

  const mMeeting = useMeeting();

  const presenterId = mMeeting?.presenterId;

  const { setOverlaidInfoVisible, whiteboardStarted } = useMeetingAppContext();

  // const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });

  const {
    displayName,
    setQuality,
    webcamStream,
    webcamOn,
    micOn,
    isLocal,
    isActiveSpeaker,
    pinState,
    pin,
    unpin,
  } = useParticipant(participantId, {});

  const mediaStream = useMemo(() => {
    if (webcamOn) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);

  // useEffect(() => {
  //   if (videoPlayer.current) {
  //     if (webcamOn) {
  //       const mediaStream = new MediaStream();
  //       mediaStream.addTrack(webcamStream.track);

  //       videoPlayer.current.srcObject = mediaStream;
  //       videoPlayer.current.play().catch((err) => {
  //         if (
  //           err.message ===
  //           "play() failed because the user didn't interact with the document first. https://goo.gl/xX8pDD"
  //         ) {
  //           console.error("wecam" + err.message);
  //         }
  //       });
  //     } else {
  //       videoPlayer.current.srcObject = null;
  //     }
  //   }
  // }, [webcamStream, webcamOn, isPortrait]);

  const participantAccentColor = useMemo(() => getRandomColor("light"), []);

  const theme = useTheme();

  useEffect(() => {
    if (!quality) return;
    setQuality(quality);
  }, [quality, setQuality]);

  // useEffect(() => {
  //   typeof webcamStream?.resume === "function" && webcamStream?.resume();
  //   return () => {
  //     typeof webcamStream?.pause === "function" && webcamStream?.pause();
  //   };
  // }, [webcamStream]);

  const dpSize = useResponsiveSize({
    xl: 92,
    lg: 52,
    md: 52,
    sm: 52,
    xs: 52,
  });

  const flipStyle = useMemo(
    () =>
      isLocal ? { transform: "scaleX(-1)", WebkitTransform: "scaleX(-1)" } : {},
    [isLocal]
  );

  const defaultRippleOptions = {
    loop: true,
    autoplay: true,
    animationData: circleRipple,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    if (!presenterId) {
      typeof webcamStream?.resume === "function" && webcamStream?.resume();
    }
  }, [presenterId, webcamOn, webcamStream]);

  return (
    <VisibilitySensor
      active={!!useVisibilitySensor}
      onChange={(isVisible) => {
        if (useVisibilitySensor) {
          if (isVisible) {
            typeof webcamStream?.resume === "function" &&
              webcamStream?.resume();
          } else {
            typeof webcamStream?.pause === "function" && webcamStream?.pause();
          }
        } else {
          typeof webcamStream?.resume === "function" && webcamStream?.resume();
        }
      }}
    >
      <div
        onMouseEnter={() => {
          setMouseOver(true);
        }}
        onMouseLeave={() => {
          setMouseOver(false);
        }}
        onDoubleClick={() => {
          eventEmitter.emit(appEvents["toggle-full-screen"]);
        }}
        onClick={() => {
          setOverlaidInfoVisible((s) => !s);
        }}
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: theme.palette.background.paper,
          position: "relative",
          overflow: "hidden",
          borderRadius: theme.spacing(1),
        }}
        className={"video-cover"}
      >
        {webcamOn ? (
          <>
            <ReactPlayer
              ref={videoPlayer}
              //
              playsinline // very very imp prop
              playIcon={<></>}
              //
              pip={false}
              light={false}
              controls={false}
              muted={true}
              playing={true}
              //
              url={mediaStream}
              //
              height={"100%"}
              width={"100%"}
              style={flipStyle}
              onError={(err) => {
                console.log(err, "participant video error");
              }}
            />
          </>
        ) : (
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isActiveSpeaker && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  right: 0,
                  left: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Lottie
                  options={defaultRippleOptions}
                  eventListeners={[{ eventName: "done" }]}
                  height={
                    (dpSize / (presenterId || whiteboardStarted ? 2 : 1)) * 2
                  }
                  width={
                    (dpSize / (presenterId || whiteboardStarted ? 2 : 1)) * 2
                  }
                />
              </div>
            )}

            <Box
              style={{
                zIndex: 10,
                // aspectRatio: 1,
                height: dpSize / (presenterId || whiteboardStarted ? 2 : 1),
                width: dpSize / (presenterId || whiteboardStarted ? 2 : 1),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 100,
                backgroundColor: participantAccentColor,
                transition: "height 800ms, width 800ms",
                transitionTimingFunction: "ease-in-out",
              }}
            >
              <Typography
                variant="h5"
                style={{ color: invertColor(participantAccentColor) }}
              >
                {String(displayName).charAt(0).toUpperCase()}
              </Typography>
            </Box>
          </div>
        )}

        <CornerDisplayName
          {...{
            isLocal,
            displayName,
            micOn,
            webcamOn,
            isPresenting: false,
            isActiveSpeaker,
            pin,
            unpin,
            pinState,
            participantId,
            mouseOver,
          }}
        />
      </div>
    </VisibilitySensor>
  );
};

export default ParticipantViewer;
