import React, { useEffect, useMemo, useRef, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  IconButton,
  Box,
  MenuItem,
  Popover,
  Tooltip,
  MenuList,
  Typography,
  Link,
} from "@material-ui/core";
import OutlineIconButton from "../components/OutlineIconButton";
import { useMeeting } from "@videosdk.live/react-sdk";
import { sideBarModes, useMeetingAppContext } from "../MeetingAppContextDef";
import useIsTab from "../utils/useIsTab";
import useIsMobile from "../utils/useIsMobile";
import recordingBlink from "../animations/recording-blink.json";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";

import {
  Activities,
  Chat,
  EndCall,
  Participants,
  ScreenRecording,
  ScreenShare,
  RaiseHand,
  LeaveMeetingIcon,
  EndCallIcon,
} from "../icons";

import {
  MicOff as MicOffIcon,
  Mic as MicIcon,
  VideocamOff as VideocamOffIcon,
  Videocam as VideocamIcon,
  MoreHoriz as MoreHorizIcon,
  Close as CloseIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Gesture,
} from "@material-ui/icons";

import {
  isMobile as RDDIsMobile,
  isTablet as RDDIsTablet,
} from "react-device-detect";
import ConfirmBox from "../components/ConfirmBox";
import { useMediaQuery } from "react-responsive";

