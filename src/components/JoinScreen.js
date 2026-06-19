import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
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
  setCustomVideoStream,
  appTheme,
  cameraId,
}) {
  const theme = useTheme();

  const [nameErr, setNameErr] = useState(false);
  const isMobile = useIsMobile();
  const isSmallScreen = useIsMobile(900);
  const [webcamOn, setWebcamOn] = useState(webcamEnabled ? true : false)
  const [micOn, setMicOn] = useState(micEnabled ? true : false)
  const [isCameraPermissionAllowed, setIsCameraPermissionAllowed] = useState(false)
  const [isMicrophonePermissionAllowed, setIsMicrophonePermissionAllowed] = useState(false)
  const [didDeviceChange, setDidDeviceChange] = useState(false);
  const [testSpeaker, setTestSpeaker] = useState(false)
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
  useEffect(() => {
    if (webcamOn) {
      webcamRef.current = true;
    }
  }, [webcamOn]);

  useEffect(() => {
    if (micOn && micEnabled) {
      micRef.current = true;
    }
  }, [micOn]);

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
    return () => { };
  }, []);

  const videoTrackRef = useRef();
  const audioTrackRef = useRef();

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
    if (isCameraPermissionAllowed) {
      getCameraDevices();
    } else {
      setDevices((prev) => ({ ...prev, webcams: [] }));
    }
    if (isMicrophonePermissionAllowed) {
      getAudioDevices();
    } else {
      setDevices((prev) => ({ ...prev, mics: [] }));
    }
  }, [isCameraPermissionAllowed, isMicrophonePermissionAllowed]);

  const changeWebcam = async (deviceId) => {
    const currentvideoTrack = videoTrackRef.current;

    if (currentvideoTrack) {
      currentvideoTrack.stop();
    }

    const stream = await getVideoTrack({ webcamId: deviceId });
    const videoTracks = stream.getVideoTracks();
    setCustomVideoStream(stream);
    const videoTrack = videoTracks?.length ? videoTracks[0] : null;

    setVideoTrack(videoTrack);
  };
  const changeMic = async (deviceId) => {
    const currentAudioTrack = audioTrackRef.current;
    currentAudioTrack && currentAudioTrack.stop();
    const stream = await getAudioTrack({ micId: deviceId });
    const audioTracks = stream.getAudioTracks();
    setCustomAudioStream(stream);
    const audioTrack = audioTracks?.length ? audioTracks[0] : null;
    setAudioTrack(audioTrack);
  };
  const getDefaultMediaTracks = async ({
    mic,
    webcam,
    firstTime,
    cameraId,
    micId,
    speakers,
  }) => {
    if (mic) {
      const stream = await getAudioTrack({ micId: micId || selectedMic?.id });
      setCustomAudioStream(stream);
      const audioTracks = stream?.getAudioTracks();
      const audioTrack = audioTracks?.length ? audioTracks[0] : null;
      setAudioTrack(audioTrack);
      if (firstTime) {
        await setSelectedMic({
          id: audioTrack?.getSettings()?.deviceId,
        });
      }
    }

    if (webcam) {
      const stream = await getVideoTrack({
        webcamId: cameraId || selectedWebcam?.id,
        encoderConfig: "h720p_w1280p",
      });
      const videoTracks = stream?.getVideoTracks();
      setCustomVideoStream(stream);
      const videoTrack = videoTracks?.length ? videoTracks[0] : null;
      setVideoTrack(videoTrack);
      if (firstTime) {
        await setSelectedWebcam({
          id: videoTrack?.getSettings()?.deviceId,
        });
      }
    }
    if (speakers) {
      const speakers = await getPlaybackDevices();
      await setSelectedSpeaker({
        id: speakers[0]?.deviceId || null,
        label: speakers[0]?.label || null,
      });
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
      let webcams = await getCameras();
      const firstWebcam = webcams[0];
      await setSelectedWebcam({
        id: webcams[0]?.deviceId,
        label: webcams[0]?.label,
      });
      setDevices((devices) => {
        return { ...devices, webcams };
      });
      return { webcams, firstWebcamId: firstWebcam?.deviceId };
    } catch (err) {
      console.log("Error in getting camera devices", err);
    }
  };

  const getAudioDevices = async () => {
    try {
      let mics = await getMicrophones();
      let speakers = await getPlaybackDevices();
      const firstMic = mics[0];
      const hasMic = mics.length > 0;
      if (hasMic) {
        startMuteListener();
      }
      await setSelectedSpeaker({
        id: speakers[0]?.deviceId,
        label: speakers[0]?.label,
      });
      await setSelectedMic({ id: mics[0]?.deviceId, label: mics[0]?.label });
      setDevices((devices) => {
        return { ...devices, mics, speakers };
      });
      return { mics, speakers, firstMicId: firstMic?.deviceId };
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
    }
    else {
      if (webcamEnabled) {
        getDefaultMediaTracks({ mic: false, webcam: true, cameraId: cameraId });
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

      // For Video
      if (isFirefox) {
        const isVideoAllowed = permission.get("video");
        setIsCameraPermissionAllowed(isVideoAllowed);
        if (isVideoAllowed && webcamEnabled) {
          await getDefaultMediaTracks({ mic: false, webcam: true });
        }
      }

      // For Audio
      if (isFirefox) {
        const isAudioAllowed = permission.get("audio");
        setIsMicrophonePermissionAllowed(isAudioAllowed);
        if (isAudioAllowed && micEnabled) {
          await getDefaultMediaTracks({ mic: true, webcam: false });
        }
      }

      if (mediaType === Constants.permission.AUDIO) {
        const isAudioAllowed = permission.get(Constants.permission.AUDIO);
        setIsMicrophonePermissionAllowed(isAudioAllowed);
        if (isAudioAllowed && micEnabled) {
          await getDefaultMediaTracks({ mic: true, webcam: false });
        }
      }

      if (mediaType === Constants.permission.VIDEO) {
        const isVideoAllowed = permission.get(Constants.permission.VIDEO);
        setIsCameraPermissionAllowed(isVideoAllowed);
        if (isVideoAllowed && webcamEnabled) {
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
      const { firstWebcamId } = await getCameraDevices();
      const { firstMicId } = await getAudioDevices();
      if (microphonePermissionAllowed && micEnabled) {
        getDefaultMediaTracks({ mic: true, webcam: false, micId: firstMicId });
      } else {
        if (micEnabled) {
          await requestAudioVideoPermission(Constants.permission.AUDIO);
        }
      }
      if (cameraPermissionAllowed && webcamEnabled) {
        getDefaultMediaTracks({ mic: false, webcam: true, cameraId: firstWebcamId });
      } else {
        if (webcamEnabled) {
          await requestAudioVideoPermission(Constants.permission.VIDEO);
        }
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
              flexDirection: isXStoSM ? "column" : "row",
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
                    paddingLeft:
                      spacingHorizontalTopics -
                      (gtThenMD ? theme.spacing(4) : theme.spacing(2)),
                    paddingRight:
                      spacingHorizontalTopics -
                      (gtThenMD ? theme.spacing(4) : theme.spacing(2)),

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
                    <DotsBoxContainer type={"top-left"} />
                    <DotsBoxContainer type={"bottom-right"} />
                  </Box>

                  <Box>
                    <Box
                      sx={{
                        width: "100%",
                        height: "50vh",
                        position: "relative",
                      }}
                    >
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
                                <Tooltip
                                  title={micOn && micEnabled ? "Turn off mic" : "Turn on mic"}
                                  arrow
                                  placement="top"
                                >
                                  {isMicrophonePermissionAllowed &&
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
                                      {micOn && micEnabled ? <Mic /> : <MicOff />}
                                    </Button>
                                  }
                                  {!isMicrophonePermissionAllowed && <MicPermissionDenied width={48} height={48} />}
                                </Tooltip>
                              </Grid>
                            ) : null}

                            {participantCanToggleSelfWebcam === "true" ? (
                              <Grid item>
                                <Tooltip
                                  title={
                                    webcamOn && webcamEnabled
                                      ? "Turn off camera"
                                      : "Turn on camera"
                                  }
                                  arrow
                                  placement="top"
                                >
                                  {isCameraPermissionAllowed &&
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
                                      {webcamOn && webcamEnabled ? <Videocam /> : <VideocamOff />}
                                    </Button>
                                  }
                                  {
                                    !isCameraPermissionAllowed &&
                                    <CameraPermissionDenied width={48} height={48} />
                                  }
                                </Tooltip>
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
                {micEnabled && <Box style={{ marginTop: (isMobile) ? "4px" : 0, flex: 1, width: (isMobile) ? "100%" : "32.333%" }}>
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
                    isMicrophonePermissionAllowed={isMicrophonePermissionAllowed}
                  />
                </Box>}
                {!(isMobile) && (
                  <Box style={{ marginTop: isMobile ? "4px" : 0, flex: 1, width: "32.333%" }}>
                    <DropDownSpeaker
                      speakers={speakers}
                      selectedSpeaker={selectedSpeaker}
                      setSelectedSpeaker={setSelectedSpeaker}
                      isMicrophonePermissionAllowed={isMicrophonePermissionAllowed}
                    />
                  </Box>
                )}
                {webcamEnabled && <Box style={{ marginTop: (isMobile) ? "4px" : 0, flex: 1, width: (isMobile) ? "100%" : "32.333%" }}>
                  <DropDownCam
                    changeWebcam={changeWebcam}
                    webcams={webcams}
                    selectedWebcam={selectedWebcam}
                    setSelectedWebcam={setSelectedWebcam}
                    isCameraPermissionAllowed={isCameraPermissionAllowed}
                  />
                </Box>}
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
      </Box >
    </>
  );
}
