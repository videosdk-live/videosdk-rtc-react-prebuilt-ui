import {
  Box,
  makeStyles,
  Popover,
  Typography,
  useTheme,
} from "@material-ui/core";
import { useMeeting, useParticipant } from "@videosdk.live/react-sdk";
import React, { useEffect, useRef, useMemo, useState } from "react";
import { MicOff } from "../../icons";
import { IconButton } from "@material-ui/core";
import { appThemes, useMeetingAppContext } from "../../MeetingAppContextDef";
import {
  invertColor,
  getRandomColor,
  eventEmitter,
  appEvents,
  nameTructed,
  getQualityScore,
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
import NetworkIcon from "../../icons/NetworkIcon";
import { CloseOutlined } from "@material-ui/icons";
import { useMediaQuery } from "react-responsive";

const useStyles = makeStyles({
  popoverHover: {
    "&:hover": {
      backgroundColor: "#CCD2D899",
    },
  },
  popoverHoverDark: {
    "&:hover": {
      backgroundColor: "#2B303499",
    },
  },
});

export const CornerDisplayName = ({
  participantId,
  isPresenting,
  displayName,
  isLocal,
  micOn,
  isActiveSpeaker,
  webcamOn,
  pinState,
  pin,
  unpin,
  mouseOver,
  isRecorder,
  isPortrait,
}) => {
  const theme = useTheme();

  const isMobile = useIsMobile();
  const isTab = useIsTab();
  const isLGDesktop = useIsLGDesktop();

  const [downArrow, setDownArrow] = useState(null);
  const handleClick = (event) => {
    setDownArrow(event.currentTarget);
  };

  const handleClose = () => {
    setDownArrow(null);
  };

  const {
    overlaidInfoVisible,
    canPin,
    animationsEnabled,
    alwaysShowOverlay,
    networkBarEnabled,
    appTheme,
  } = useMeetingAppContext();

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
      alwaysShowOverlay || mouseOver || isActiveSpeaker || overlaidInfoVisible,
    [alwaysShowOverlay, mouseOver, isActiveSpeaker, overlaidInfoVisible]
  );

  const isPinned = useMemo(() => pinState?.share || pinState?.cam, [pinState]);

  const showPin = useMemo(
    () => (alwaysShowOverlay ? isPinned : isPinned || mouseOver),
    [alwaysShowOverlay, isPinned, mouseOver]
  );

  const {
    webcamStream,
    micStream,
    getVideoStats,
    getAudioStats,
    getShareStats,
    screenShareStream,
  } = useParticipant(participantId);

  const statsIntervalIdRef = useRef();
  const [score, setScore] = useState({});
  const [audioStats, setAudioStats] = useState({});
  const [videoStats, setVideoStats] = useState({});

  const updateStats = async () => {
    let stats = [];
    let audioStats = [];
    let videoStats = [];
    if (isPresenting) {
      stats = await getShareStats();
    } else if (webcamStream) {
      stats = await getVideoStats();
    } else if (micStream) {
      stats = await getAudioStats();
    }

    if (webcamStream || micStream || isPresenting) {
      videoStats = isPresenting ? await getShareStats() : await getVideoStats();
      audioStats = isPresenting ? [] : await getAudioStats();
    }

    // setScore(stats?.score);
    let score = stats
      ? stats.length > 0
        ? getQualityScore(stats[0])
        : 100
      : 100;

    setScore(score);
    setAudioStats(audioStats);
    setVideoStats(videoStats);
  };

  const qualityStateArray = [
    { label: "", audio: "Audio", video: "Video" },
    {
      label: "Latency",
      audio:
        audioStats && audioStats[0]?.rtt ? `${audioStats[0]?.rtt} ms` : "-",
      video:
        videoStats && videoStats[0]?.rtt ? `${videoStats[0]?.rtt} ms` : "-",
    },
    {
      label: "Jitter",
      audio:
        audioStats && audioStats[0]?.jitter
          ? `${parseFloat(audioStats[0]?.jitter).toFixed(2)} ms`
          : "-",
      video:
        videoStats && videoStats[0]?.jitter
          ? `${parseFloat(videoStats[0]?.jitter).toFixed(2)} ms`
          : "-",
    },
    {
      label: "Packet Loss",
      audio: audioStats
        ? audioStats[0]?.packetsLost
          ? `${parseFloat(
              (audioStats[0]?.packetsLost * 100) / audioStats[0]?.totalPackets
            ).toFixed(2)}%`
          : "-"
        : "-",
      video: videoStats
        ? videoStats[0]?.packetsLost
          ? `${parseFloat(
              (videoStats[0]?.packetsLost * 100) / videoStats[0]?.totalPackets
            ).toFixed(2)}%`
          : "-"
        : "-",
    },
    {
      label: "Bitrate",
      audio:
        audioStats && audioStats[0]?.bitrate
          ? `${parseFloat(audioStats[0]?.bitrate).toFixed(2)} kb/s`
          : "-",
      video:
        videoStats && videoStats[0]?.bitrate
          ? `${parseFloat(videoStats[0]?.bitrate).toFixed(2)} kb/s`
          : "-",
    },
    {
      label: "Frame rate",
      audio: "-",
      video:
        videoStats &&
        (videoStats[0]?.size?.framerate === null ||
          videoStats[0]?.size?.framerate === undefined)
          ? "-"
          : `${videoStats ? videoStats[0]?.size?.framerate : "-"}`,
    },
    {
      label: "Resolution",
      audio: "-",
      video: videoStats
        ? videoStats && videoStats[0]?.size?.width === null
          ? "-"
          : `${videoStats[0]?.size?.width}x${videoStats[0]?.size?.height}`
        : "-",
    },
    {
      label: "Codec",
      audio: audioStats && audioStats[0]?.codec ? audioStats[0]?.codec : "-",
      video: videoStats && videoStats[0]?.codec ? videoStats[0]?.codec : "-",
    },
    {
      label: "Cur. Layers",
      audio: "-",
      video:
        videoStats && !isLocal
          ? videoStats && videoStats[0]?.currentSpatialLayer === null
            ? "-"
            : `S:${videoStats[0]?.currentSpatialLayer || 0} T:${
                videoStats[0]?.currentTemporalLayer || 0
              }`
          : "-",
    },
    {
      label: "Pref. Layers",
      audio: "-",
      video:
        videoStats && !isLocal
          ? videoStats && videoStats[0]?.preferredSpatialLayer === null
            ? "-"
            : `S:${videoStats[0]?.preferredSpatialLayer || 0} T:${
                videoStats[0]?.preferredTemporalLayer || 0
              }`
          : "-",
    },
  ];

  useEffect(() => {
    if (networkBarEnabled) {
      if (webcamStream || micStream || screenShareStream) {
        updateStats();

        if (statsIntervalIdRef.current) {
          clearInterval(statsIntervalIdRef.current);
        }

        statsIntervalIdRef.current = setInterval(updateStats, 500);
      } else {
        if (statsIntervalIdRef.current) {
          clearInterval(statsIntervalIdRef.current);
          statsIntervalIdRef.current = null;
        }
      }

      return () => {
        if (statsIntervalIdRef.current)
          clearInterval(statsIntervalIdRef.current);
      };
    }
  }, [webcamStream, micStream, screenShareStream, networkBarEnabled]);

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
          backgroundColor:
            appTheme === appThemes.LIGHT
              ? theme.palette.lightTheme.three
              : "#00000066",
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: `all ${200 * (animationsEnabled ? 1 : 0.5)}ms`,
          transitionTimingFunction: "linear",
        }}
      >
        <Typography
          variant={isLGDesktop ? "subtitle1" : "subtitle2"}
          style={{
            justifyContent: "center",
            fontSize: isRecorder ? (isMobile && isPortrait ? 24 : 12) : null,
            display: "flex",
            alignItems: "center",
            // lineHeight: 1,
            color:
              appTheme === appThemes.LIGHT &&
              theme.palette.lightTheme.contrastText,
          }}
        >
          {isPresenting
            ? isLocal
              ? `You are presenting`
              : `${nameTructed(displayName, 15)} is presenting`
            : isLocal
            ? "You"
            : nameTructed(displayName, 26)}
        </Typography>
        {(!micOn || isActiveSpeaker) && !isPresenting && (
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            style={
              isRecorder
                ? null
                : {
                    padding: isActiveSpeaker ? 0 : isMobile ? 2 : isTab ? 3 : 1,
                    backgroundColor: isActiveSpeaker ? "" : "#D32F2Fcc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 24,
                    marginLeft: 6,
                  }
            }
          >
            {isActiveSpeaker ? (
              <Lottie
                options={defaultOptions}
                eventListeners={[{ eventName: "done" }]}
                height={(analyzerSize * 2) / 3}
                width={(analyzerSize * 2) / 2}
                isClickToPauseDisabled
              />
            ) : (
              !isRecorder &&
              !micOn && (
                <MicOff
                  style={{
                    color: theme.palette.common.white,
                    height: isRecorder
                      ? isMobile && isPortrait
                        ? ((analyzerSize * 2) / 3) * 2
                        : (analyzerSize * 2) / 3
                      : (analyzerSize * 2) / 3,
                    width: isRecorder
                      ? isMobile && isPortrait
                        ? ((analyzerSize * 2) / 3) * 2
                        : (analyzerSize * 2) / 3
                      : (analyzerSize * 2) / 3,
                  }}
                />
              )
            )}
          </div>
        )}
      </div>
      {canPin && !isRecorder && (
        <div
          className="pinClass"
          style={{
            position: "absolute",
            right: showPin ? (isMobile ? 4 : isTab ? 8 : 12) : -42,
            bottom: showPin ? (isMobile ? 4 : isTab ? 8 : 12) : -32,
            transform: `scale(${showPin ? 1 : 0})`,
            transition: `all ${200 * (animationsEnabled ? 1 : 0.5)}ms`,
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
      {!isRecorder &&
        (webcamStream || micStream || screenShareStream) &&
        networkBarEnabled && (
          <Box>
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleClick(e);
              }}
              style={{
                position: "absolute",
                top: show ? (isMobile ? 4 : isTab ? 8 : 12) : -32,
                right: show ? (isMobile ? 4 : isTab ? 8 : 12) : -42,
                transform: `scale(${show ? 1 : 0})`,
                transition: `all ${200 * (animationsEnabled ? 1 : 0.5)}ms`,
                transitionTimingFunction: "linear",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: isMobile ? 3 : isTab ? 4 : 5,
                backgroundColor:
                  score > 7 ? "#3BA55D" : score > 4 ? "#faa713" : "#FF5D5D",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              <NetworkIcon
                color1={"#ffffff"}
                color2={"#ffffff"}
                color3={"#ffffff"}
                color4={"#ffffff"}
                style={{
                  height: analyzerSize * 0.6,
                  width: analyzerSize * 0.6,
                }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                top: show ? (isMobile ? 4 : isTab ? 8 : 12) : -32,
                right: show ? (isMobile ? 4 : isTab ? 8 : 12) : -42,
              }}
            >
              <Popover
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                anchorEl={downArrow}
                open={Boolean(downArrow)}
                onClose={(e) => {
                  e.stopPropagation();
                  handleClose();
                }}
              >
                <Box>
                  <Box
                    style={{
                      padding: 9,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      backgroundColor:
                        score > 7
                          ? "#3BA55D"
                          : score > 4
                          ? "#faa713"
                          : "#FF5D5D",
                    }}
                  >
                    <Typography
                      variant="body2"
                      style={{ fontWeight: 600 }}
                    >{`Quality Score : ${
                      score > 7 ? "Good" : score > 4 ? "Average" : "Poor"
                    }`}</Typography>

                    <IconButton
                      size="small"
                      style={{ cursor: "pointer" }}
                      onClick={handleClose}
                    >
                      <CloseOutlined style={{ height: 16, width: 16 }} />
                    </IconButton>
                  </Box>
                  <Box style={{ display: "flex" }}>
                    <Box style={{ display: "flex", flexDirection: "column" }}>
                      {qualityStateArray.map((item, index) => {
                        return (
                          <Box
                            style={{
                              display: "flex",
                              borderBottom:
                                index === qualityStateArray.length - 1
                                  ? ""
                                  : `1px solid ${
                                      appTheme === appThemes.LIGHT
                                        ? theme.palette.lightTheme.outlineColor
                                        : "#ffffff33"
                                    }`,
                            }}
                          >
                            <Box
                              style={{
                                display: "flex",
                                flex: 1,
                                width: 120,
                                alignItems: "center",
                              }}
                            >
                              {index !== 0 && (
                                <Typography
                                  style={{
                                    fontSize:
                                      isRecorder && isPortrait ? 24 : 12,
                                    marginTop: 6,
                                    marginBottom: 6,
                                    marginLeft: 8,
                                  }}
                                >
                                  {item.label}
                                </Typography>
                              )}
                            </Box>
                            <Box
                              style={{
                                display: "flex",
                                flex: 1,
                                alignItems: "center",
                                justifyContent: "center",
                                borderLeft: `1px solid ${
                                  appTheme === appThemes.LIGHT
                                    ? theme.palette.lightTheme.outlineColor
                                    : "#ffffff33"
                                }`,
                              }}
                            >
                              <Typography
                                style={{
                                  fontSize: isRecorder && isPortrait ? 24 : 12,
                                  marginTop: 6,
                                  marginBottom: 6,
                                  width: 65,
                                  textAlign: "center",
                                }}
                              >
                                {item.audio}
                              </Typography>
                            </Box>
                            <Box
                              style={{
                                display: "flex",
                                flex: 1,
                                alignItems: "center",
                                justifyContent: "center",
                                borderLeft: `1px solid ${
                                  appTheme === appThemes.LIGHT
                                    ? theme.palette.lightTheme.outlineColor
                                    : "#ffffff33"
                                }`,
                              }}
                            >
                              <Typography
                                style={{
                                  fontSize: isRecorder && isPortrait ? 24 : 12,
                                  marginTop: 6,
                                  marginBottom: 6,
                                  width: 65,
                                  textAlign: "center",
                                }}
                              >
                                {item.video}
                              </Typography>
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                </Box>
              </Popover>
            </div>
          </Box>
        )}
    </>
  );
};

const ParticipantViewer = ({ participantId, quality, useVisibilitySensor }) => {
  const videoPlayer = useRef();
  const [videoDivWrapperRef, setVideoDivWrapperRef] = useState(null);
  const [mouseOver, setMouseOver] = useState(false);
  const [portrait, setPortrait] = useState(false);

  const mMeeting = useMeeting();

  const presenterId = mMeeting?.presenterId;

  const {
    setOverlaidInfoVisible,
    whiteboardStarted,
    animationsEnabled,
    isRecorder,
    maintainVideoAspectRatio,
    maintainLandscapeVideoAspectRatio,
    appTheme,
    isMirrorViewChecked,
  } = useMeetingAppContext();

  const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });

  const onStreamEnabled = (stream) => {
    // console.log(participantId, stream.kind, " Stream started ");
  };

  const onStreamDisabled = (stream) => {
    // console.log(participantId, stream.kind, " Stream stopped ");
  };

  const {
    displayName,
    setQuality,
    setViewPort,
    webcamStream,
    webcamOn,
    micOn,
    isLocal,
    isActiveSpeaker,
    pinState,
    pin,
    unpin,
  } = useParticipant(participantId, {
    onStreamDisabled,
    onStreamEnabled,
  });

  const mediaStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);

  const participantAccentColor = useMemo(
    () => getRandomColor(appTheme === appThemes.LIGHT ? "dark" : "light"),
    []
  );

  const theme = useTheme();

  useEffect(() => {
    if (!quality || isRecorder) return;

    setQuality(quality);
  }, [quality, setQuality, isRecorder]);

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

  // useEffect(() => {
  //   if (!presenterId) {
  //     typeof webcamStream?.resume === "function" && webcamStream?.resume();
  //   }
  // }, [presenterId, webcamOn, webcamStream]);

  useEffect(() => {
    if (isRecorder) {
      setQuality("high");
    }
  }, [isRecorder]);

  useEffect(() => {
    if (
      videoDivWrapperRef?.offsetWidth &&
      videoDivWrapperRef?.offsetHeight &&
      !isRecorder &&
      !isLocal &&
      webcamStream
    ) {
      // setViewPort(
      //   videoDivWrapperRef?.offsetWidth,
      //   videoDivWrapperRef?.offsetHeight
      // );
    }
  }, [isRecorder, isLocal, videoDivWrapperRef, webcamStream]);

  useEffect(() => {
    eventEmitter.emit(appEvents["participant-visible"], {
      participantId,
    });

    return () => {
      eventEmitter.emit(appEvents["participant-invisible"], {
        participantId,
      });
    };
  }, []);

  const checkAndUpdatePortrait = () => {
    if (webcamStream && maintainVideoAspectRatio) {
      const { height, width } = webcamStream.track.getSettings();
      if (height > width && !portrait) {
        setPortrait(true);
      } else if (height < width && portrait) {
        setPortrait(false);
      }
    } else {
      setPortrait(false);
    }
  };

  return (
    <VisibilitySensor
      active
      // active={!!useVisibilitySensor}
      onChange={(isVisible) => {
        if (isVisible) {
          eventEmitter.emit(appEvents["participant-visible"], {
            participantId,
          });
        } else {
          eventEmitter.emit(appEvents["participant-invisible"], {
            participantId,
          });
        }
        //
        // if (useVisibilitySensor) {
        //   if (isVisible) {
        //     typeof webcamStream?.resume === "function" &&
        //       webcamStream?.resume();
        //   } else {
        //     typeof webcamStream?.pause === "function" && webcamStream?.pause();
        //   }
        // } else {
        //   typeof webcamStream?.resume === "function" && webcamStream?.resume();
        // }
      }}
    >
      <div
        ref={setVideoDivWrapperRef}
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
          backgroundColor:
            appTheme === appThemes.DARK
              ? theme.palette.darkTheme.slightLighter
              : appTheme === appThemes.LIGHT
              ? theme.palette.lightTheme.two
              : theme.palette.background.paper,
          position: "relative",
          overflow: "hidden",
          borderRadius: isRecorder ? null : theme.spacing(1),
        }}
        className={`${
          maintainLandscapeVideoAspectRatio && !portrait
            ? "video-contain"
            : portrait
            ? ""
            : "video-cover"
        }`}
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
              style={!isMirrorViewChecked && flipStyle}
              onError={(err) => {
                console.log(err, "participant video error");
              }}
              onProgress={() => {
                checkAndUpdatePortrait();
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
                  isClickToPauseDisabled
                />
              </div>
            )}

            <Box
              style={{
                zIndex: 10,
                height: dpSize / (presenterId || whiteboardStarted ? 2 : 1),
                width: dpSize / (presenterId || whiteboardStarted ? 2 : 1),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 100,
                backgroundColor: participantAccentColor,
                transition: animationsEnabled
                  ? "height 800ms, width 800ms"
                  : undefined,
                transitionTimingFunction: "ease-in-out",
              }}
            >
              <Typography
                variant={presenterId || whiteboardStarted ? "body2" : "h5"}
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
            isRecorder,
            isPortrait,
          }}
        />
      </div>
    </VisibilitySensor>
  );
};

export default ParticipantViewer;
