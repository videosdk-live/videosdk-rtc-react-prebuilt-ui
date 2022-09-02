import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Videocam, Mic, MicOff, VideocamOff } from "@material-ui/icons";
import { red } from "@material-ui/core/colors";
import useResponsiveSize from "../utils/useResponsiveSize";
import ConfirmBox from "../components/ConfirmBox";
import { CheckboxIcon } from "../icons";
import SettingDialogueBox from "./joinScreen/SettingDialogueBox";
import MeetingDetailModal from "./joinScreen/MeetingDetailModal";
import useWindowSize from "../utils/useWindowSize";
import { meetingModes } from "../CONSTS";

const useStyles = makeStyles((theme) => ({
  input: {
    margin: theme.spacing(2, 1),
    width: "500px",
    "@media only screen and (max-width: 959.9px)": {
      width: "340px",
    },
  },

  video: {
    borderRadius: "10px",
    backgroundColor: "#1c1c1c",
    height: "100%",
    width: "100%",
    objectFit: "cover",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  toggleButton: {
    borderRadius: "100%",
    minWidth: "auto",
    width: "44px",
    height: "44px",
  },

  previewBox: {
    width: "100%",
    height: "45vh",
    position: "relative",
  },
}));

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
  setSelectedMic,
  setSelectedWebcam,
  mode,
}) {
  const classes = useStyles();
  const theme = useTheme();

  const [nameErr, setNameErr] = useState(false);

  const [setting, setSetting] = useState(
    participantCanToggleSelfWebcam === "true"
      ? "video"
      : participantCanToggleSelfMic === "true"
      ? "audio"
      : null
  );

  const [dlgMuted, setDlgMuted] = useState(false);
  const [dlgDevices, setDlgDevices] = useState(false);

  const [settingDialogueOpen, setSettingDialogueOpen] = useState(false);

  const handleClickOpen = () => {
    setSettingDialogueOpen(true);
  };

  const handleClose = (value) => {
    setSettingDialogueOpen(false);
  };

  useEffect(() => {
    return () => {
      _handleTurnOffMic();
      _handleTurnOffWebcam();
    };
  }, []);

  const [{ webcams, mics }, setDevices] = useState({
    devices: [],
    webcams: [],
    mics: [],
  });

  const [boxHeight, setBoxHeight] = useState(0);

  const audioAnalyserIntervalRef = useRef();

  const videoPlayerRef = useRef();
  const popupVideoPlayerRef = useRef();
  const popupAudioPlayerRef = useRef();

  const [videoTrack, setVideoTrack] = useState(null);
  const [audioTrack, setAudioTrack] = useState(null);

  const webcamOn = useMemo(() => !!videoTrack, [videoTrack]);
  const micOn = useMemo(() => !!audioTrack, [audioTrack]);

  const videoTrackRef = useRef();
  const audioTrackRef = useRef();

  const { width: windowWidth } = useWindowSize();

  useEffect(() => {
    if (
      videoPlayerRef.current &&
      videoPlayerRef.current.offsetHeight !== boxHeight
    ) {
      setBoxHeight(videoPlayerRef.current.offsetHeight);
    }
  }, [windowWidth, boxHeight]);

  const changeWebcam = async (deviceId) => {
    const currentvideoTrack = videoTrackRef.current;

    if (currentvideoTrack) {
      currentvideoTrack.stop();
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId },
    });
    const videoTracks = stream.getVideoTracks();

    const videoTrack = videoTracks.length ? videoTracks[0] : null;

    setVideoTrack(videoTrack);
  };
  const changeMic = async (deviceId) => {
    const currentAudioTrack = audioTrackRef.current;
    currentAudioTrack && currentAudioTrack.stop();
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { deviceId },
    });
    const audioTracks = stream.getAudioTracks();

    const audioTrack = audioTracks.length ? audioTracks[0] : null;
    clearInterval(audioAnalyserIntervalRef.current);

    setAudioTrack(audioTrack);
  };
  const getDefaultMediaTracks = async ({ mic, webcam, firstTime }) => {
    if (mic) {
      const audioConstraints = {
        audio: true,
      };

      const stream = await navigator.mediaDevices.getUserMedia(
        audioConstraints
      );
      const audioTracks = stream.getAudioTracks();

      const audioTrack = audioTracks.length ? audioTracks[0] : null;

      setAudioTrack(audioTrack);
      if (firstTime) {
        setSelectedMic({
          id: audioTrack?.getSettings()?.deviceId,
        });
      }
    }

    if (webcam) {
      const videoConstraints = {
        video: {
          width: 1280,
          height: 720,
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(
        videoConstraints
      );
      const videoTracks = stream.getVideoTracks();

      const videoTrack = videoTracks.length ? videoTracks[0] : null;
      setVideoTrack(videoTrack);
      if (firstTime) {
        setSelectedWebcam({
          id: videoTrack?.getSettings()?.deviceId,
        });
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

  const getDevices = async ({ micEnabled, webcamEnabled }) => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();

      const webcams = devices.filter((d) => d.kind === "videoinput");
      const mics = devices.filter((d) => d.kind === "audioinput");

      const hasMic = mics.length > 0;
      const hasWebcam = webcams.length > 0;

      setDevices({ webcams, mics, devices });

      if (hasMic) {
        startMuteListener();
      }

      getDefaultMediaTracks({
        mic: hasMic && micEnabled,
        webcam: hasWebcam && webcamEnabled,
        firstTime: true,
      });
    } catch (err) {
      console.log(err);
    }
  };
  const _handleTurnOffWebcam = () => {
    const videoTrack = videoTrackRef.current;

    if (videoTrack) {
      videoTrack.stop();

      setVideoTrack(null);
    }
  };
  const _handleTurnOnWebcam = () => {
    const videoTrack = videoTrackRef.current;

    if (!videoTrack) {
      getDefaultMediaTracks({ mic: false, webcam: true });
    }
  };

  const _toggleWebcam = () => {
    const videoTrack = videoTrackRef.current;

    if (videoTrack) {
      _handleTurnOffWebcam();
    } else {
      _handleTurnOnWebcam();
    }
  };
  const _handleTurnOffMic = () => {
    const audioTrack = audioTrackRef.current;

    if (audioTrack) {
      audioTrack.stop();

      setAudioTrack(null);
    }
  };
  const _handleTurnOnMic = () => {
    const audioTrack = audioTrackRef.current;

    if (!audioTrack) {
      getDefaultMediaTracks({ mic: true, webcam: false });
    }
  };
  const _handleToggleMic = () => {
    const audioTrack = audioTrackRef.current;

    if (audioTrack) {
      _handleTurnOffMic();
    } else {
      _handleTurnOnMic();
    }
  };

  useEffect(() => {
    videoTrackRef.current = videoTrack;

    if (videoTrack) {
      const videoSrcObject = new MediaStream([videoTrack]);

      if (videoPlayerRef.current) {
        videoPlayerRef.current.srcObject = videoSrcObject;
        videoPlayerRef.current.play();
      }

      setTimeout(() => {
        if (popupVideoPlayerRef.current) {
          popupVideoPlayerRef.current.srcObject = videoSrcObject;
          popupVideoPlayerRef.current.play();
        }
      }, 1000);
    } else {
      if (videoPlayerRef.current) {
        videoPlayerRef.current.srcObject = null;
      }
      if (popupVideoPlayerRef.current) {
        popupVideoPlayerRef.current.srcObject = null;
      }
    }
  }, [videoTrack, setting, settingDialogueOpen]);

  useEffect(() => {
    audioTrackRef.current = audioTrack;

    startMuteListener();
  }, [audioTrack]);

  useEffect(() => {
    getDevices({ micEnabled, webcamEnabled });
  }, []);

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
    xl: 60,
    lg: 40,
    md: 40,
    sm: 40,
    xs: 32,
  };

  const spacingHorizontalTopics = useResponsiveSize(
    spacingHorizontalTopicsObject
  );

  const isXStoSM = useMediaQuery(theme.breakpoints.between("xs", "sm"));
  const gtThenMD = useMediaQuery(theme.breakpoints.up("md"));
  const gtThenXL = useMediaQuery(theme.breakpoints.only("xl"));

  const isXSOnly = useMediaQuery(theme.breakpoints.only("xs"));
  const isSMOnly = useMediaQuery(theme.breakpoints.only("sm"));
  const isXLOnly = useMediaQuery(theme.breakpoints.only("xl"));

  return (
    <>
      <Box
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          height: "100vh",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Box
          m={9}
          style={{
            display: "flex",
            flex: 1,
            flexDirection: isXStoSM
              ? "column"
              : meetingUrl === "" || meetingTitle === ""
              ? "row"
              : "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid
            container
            spacing={padding}
            style={{
              display: "flex",
              flex: isSMOnly ? 0 : 1,
              flexDirection: isXStoSM
                ? "column"
                : meetingUrl || meetingTitle
                ? "row"
                : "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Grid
              item
              xs={12}
              md={gtThenXL ? 6 : 7}
              style={{
                display: "flex",
                flex: 1,
              }}
            >
              <Box
                style={{
                  width: isXSOnly ? "100%" : "100vw",
                  // isXSOnly ? "100%" : isSMOnly ? "96%" : "100vw",
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
                    <Box className={classes.previewBox}>
                      <video
                        autoPlay
                        playsInline
                        muted
                        ref={videoPlayerRef}
                        controls={false}
                        className={classes.video + " flip"}
                      />

                      {!isXSOnly ? (
                        <>
                          <Box
                            style={{
                              position: "absolute",
                              top: 0,
                              bottom: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              right: 0,
                              left: 0,
                            }}
                          >
                            {participantCanToggleSelfWebcam === "false" &&
                            !webcamOn ? (
                              <Typography variant={isXLOnly ? "h5" : "h6"}>
                                {mode === meetingModes.VIEWER
                                  ? "You are not permitted to use your microphone and camera."
                                  : "You are not allowed to turn on your camera"}
                              </Typography>
                            ) : !webcamOn ? (
                              <Typography variant={isXLOnly ? "h4" : "h6"}>
                                The camera is off
                              </Typography>
                            ) : null}
                          </Box>
                          {participantCanToggleSelfWebcam === "true" ||
                          participantCanToggleSelfMic === "true" ? (
                            <Box
                              style={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                backgroundColor: "#1C1F2E80",
                                borderRadius: 4,
                                cursor: "pointer",
                              }}
                              m={2}
                              onClick={(e) => {
                                handleClickOpen();
                              }}
                            >
                              <Box
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                                m={0.5}
                              >
                                <IconButton style={{ margin: 0, padding: 0 }}>
                                  <CheckboxIcon />
                                </IconButton>
                                <Typography
                                  variant="subtitle1"
                                  style={{ marginLeft: 4 }}
                                >
                                  Check your audio and video
                                </Typography>
                              </Box>
                            </Box>
                          ) : null}
                        </>
                      ) : null}

                      {settingDialogueOpen ? (
                        <SettingDialogueBox
                          open={settingDialogueOpen}
                          onClose={handleClose}
                          popupVideoPlayerRef={popupVideoPlayerRef}
                          popupAudioPlayerRef={popupAudioPlayerRef}
                          changeWebcam={changeWebcam}
                          changeMic={changeMic}
                          setting={setting}
                          setSetting={setSetting}
                          webcams={webcams}
                          mics={mics}
                          setSelectedMic={setSelectedMic}
                          setSelectedWebcam={setSelectedWebcam}
                          videoTrack={videoTrack}
                          audioTrack={audioTrack}
                          participantCanToggleSelfMic={
                            participantCanToggleSelfMic
                          }
                          participantCanToggleSelfWebcam={
                            participantCanToggleSelfWebcam
                          }
                        />
                      ) : null}

                      <Box
                        position="absolute"
                        bottom={theme.spacing(2)}
                        left="0"
                        right="0"
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
                                title={micOn ? "Turn off mic" : "Turn on mic"}
                                arrow
                                placement="top"
                              >
                                <Button
                                  onClick={() => _handleToggleMic()}
                                  variant="contained"
                                  style={
                                    micOn
                                      ? {}
                                      : {
                                          backgroundColor: red[500],
                                          color: "white",
                                        }
                                  }
                                  className={classes.toggleButton}
                                >
                                  {micOn ? <Mic /> : <MicOff />}
                                </Button>
                              </Tooltip>
                            </Grid>
                          ) : null}

                          {participantCanToggleSelfWebcam === "true" ? (
                            <Grid item>
                              <Tooltip
                                title={
                                  webcamOn
                                    ? "Turn off camera"
                                    : "Turn on camera"
                                }
                                arrow
                                placement="top"
                              >
                                <Button
                                  onClick={() => _toggleWebcam()}
                                  variant="contained"
                                  style={
                                    webcamOn
                                      ? {}
                                      : {
                                          backgroundColor: red[500],
                                          color: "white",
                                        }
                                  }
                                  className={classes.toggleButton}
                                >
                                  {webcamOn ? <Videocam /> : <VideocamOff />}
                                </Button>
                              </Tooltip>
                            </Grid>
                          ) : null}
                        </Grid>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              md={isXStoSM ? 5 : meetingTitle || meetingUrl ? 5 : 6}
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
                    // localStorage.setItem("name", name);
                  }}
                  isXLOnly={isXLOnly}
                />
              </Box>
            </Grid>
          </Grid>

          <ConfirmBox
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