const useStyles = makeStyles({
  row: { display: "flex", alignItems: "center" },
  borderRight: { borderRight: "1ps solid #ffffff33" },
  popover: { backgroundColor: "transparent" },
  popoverBorder: {
    borderRadius: "12px",
    backgroundColor: "#212032",
    marginTop: 8,
    width: 300,
  },
});
const RaiseHandBTN = ({ onClick }) => {
  const mMeeting = useMeeting();

  const sendChatMessage = mMeeting?.sendChatMessage;

  const onRaiseHand = () => {
    typeof onClick === "function" && onClick();
    sendChatMessage(JSON.stringify({ type: "RAISE_HAND", data: {} }));
  };

  return (
    <Tooltip>
      <OutlineIconButton
        tooltipTitle={"Raise hand"}
        Icon={RaiseHand}
        onClick={onRaiseHand}
      />
    </Tooltip>
  );
};
const ParticipantsBTN = ({ onClick }) => {
  const { sideBarMode, setSideBarMode } = useMeetingAppContext();

  const mMeeting = useMeeting();
  const participants = mMeeting?.participants;
  const participantsCount = participants ? new Map(participants).size : 0;

  return (
    <OutlineIconButton
      tooltipTitle={"Participants"}
      isFocused={sideBarMode === sideBarModes.PARTICIPANTS}
      Icon={Participants}
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

const ConfigBTN = () => {
  const { sideBarMode, setSideBarMode } = useMeetingAppContext();
  return (
    <OutlineIconButton
      tooltipTitle={"Configuration"}
      Icon={SettingsOutlinedIcon}
      isFocused={sideBarMode === sideBarModes.CONFIGURATION}
      onClick={() => {
        setSideBarMode((s) =>
          s === sideBarModes.CONFIGURATION ? null : sideBarModes.CONFIGURATION
        );
      }}
    />
  );
};

const AddLiveStreamBTN = () => {
  console.log("from AddLiveStreamBTN");
  const { sideBarMode, setSideBarMode } = useMeetingAppContext();
  return (
    <OutlineIconButton
      tooltipTitle={"Add Live Stream"}
      // buttonText="Add Live Stream"
      Icon={SettingsOutlinedIcon}
      isFocused={sideBarMode === sideBarModes.STREAMS}
      onClick={() => {
        setSideBarMode((s) =>
          s === sideBarModes.STREAMS ? null : sideBarModes.STREAMS
        );
      }}
    />
  );
};
const ChatBTN = () => {
  const { sideBarMode, setSideBarMode } = useMeetingAppContext();

  return (
    <OutlineIconButton
      tooltipTitle={"Chat"}
      Icon={Chat}
      isFocused={sideBarMode === sideBarModes.CHAT}
      onClick={() => {
        setSideBarMode((s) =>
          s === sideBarModes.CHAT ? null : sideBarModes.CHAT
        );
      }}
    />
  );
};
const ActivitiesBTN = ({ onClick }) => {
  const { sideBarMode, setSideBarMode } = useMeetingAppContext();

  return (
    <OutlineIconButton
      tooltipTitle={"Activities"}
      Icon={Activities}
      isFocused={sideBarMode === sideBarModes.ACTIVITIES}
      onClick={() => {
        typeof onClick === "function" && onClick();

        setSideBarMode((s) =>
          s === sideBarModes.ACTIVITIES ? null : sideBarModes.ACTIVITIES
        );
      }}
    />
  );
};

const WhiteBoardBTN = ({ onClick }) => {
  const { whiteboardStarted, whiteboardEnabled, canToggleWhiteboard } =
    useMeetingAppContext();
  const mMeeting = useMeeting({});

  const presenterId = mMeeting?.presenterId;

  return (
    <>
      {whiteboardEnabled && (
        <OutlineIconButton
          disabled={presenterId || !canToggleWhiteboard}
          tooltipTitle={"Whiteboard"}
          Icon={Gesture}
          isFocused={whiteboardStarted}
          onClick={() => {
            typeof onClick === "function" && onClick();

            whiteboardStarted
              ? mMeeting.meeting.stopWhiteboard()
              : mMeeting.meeting.startWhiteboard();
          }}
        />
      )}
    </>
  );
};

const ScreenShareBTN = ({ onClick }) => {
  const mMeeting = useMeeting({});
  const { whiteboardStarted } = useMeetingAppContext();

  const localScreenShareOn = mMeeting?.localScreenShareOn;
  const toggleScreenShare = mMeeting?.toggleScreenShare;
  const presenterId = mMeeting?.presenterId;

  return (
    <OutlineIconButton
      tooltipTitle={
        presenterId
          ? localScreenShareOn
            ? "Stop Presenting"
            : null
          : "Present Screen"
      }
      isFocused={localScreenShareOn}
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

const MicBTN = () => {
  const { selectedMic } = useMeetingAppContext();

  const [selectedDeviceId, setSelectedDeviceId] = useState(selectedMic.id);
  const [downArrow, setDownArrow] = useState(null);
  const [mics, setMics] = useState([]);
  const mMeeting = useMeeting({});
  const theme = useTheme();

  const handleClick = (event) => {
    setDownArrow(event.currentTarget);
  };

  const handleClose = () => {
    setDownArrow(null);
  };

  const localMicOn = mMeeting?.localMicOn;
  const toggleMic = mMeeting?.toggleMic;
  const changeMic = mMeeting?.changeMic;

  const getMics = async (mGetMics) => {
    const mics = await mGetMics();

    mics && mics?.length && setMics(mics);
  };

  const tollTipEl = useRef();

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
        tooltipTitle={localMicOn ? "Turn off mic" : "Turn on mic"}
        isFocused={localMicOn}
        Icon={localMicOn ? MicIcon : MicOffIcon}
        onClick={toggleMic}
        focusBGColor={"#ffffff33"}
        focusIconColor={theme.palette.common.white}
        renderRightComponent={() => {
          return (
            <Tooltip placement="bottom" title={"Change microphone"}>
              <IconButton
                onClick={(e) => {
                  getMics(mMeeting.getMics);
                  handleClick(e);
                }}
                size={"small"}
              >
                <ArrowDropDownIcon fontSize={"small"} />
              </IconButton>
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
        <MenuList>
          {mics.map(({ deviceId, label }, index) => (
            <MenuItem
              key={`output_mics_${deviceId}`}
              selected={deviceId === selectedDeviceId}
              onClick={() => {
                handleClose();
                setSelectedDeviceId(deviceId);
                changeMic(deviceId);
              }}
            >
              {label || `Mic ${index + 1}`}
            </MenuItem>
          ))}
        </MenuList>
      </Popover>
    </Box>
  );
};

const RecordingBTN = () => {
  const mMeeting = useMeeting({});

  const isRecording = mMeeting?.isRecording;
  const startRecording = mMeeting?.startRecording;
  const stopRecording = mMeeting?.stopRecording;
  const [defaultRecordingActionTaken, setDefaultRecordingActionTaken] =
    useState(false);

  const {
    recordingWebhookUrl,
    recordingAWSDirPath,
    autoStartRecording,
    participantCanToggleRecording,
    recordingLayoutType,
    recordingLayoutPriority,
    recordingLayoutGridSize,
  } = useMeetingAppContext();

  useEffect(() => {
    if (autoStartRecording) {
      setDefaultRecordingActionTaken(true);
      setTimeout(() => {
        if (!defaultRecordingActionTaken) {
          startRecording(recordingWebhookUrl, recordingAWSDirPath, {
            layout: {
              type: recordingLayoutType,
              priority: recordingLayoutPriority,
              gridSize: recordingLayoutGridSize,
            },
          });
        }
      }, 5000);
    }
  }, [
    recordingWebhookUrl,
    recordingAWSDirPath,
    defaultRecordingActionTaken,
    autoStartRecording,
    startRecording,
  ]);

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

  return (
    <OutlineIconButton
      Icon={ScreenRecording}
      onClick={() => {
        if (isRecording) {
          stopRecording();
        } else {
          startRecording(recordingWebhookUrl, recordingAWSDirPath, {
            layout: {
              type: recordingLayoutType,
              priority: recordingLayoutPriority,
              gridSize: recordingLayoutGridSize,
            },
          });
        }
      }}
      tooltipTitle={isRecording ? "Stop Recording" : "Start Recording"}
      isFocused={isRecording}
      disabled={!participantCanToggleRecording}
      lottieOption={isRecording ? defaultOptions : null}
    />
  );
};

const WebcamBTN = () => {
  const theme = useTheme();
  const mMeeting = useMeeting({});
  const { selectedWebcam } = useMeetingAppContext();

  const [selectedDeviceId, setSelectedDeviceId] = useState(selectedWebcam.id);

  const [downArrow, setDownArrow] = useState(null);
  const [webcams, setWebcams] = useState([]);

  const localWebcamOn = mMeeting?.localWebcamOn;
  const toggleWebcam = mMeeting?.toggleWebcam;
  const changeWebcam = mMeeting?.changeWebcam;

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
        Icon={localWebcamOn ? VideocamIcon : VideocamOffIcon}
        onClick={toggleWebcam}
        focusBGColor={"#ffffff33"}
        focusIconColor={theme.palette.common.white}
        renderRightComponent={() => {
          return (
            <Tooltip placement="bottom" title={"Change webcam"}>
              <IconButton
                onClick={(e) => {
                  getWebcams(mMeeting?.getWebcams);
                  handleClick(e);
                }}
                size={"small"}
              >
                <ArrowDropDownIcon fontSize={"small"} />
              </IconButton>
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
        <MenuList>
          {webcams.map(({ deviceId, label }, index) => (
            <MenuItem
              key={`output_webcams_${deviceId}`}
              selected={deviceId === selectedDeviceId}
              onClick={() => {
                handleClose();
                setSelectedDeviceId(deviceId);
                changeWebcam(deviceId);
              }}
            >
              {label || `Webcam ${index + 1}`}
            </MenuItem>
          ))}
        </MenuList>
      </Popover>
    </Box>
  );
};
const EndCallBTN = () => {
  const mMeeting = useMeeting({});
  const classes = useStyles();

  const [isEndMeeting, setIsEndMeeting] = useState(false);
  const { endCallContainerRef, canEndMeeting, participantCanLeave } =
    useMeetingAppContext();

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
          !participantCanLeave
            ? "End Call"
            : canEndMeeting
            ? "Open popup"
            : "Leave Call"
        }
        bgColor={theme.palette.error.main}
        Icon={EndCall}
        onClick={(e) => {
          !participantCanLeave
            ? setIsEndMeeting(true)
            : canEndMeeting
            ? handleClick(e)
            : leave();
        }}
      />
      {canEndMeeting && (
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
            classes={{
              paper: classes.popoverBorder,
            }}
          >
            <MenuList>
              <MenuItem
                key={`leave`}
                onClick={() => {
                  leave();
                }}
              >
                <Box style={{ display: "flex", flexDirection: "row" }}>
                  <Box
                    style={{
                      backgroundColor: theme.palette.common.sidePanel,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 42,
                      width: 42,
                      borderRadius: 4,
                    }}
                  >
                    <LeaveMeetingIcon height={22} width={22} />
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
                    <Typography style={{ fontSize: 14 }}>Leave</Typography>
                    <Typography
                      color={"textSecondary"}
                      style={{ fontSize: "0.9rem" }}
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
              >
                <Box style={{ display: "flex", flexDirection: "row" }}>
                  <Box
                    style={{
                      backgroundColor: theme.palette.common.sidePanel,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 42,
                      width: 42,
                      borderRadius: 4,
                    }}
                  >
                    <EndCallIcon />
                  </Box>
                  <Box
                    style={{
                      display: "flex",
                      marginLeft: 12,
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Typography style={{ fontSize: 14, lineHeight: 1.5 }}>
                      End
                    </Typography>
                    <Typography
                      style={{
                        fontSize: "0.9rem",
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
              sendChatMessage(JSON.stringify({ type: "END_CALL", data: {} }));
              setTimeout(() => {
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
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [defaultBrandLogoUrl, setDefaultBrandLogoUrl] = useState(null);

  const {
    chatEnabled,
    screenShareEnabled,
    canChangeLiveStreamConfig,
    pollEnabled,
    whiteboardEnabled,
    participantCanToggleSelfWebcam,
    participantCanToggleSelfMic,
    raiseHandEnabled,
    recordingEnabled,
    brandingEnabled,
    brandLogoURL,
    brandName,
    participantCanLeave,
    poweredBy,
    canEndMeeting,
    animationsEnabled,
  } = useMeetingAppContext();
  console.log("canChangeLiveStreamConfig", canChangeLiveStreamConfig);

  const handleClickFAB = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseFAB = () => {
    setAnchorEl(null);
  };

  const isMobile = useIsMobile();
  const isTab = useIsTab();

  const theme = useTheme();
  const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });

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
      WHITEBOARD: "WHITEBOARD",
      STREAMS: "STREAMS",
      ADDLIVESTREAM: "ADD_LIVE_STREAM",
      CONFIGURATION: "CONFIGURATION",
    }),
    []
  );

  const topBarIcons = useMemo(() => {
    const arr = [];

    if (participantCanLeave || canEndMeeting) {
      arr.unshift([topBarButtonTypes.END_CALL]);
    }

    const arrSideBar = [];

    if (canChangeLiveStreamConfig) {
      arrSideBar.unshift(topBarButtonTypes.CONFIGURATION);
    }
    if (chatEnabled) {
      arrSideBar.unshift(topBarButtonTypes.CHAT);
    }
    arrSideBar.unshift(topBarButtonTypes.PARTICIPANTS);

    arr.unshift(arrSideBar);

    const arrMedia = [];
    if (screenShareEnabled) {
      arrMedia.unshift(topBarButtonTypes.SCREEN_SHARE);
    }
    if (participantCanToggleSelfWebcam) {
      arrMedia.unshift(topBarButtonTypes.WEBCAM);
    }
    if (participantCanToggleSelfMic) {
      arrMedia.unshift(topBarButtonTypes.MIC);
    }

    if (arrMedia.length) {
      arr.unshift(arrMedia);
    }

    const utilsArr = [];

    if (raiseHandEnabled) {
      utilsArr.unshift(topBarButtonTypes.RAISE_HAND);
    }

    if (recordingEnabled) {
      utilsArr.unshift(topBarButtonTypes.RECORDING);
    }

    if (whiteboardEnabled) {
      utilsArr.unshift(topBarButtonTypes.WHITEBOARD);
    }

    if (canChangeLiveStreamConfig) {
      utilsArr.unshift(topBarButtonTypes.ADDLIVESTREAM);
    }

    if (utilsArr.length) {
      arr.unshift(utilsArr);
    }
    return arr;
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
        backgroundColor: theme.palette.background.default,
        borderTop: "1px solid #ffffff33",
      }}
    >
      {(participantCanLeave || canEndMeeting) && (
        <Box>
          <EndCallBTN />
        </Box>
      )}
      {participantCanToggleSelfMic && (
        <Box ml={2}>
          <MicBTN />
        </Box>
      )}
      {participantCanToggleSelfWebcam && (
        <Box ml={2}>
          <WebcamBTN />
        </Box>
      )}
      {isPortrait ? (
        recordingEnabled ? (
          <Box ml={2}>
            <RecordingBTN />
          </Box>
        ) : chatEnabled ? (
          <Box ml={2}>
            <ChatBTN />
          </Box>
        ) : null
      ) : chatEnabled ? (
        <Box ml={2}>
          <ChatBTN />
        </Box>
      ) : null}
      {!isPortrait && recordingEnabled && (
        <Box ml={2}>
          <RecordingBTN />
        </Box>
      )}
      <Box ml={2}>
        <OutlineIconButton
          Icon={Boolean(anchorEl) ? CloseIcon : MoreHorizIcon}
          isFocused={anchorEl}
          onClick={handleClickFAB}
        />
      </Box>
      <Popover
        container={anchorEl?.current}
        PaperProps={{
          style: {
            backgroundColor: "transparent",
            boxShadow: "none",
          },
        }}
        className={classes.popover}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleCloseFAB}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Box>
          {raiseHandEnabled && (
            <Box mb={1.2}>
              <RaiseHandBTN onClick={handleCloseFAB} />
            </Box>
          )}
          <Box mb={1.2}>
            <ParticipantsBTN onClick={handleCloseFAB} />
          </Box>
          {canChangeLiveStreamConfig && (
            <Box mb={1.2}>
              <AddLiveStreamBTN onClick={handleCloseFAB} />
            </Box>
          )}
          {/* {(pollEnabled || whiteboardEnabled) && (
            <Box mb={1.2}>
              <ActivitiesBTN onClick={handleCloseFAB} />
            </Box>
          )} */}
          {whiteboardEnabled && (
            <Box mb={1.2}>
              <WhiteBoardBTN onClick={handleCloseFAB} />
            </Box>
          )}
          {screenShareEnabled && (
            <Box mb={1.2}>
              <ScreenShareBTN onClick={handleCloseFAB} />
            </Box>
          )}
          {canChangeLiveStreamConfig && (
            <Box mb={1.2}>
              <ConfigBTN onClick={handleCloseFAB} />
            </Box>
          )}
          {isPortrait && recordingEnabled && chatEnabled && (
            <Box mb={1.2}>
              <ChatBTN onClick={handleCloseFAB} />
            </Box>
          )}
        </Box>
      </Popover>
    </Box>
  ) : (
    <Box
      style={{
        height: topBarHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: theme.palette.background.default,
        borderBottom: "1px solid #ffffff33",
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
                height: topBarHeight - theme.spacing(2),
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

      <Box className={classes.row} p={2}>
        {topBarIcons.map((row, i) => {
          return (
            <React.Fragment key={`topbar_controls_i_${i}`}>
              {i !== 0 && (
                <Box
                  style={{
                    backgroundColor: "#ffffff33",
                    width: 1,
                    height: topBarHeight - theme.spacing(1.5),
                    flex: 1,
                  }}
                />
              )}
              <Box
                ml={i === 0 ? 0 : 3}
                mr={i === topBarIcons.length - 1 ? 0 : 3}
                className={classes.row}
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
                      ) : buttonType === topBarButtonTypes.RECORDING ? (
                        <RecordingBTN />
                      ) : buttonType === topBarButtonTypes.WHITEBOARD ? (
                        <WhiteBoardBTN />
                      ) : buttonType === topBarButtonTypes.STREAMS ? (
                        <StreamsBTN />
                      ) : buttonType === topBarButtonTypes.ADDLIVESTREAM ? (
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
