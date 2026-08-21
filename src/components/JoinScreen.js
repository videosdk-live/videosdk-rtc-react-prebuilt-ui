import { useEffect, useRef, useState } from "react";
import { Box, Button, Grid, Tooltip, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/system";
import { Videocam, Mic, MicOff, VideocamOff } from "@mui/icons-material";
import { red } from "@mui/material/colors";
import useResponsiveSize from "../utils/useResponsiveSize";
import ConfirmBox from "../components/ConfirmBox";
import MeetingDetailModal from "./joinScreen/MeetingDetailModal";
import useWindowSize from "../utils/useWindowSize";
import { appThemes } from "../MeetingAppContextDef";
import { Constants, useMediaDevice } from "@videosdk.live/react-sdk";
import useMediaStream from "../utils/useMediaStream";
import DropDown from "./DropDown";
import DropDownSpeaker from "./DropDownSpeaker";
import DropDownCam from "./DropDownCam";
import useIsMobile from "../utils/useIsMobile";
import { CameraPermissionDenied, MicPermissionDenied } from "../icons";
import RunPrecallTest from "./RunPrecallTest";

export const DotsBoxContainer = ({ type }) => {
  const theme = useTheme();
  const gtThenMD = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Box
      style={{
        position: "absolute",
        top: type === "top-left" ? 0 : undefined,
        left: type === "top-left" ? 0 : undefined,
        bottom: type === "bottom-right" ? 0 : undefined,
        right: type === "bottom-right" ? 0 : undefined,
        height: theme.spacing(4 * (gtThenMD ? 3 : 2)),
        width: theme.spacing(4 * (gtThenMD ? 3 : 2)),
        transform:
          type === "top-left" ? "translate(-85%,-45%)" : "translate(85%,45%)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {[0, 1, 2, 3].map((i) => {
        return (
          <Box
            key={`dots_i_${i}`}
            style={{
              display: "flex",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {[0, 1, 2, 3].map((j) => {
              return (
                <Box
                  key={`dots_j_${j}`}
                  style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Box
                    style={{
                      height: gtThenMD ? 6 : 4,
                      width: gtThenMD ? 6 : 4,
                      borderRadius: gtThenMD ? 6 : 4,
                      backgroundColor: "gray",
                    }}
                  ></Box>
                </Box>
              );
            })}
          </Box>
        );
      })}
    </Box>
  );
};

export default function JoinMeeting({
  onClick,
  name,
  setName,
  meetingUrl,
  meetingTitle,
  participantCanToggleSelfWebcam,
  participantCanToggleSelfMic,
  micEnabled,
  webcamEnabled,
  selectedMic,
  selectedWebcam,
  selectedSpeaker,
  setSelectedMic,
  setSelectedWebcam,
  setSelectedSpeaker,
  customAudioStream,
  setCustomAudioStream,
  customVideoStream,
  setCustomVideoStream,
  appTheme,
  cameraId,
  cameraResolution,
  cameraOptimizationMode,
  cameraMultiStream,
  cameraBitrateMode,
  cameraMaxLayer,
  cameraCodec,
  micQuality,
  micNoiseConfig,
  token,
}) {
  const theme = useTheme();

  const [nameErr, setNameErr] = useState(false);
  const isMobile = useIsMobile();
  const isSmallScreen = useIsMobile(900);
  const [webcamOn, setWebcamOn] = useState(webcamEnabled ? true : false);
  const [micOn, setMicOn] = useState(micEnabled ? true : false);
  const [isCameraPermissionAllowed, setIsCameraPermissionAllowed] =
    useState(false);
  const [isMicrophonePermissionAllowed, setIsMicrophonePermissionAllowed] =
    useState(false);
  const [didDeviceChange, setDidDeviceChange] = useState(false);
  const [testSpeaker, setTestSpeaker] = useState(false);
  const [dlgMuted, setDlgMuted] = useState(false);
  const [dlgDevices, setDlgDevices] = useState(false);
  const [{ webcams, mics, speakers }, setDevices] = useState({
    devices: [],
    webcams: [],
    mics: [],
    speakers: [],
  });
  const [boxHeight, setBoxHeight] = useState(0);
  const [videoTrack, setVideoTrack] = useState(null);
  const [audioTrack, setAudioTrack] = useState(null);
  const videoPlayerRef = useRef();
  const audioPlayerRef = useRef();
  const webcamRef = useRef();
  const micRef = useRef();
  const videoTrackRef = useRef();
  const audioTrackRef = useRef();
  const permissonAvaialble = useRef();
  useEffect(() => {
    webcamRef.current = webcamOn;
  }, [webcamOn]);

  useEffect(() => {
    micRef.current = micOn;
  }, [micOn]);

  useEffect(() => {
    permissonAvaialble.current = {
      isCameraPermissionAllowed,
      isMicrophonePermissionAllowed,
    };
  }, [isCameraPermissionAllowed, isMicrophonePermissionAllowed]);

  useEffect(() => {
    if (micOn && micEnabled) {
      // Close the existing audio track if there's a new one
      if (audioTrackRef.current && audioTrackRef.current !== audioTrack) {
        audioTrackRef.current.stop();
      }

      audioTrackRef.current = audioTrack;
      startMuteListener();

      if (audioTrack) {
        const audioSrcObject = new MediaStream([audioTrack]);
        if (audioPlayerRef.current) {
          audioPlayerRef.current.srcObject = audioSrcObject;
          audioPlayerRef.current
            .play()
            .catch((error) => console.log("audio play error", error));
        }
      } else {
        if (audioPlayerRef.current) {
          audioPlayerRef.current.srcObject = null;
        }
      }
    }
  }, [micOn, audioTrack]);

  useEffect(() => {
    if (webcamOn && webcamEnabled) {
      // Close the existing video track if there's a new one
      if (videoTrackRef.current && videoTrackRef.current !== videoTrack) {
        videoTrackRef.current.stop(); // Stop the existing video track
      }

      videoTrackRef.current = videoTrack;

      var isPlaying =
        videoPlayerRef.current.currentTime > 0 &&
        !videoPlayerRef.current.paused &&
        !videoPlayerRef.current.ended &&
        videoPlayerRef.current.readyState >
          videoPlayerRef.current.HAVE_CURRENT_DATA;

      if (videoTrack) {
        const videoSrcObject = new MediaStream([videoTrack]);

        if (videoPlayerRef.current) {
          videoPlayerRef.current.srcObject = videoSrcObject;
          if (videoPlayerRef.current.pause && !isPlaying) {
            videoPlayerRef.current
              .play()
              .catch((error) => console.log("error", error));
          }
        }
      } else {
        if (videoPlayerRef.current) {
          videoPlayerRef.current.srcObject = null;
        }
      }
    }
  }, [webcamOn, videoTrack]);

  useEffect(() => {
    checkMediaPermission();
    return () => {};
  }, []);

  const { width: windowWidth } = useWindowSize();

  const {
    checkPermissions,
    requestPermission,
    getCameras,
    getMicrophones,
    getPlaybackDevices,
  } = useMediaDevice({
    onDeviceChanged,
  });

  const { getAudioTrack, getVideoTrack } = useMediaStream();

  useEffect(() => {
    if (
      videoPlayerRef.current &&
      videoPlayerRef.current.offsetHeight !== boxHeight
    ) {
      setBoxHeight(videoPlayerRef.current.offsetHeight);
    }
  }, [windowWidth, boxHeight]);

  useEffect(() => {
    getCameraDevices();
  }, [isCameraPermissionAllowed]);

  useEffect(() => {
    getAudioDevices();
  }, [isMicrophonePermissionAllowed]);

  const changeWebcam = async (deviceId) => {
    if (!webcamOn) return;
    const currentvideoTrack = videoTrackRef.current;

    if (currentvideoTrack) {
      currentvideoTrack.stop();
    }

    const stream = await getVideoTrack({
      webcamId: deviceId,
      encoderConfig: cameraResolution,
      optimizationMode: cameraOptimizationMode,
      multiStream: cameraMultiStream,
      bitrateMode: cameraBitrateMode,
      maxLayer: cameraMaxLayer,
      codec: cameraCodec,
    });
    if (!stream) return;
    const videoTracks = stream.getVideoTracks?.() || [];
    setCustomVideoStream(stream);
    const videoTrack = videoTracks.length ? videoTracks[0] : null;

    setVideoTrack(videoTrack);
  };
  const changeMic = async (deviceId) => {
    if (!micOn) return;
    const currentAudioTrack = audioTrackRef.current;
    currentAudioTrack && currentAudioTrack.stop();
    const stream = await getAudioTrack({
      micId: deviceId,
      encoderConfig: micQuality,
      noiseConfig: micNoiseConfig,
    });
    if (!stream) return;
    const audioTracks = stream.getAudioTracks?.() || [];
    setCustomAudioStream(stream);
    const audioTrack = audioTracks.length ? audioTracks[0] : null;
    setAudioTrack(audioTrack);
  };
  const getDefaultMediaTracks = async ({ mic, webcam }) => {
    if (mic) {
      try {
        const stream = await getAudioTrack({
          micId: selectedMic?.id,
          encoderConfig: micQuality,
          noiseConfig: micNoiseConfig,
        });
        if (stream) {
          setCustomAudioStream(stream);
          const audioTracks = stream.getAudioTracks?.() || [];
          const audioTrack = audioTracks.length ? audioTracks[0] : null;
          setAudioTrack(audioTrack);
        }
      } catch (e) {
        console.log("Error in getAudioTrack (getDefaultMediaTracks)", e);
      }
    }

    if (webcam) {
      try {
        const stream = await getVideoTrack({
          webcamId: cameraId || selectedWebcam?.id,
          encoderConfig: cameraResolution,
          optimizationMode: cameraOptimizationMode,
          multiStream: cameraMultiStream,
          bitrateMode: cameraBitrateMode,
          maxLayer: cameraMaxLayer,
          codec: cameraCodec,
        });
        if (stream) {
          setCustomVideoStream(stream);
          const videoTracks = stream.getVideoTracks?.() || [];
          const videoTrack = videoTracks.length ? videoTracks[0] : null;
          setVideoTrack(videoTrack);
        }
      } catch (e) {
        console.log("Error in getVideoTrack (getDefaultMediaTracks)", e);
      }
    }
  };
  async function startMuteListener() {
    const currentAudioTrack = audioTrackRef.current;

    if (currentAudioTrack) {
      if (currentAudioTrack.muted) {
        setDlgMuted(true);
      }

      currentAudioTrack.addEventListener("mute", (ev) => {
        setDlgMuted(true);
      });
    }
  }

  const getCameraDevices = async () => {
    try {
      if (!permissonAvaialble.current?.isCameraPermissionAllowed) return;
      let webcams = await getCameras();
      const firstWebcam = webcams[0];
      const currentStillPresent =
        selectedWebcam?.id &&
        webcams.some((w) => w.deviceId === selectedWebcam.id);
      if (!currentStillPresent && firstWebcam) {
        setSelectedWebcam({
          id: firstWebcam.deviceId,
          label: firstWebcam.label,
        });
      }
      setDevices((devices) => {
        return { ...devices, webcams };
      });
    } catch (err) {
      console.log("Error in getting camera devices", err);
    }
  };

  const getAudioDevices = async () => {
    try {
      if (!permissonAvaialble.current?.isMicrophonePermissionAllowed) return;
      let mics = await getMicrophones();
      let speakers = await getPlaybackDevices();
      const firstMic = mics[0];
      const firstSpeaker = speakers[0];
      const hasMic = mics.length > 0;
      if (hasMic) {
        startMuteListener();
      }
      const currentMicPresent =
        selectedMic?.id && mics.some((m) => m.deviceId === selectedMic.id);
      if (!currentMicPresent && firstMic) {
        setSelectedMic({ id: firstMic.deviceId, label: firstMic.label });
      }
      const currentSpeakerPresent =
        selectedSpeaker?.id &&
        speakers.some((s) => s.deviceId === selectedSpeaker.id);
      if (!currentSpeakerPresent && firstSpeaker) {
        setSelectedSpeaker({
          id: firstSpeaker.deviceId,
          label: firstSpeaker.label,
        });
      }
      setDevices((devices) => {
        return { ...devices, mics, speakers };
      });
    } catch (err) {
      console.log("Error in getting audio devices", err);
    }
  };

  function onDeviceChanged() {
    setDidDeviceChange(true);
    getCameraDevices();
    getAudioDevices();
    getDefaultMediaTracks({ mic: micRef.current, webcam: webcamRef.current });
  }

  const _toggleWebcam = () => {
    const videoTrack = videoTrackRef.current;
    if (webcamOn && webcamEnabled) {
      if (videoTrack) {
        videoTrack.stop();
        setVideoTrack(null);
        setCustomVideoStream(null);
        setWebcamOn(false);
      }
    } else {
      if (webcamEnabled) {
        getDefaultMediaTracks({ mic: false, webcam: true });
        setWebcamOn(true);
      }
    }
  };
  const _handleToggleMic = () => {
    const audioTrack = audioTrackRef.current;
    if (micOn && micEnabled) {
      if (audioTrack) {
        audioTrack.stop();
        setAudioTrack(null);
        setCustomAudioStream(null);
        setMicOn(false);
      }
    } else {
      if (micEnabled) {
        getDefaultMediaTracks({ mic: true, webcam: false });
        setMicOn(true);
      }
    }
  };

  const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
  async function requestAudioVideoPermission(mediaType) {
    try {
      const permission = await requestPermission(mediaType);

      // Firefox resolves both audio+video from a single request.
      if (isFirefox) {
        const isVideoAllowed = permission.get("video");
        const isAudioAllowed = permission.get("audio");
        setIsCameraPermissionAllowed(isVideoAllowed);
        setIsMicrophonePermissionAllowed(isAudioAllowed);
        if (isAudioAllowed && micEnabled) {
          setMicOn(true);
          await getDefaultMediaTracks({ mic: true, webcam: false });
        }
        if (isVideoAllowed && webcamEnabled) {
          setWebcamOn(true);
          await getDefaultMediaTracks({ mic: false, webcam: true });
        }
        return;
      }

      if (mediaType === Constants.permission.AUDIO) {
        const isAudioAllowed = permission.get(Constants.permission.AUDIO);
        setIsMicrophonePermissionAllowed(isAudioAllowed);
        if (isAudioAllowed && micEnabled) {
          setMicOn(true);
          await getDefaultMediaTracks({ mic: true, webcam: false });
        }
      }

      if (mediaType === Constants.permission.VIDEO) {
        const isVideoAllowed = permission.get(Constants.permission.VIDEO);
        setIsCameraPermissionAllowed(isVideoAllowed);
        if (isVideoAllowed && webcamEnabled) {
          setWebcamOn(true);
          await getDefaultMediaTracks({ mic: false, webcam: true });
        }
      }
    } catch (ex) {
      console.log("Error in requestPermission ", ex);
    }
  }
  const checkMediaPermission = async () => {
    try {
      const checkAudioVideoPermission = await checkPermissions();
      const cameraPermissionAllowed = checkAudioVideoPermission.get(
        Constants.permission.VIDEO
      );
      const microphonePermissionAllowed = checkAudioVideoPermission.get(
        Constants.permission.AUDIO
      );

      setIsCameraPermissionAllowed(cameraPermissionAllowed);
      setIsMicrophonePermissionAllowed(microphonePermissionAllowed);

      if (microphonePermissionAllowed && micEnabled) {
        setMicOn(true);
        getDefaultMediaTracks({ mic: true, webcam: false });
      } else if (micEnabled) {
        await requestAudioVideoPermission(Constants.permission.AUDIO);
      }
      if (cameraPermissionAllowed && webcamEnabled) {
        setWebcamOn(true);
        getDefaultMediaTracks({ mic: false, webcam: true });
      } else if (webcamEnabled) {
        await requestAudioVideoPermission(Constants.permission.VIDEO);
      }
    } catch (error) {
      // For firefox, it will request audio and video simultaneously.
      if (micEnabled && webcamEnabled) {
        await requestAudioVideoPermission();
      }
      console.log(error);
    }
  };

  const padding = useResponsiveSize({
    xl: 6,
    lg: 6,
    md: 6,
    sm: 4,
    xs: 1.5,
  });

  const internalPadding = useResponsiveSize({
    xl: 3,
    lg: 3,
    md: 2,
    sm: 2,
    xs: 1.5,
  });

  const spacingHorizontalTopicsObject = {
    xl: 32,
    lg: 32,
    md: 32,
    sm: 16,
    xs: 16,
  };

  const spacingHorizontalTopics = useResponsiveSize(
    spacingHorizontalTopicsObject
  );

  const isXStoSM = useMediaQuery(theme.breakpoints.between("xs", "sm"));
  const gtThenMD = useMediaQuery(theme.breakpoints.up("md"));
  const isXLOnly = useMediaQuery(theme.breakpoints.only("xl"));
  return (
    <>
      <Box
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          height: "100vh",
          overflowY: "auto",
          backgroundColor:
            appTheme === appThemes.DARK
              ? theme.palette.darkTheme.main
              : appTheme === appThemes.LIGHT
                ? theme.palette.lightTheme.main
                : theme.palette.background.default,
        }}
      >
        <Box
          m={9}
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid
            container
            spacing={padding}
            style={{
              display: "flex",
              flex: 1,
              flexDirection: isMobile ? "column" : "row",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
            }}
          >
            <Grid
              item
              xs={12}
              md={7}
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <Box
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                p={internalPadding}
              >
                <Box
                  style={{
                    paddingLeft: spacingHorizontalTopics - (gtThenMD ? 32 : 16),
                    paddingRight:
                      spacingHorizontalTopics - (gtThenMD ? 32 : 16),
                    position: "relative",
                    width: "100%",
                  }}
                >
                  <Box
                    style={{
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      left: spacingHorizontalTopics,
                      right: spacingHorizontalTopics,
                    }}
                  >
                    {!isMobile && <DotsBoxContainer type={"top-left"} />}
                    {!isMobile && <DotsBoxContainer type={"bottom-right"} />}
                  </Box>

                  <Box>
                    <Box
                      sx={{
                        width: "100%",
                        height: isMobile ? "35vh" : "50vh",
                        position: "relative",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          top: isMobile ? 0 : theme.spacing(1),
                          right: isMobile ? 0 : theme.spacing(1),
                          zIndex: 10,
                        }}
                      >
                        <RunPrecallTest
                          videoStream={customVideoStream}
                          audioStream={customAudioStream}
                          token={token}
                          appTheme={appTheme}
                        />
                      </Box>
                      {isMobile && (
                        <audio
                          autoPlay
                          playsInline
                          muted={!testSpeaker}
                          ref={audioPlayerRef}
                          controls={false}
                        />
                      )}
                      <video
                        autoPlay
                        playsInline
                        muted
                        ref={videoPlayerRef}
                        controls={false}
                        style={{
                          borderRadius: "10px",
                          backgroundColor: "#1c1c1c",
                          height: "100%",
                          width: "100%",
                          objectFit: "cover",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transform: "scaleX(-1)",
                        }}
                      />
                      <Box
                        position="absolute"
                        bottom={theme.spacing(2)}
                        left={0}
                        right={0}
                        width={"100%"}
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"center"}
                      >
                        <Box
                          display={"flex"}
                          alignItems={"center"}
                          alignContent={"center"}
                        >
                          <Grid
                            container
                            alignItems="center"
                            justify="center"
                            spacing={2}
                          >
                            {participantCanToggleSelfMic === "true" ? (
                              <Grid item>
                                {isMicrophonePermissionAllowed ? (
                                  <Tooltip
                                    title={
                                      micOn && micEnabled
                                        ? "Turn off mic"
                                        : "Turn on mic"
                                    }
                                    arrow
                                    placement="top"
                                  >
                                    <Button
                                      onClick={() => _handleToggleMic()}
                                      variant="contained"
                                      style={
                                        micOn && micEnabled
                                          ? {
                                              backgroundColor: "white",
                                              color: "black",
                                            }
                                          : {
                                              backgroundColor: red[500],
                                              color: "white",
                                            }
                                      }
                                      sx={{
                                        borderRadius: "100%",
                                        minWidth: "auto",
                                        width: "44px",
                                        height: "44px",
                                      }}
                                    >
                                      {micOn && micEnabled ? (
                                        <Mic />
                                      ) : (
                                        <MicOff />
                                      )}
                                    </Button>
                                  </Tooltip>
                                ) : (
                                  <MicPermissionDenied width={48} height={48} />
                                )}
                              </Grid>
                            ) : null}

                            {participantCanToggleSelfWebcam === "true" ? (
                              <Grid item>
                                {isCameraPermissionAllowed ? (
                                  <Tooltip
                                    title={
                                      webcamOn && webcamEnabled
                                        ? "Turn off camera"
                                        : "Turn on camera"
                                    }
                                    arrow
                                    placement="top"
                                  >
                                    <Button
                                      onClick={() => _toggleWebcam()}
                                      variant="contained"
                                      sx={{
                                        borderRadius: "100%",
                                        minWidth: "auto",
                                        width: "44px",
                                        height: "44px",
                                      }}
                                      style={
                                        webcamOn && webcamEnabled
                                          ? {
                                              backgroundColor: "white",
                                              color: "black",
                                            }
                                          : {
                                              backgroundColor: red[500],
                                              color: "white",
                                            }
                                      }
                                    >
                                      {webcamOn && webcamEnabled ? (
                                        <Videocam />
                                      ) : (
                                        <VideocamOff />
                                      )}
                                    </Button>
                                  </Tooltip>
                                ) : (
                                  <CameraPermissionDenied
                                    width={48}
                                    height={48}
                                  />
                                )}
                              </Grid>
                            ) : null}
                          </Grid>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                }}
                p={internalPadding}
              >
                {micEnabled && (
                  <Box
                    style={{
                      marginTop: isMobile ? "4px" : 0,
                      flex: 1,
                      width: isMobile ? "100%" : "32.333%",
                    }}
                  >
                    <DropDown
                      mics={mics}
                      changeMic={changeMic}
                      customAudioStream={customAudioStream}
                      audioTrack={audioTrack}
                      micOn={micOn}
                      didDeviceChange={didDeviceChange}
                      setDidDeviceChange={setDidDeviceChange}
                      testSpeaker={testSpeaker}
                      setTestSpeaker={setTestSpeaker}
                      selectedMic={selectedMic}
                      setSelectedMic={setSelectedMic}
                      selectedSpeaker={selectedSpeaker}
                      isMicrophonePermissionAllowed={
                        isMicrophonePermissionAllowed
                      }
                      appTheme={appTheme}
                    />
                  </Box>
                )}
                {!isMobile && (
                  <Box
                    style={{
                      marginTop: isMobile ? "4px" : 0,
                      flex: 1,
                      width: "32.333%",
                    }}
                  >
                    <DropDownSpeaker
                      speakers={speakers}
                      selectedSpeaker={selectedSpeaker}
                      setSelectedSpeaker={setSelectedSpeaker}
                      isMicrophonePermissionAllowed={
                        isMicrophonePermissionAllowed
                      }
                      appTheme={appTheme}
                    />
                  </Box>
                )}
                {webcamEnabled && (
                  <Box
                    style={{
                      marginTop: isMobile ? "4px" : 0,
                      flex: 1,
                      width: isMobile ? "100%" : "32.333%",
                    }}
                  >
                    <DropDownCam
                      changeWebcam={changeWebcam}
                      webcams={webcams}
                      selectedWebcam={selectedWebcam}
                      setSelectedWebcam={setSelectedWebcam}
                      isCameraPermissionAllowed={isCameraPermissionAllowed}
                      appTheme={appTheme}
                    />
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              md={5}
              style={{
                width: "100%",
                display: "flex",
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                style={{
                  width: "100%",
                  display: "flex",
                  flex: 1,
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingLeft: isMobile ? "16px" : "20px",
                }}
              >
                <Box
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingLeft: internalPadding,
                    paddingRight: internalPadding,
                  }}
                >
                  <MeetingDetailModal
                    internalPadding={internalPadding}
                    name={name}
                    setName={setName}
                    nameErr={nameErr}
                    meetingTitle={meetingTitle}
                    meetingUrl={meetingUrl}
                    setNameErr={setNameErr}
                    isXStoSM={isXStoSM}
                    startMeeting={() => {
                      onClick({ name, webcamOn, micOn });
                    }}
                    isXLOnly={isXLOnly}
                    appTheme={appTheme}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>

          <ConfirmBox
            appTheme={appTheme}
            open={dlgMuted}
            successText="OKAY"
            onSuccess={() => {
              setDlgMuted(false);
            }}
            title="System mic is muted"
            subTitle="You're default microphone is muted, please unmute it or increase audio
            input volume from system settings."
          />

          <ConfirmBox
            appTheme={appTheme}
            open={dlgDevices}
            successText="DISMISS"
            onSuccess={() => {
              setDlgDevices(false);
            }}
            title="Mic or webcam not available"
            subTitle="Please connect a mic and webcam to speak and share your video in the meeting. You can also join without them."
          />
        </Box>
      </Box>
    </>
  );
}
