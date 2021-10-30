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
import {
  Activities,
  Chat,
  EndCall,
  Participants,
  ScreenRecording,
  ScreenShare,
} from "../icons";
import MicOffIcon from "@material-ui/icons/MicOff";
import MicIcon from "@material-ui/icons/Mic";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import VideocamIcon from "@material-ui/icons/Videocam";
import { useMeeting } from "@videosdk.live/react-sdk";
import { sideBarModes, useMeetingAppContext } from "../MeetingAppContextDef";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import CloseIcon from "@material-ui/icons/Close";
import useIsTab from "../utils/useIsTab";
import useIsMobile from "../utils/useIsMobile";
import RaiseHand from "../icons/RaiseHand";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import {
  isMobile as RDDIsMobile,
  isTablet as RDDIsTablet,
} from "react-device-detect";

const useStyles = makeStyles({
  row: { display: "flex", alignItems: "center" },
  borderRight: { borderRight: "1ps solid #ffffff33" },
  popover: { backgroundColor: "transparent" },
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
const ScreenShareBTN = ({ onClick }) => {
  const mMeeting = useMeeting({});

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
        // isTab || isMobile
        //   ? true
        //   :

        RDDIsMobile || RDDIsTablet
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
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
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
            <Tooltip
              placement="bottom"
              title={localMicOn ? "Change microphone" : null}
            >
              <IconButton
                disabled={!localMicOn}
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
          {mics.map(({ deviceId, label }) => (
            <MenuItem
              key={`output_mics_${deviceId}`}
              selected={deviceId === selectedDeviceId}
              onClick={() => {
                handleClose();
                setSelectedDeviceId(deviceId);
                changeMic(deviceId);
              }}
            >
              {label}
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
    recordingEnabledByDefault,
    participantCanToggleRecording,
  } = useMeetingAppContext();

  useEffect(() => {
    if (recordingEnabledByDefault) {
      setDefaultRecordingActionTaken(true);
      setTimeout(() => {
        if (!defaultRecordingActionTaken) {
          startRecording(recordingWebhookUrl);
        }
      }, 5000);
    }
  }, [
    recordingWebhookUrl,
    defaultRecordingActionTaken,
    recordingEnabledByDefault,
    startRecording,
  ]);

  return (
    <OutlineIconButton
      Icon={ScreenRecording}
      onClick={() => {
        if (isRecording) {
          stopRecording();
        } else {
          startRecording(recordingWebhookUrl);
        }
      }}
      tooltipTitle={isRecording ? "Stop Recording" : "Start Recording"}
      isFocused={isRecording}
      disabled={!participantCanToggleRecording}
    />
  );
};

const WebcamBTN = () => {
  const theme = useTheme();
  const mMeeting = useMeeting({});

  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
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
            <Tooltip
              placement="bottom"
              title={localWebcamOn ? "Change webcam" : null}
            >
              <IconButton
                disabled={!localWebcamOn}
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
          {webcams.map(({ deviceId, label }) => (
            <MenuItem
              key={`output_webcams_${deviceId}`}
              selected={deviceId === selectedDeviceId}
              onClick={() => {
                handleClose();
                setSelectedDeviceId(deviceId);
                changeWebcam(deviceId);
              }}
            >
              {label}
            </MenuItem>
          ))}
        </MenuList>
      </Popover>
    </Box>
  );
};
const EndCallBTN = () => {
  const mMeeting = useMeeting({});

  const { endCallContainerRef } = useMeetingAppContext();
  const leave = mMeeting?.leave;

  const theme = useTheme();

  return (
    <OutlineIconButton
      ref={endCallContainerRef}
      tooltipTitle={"End call"}
      bgColor={theme.palette.error.main}
      Icon={EndCall}
      onClick={leave}
    />
  );
};

const TopBar = ({ topBarHeight }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [defaultBrandLogoUrl, setDefaultBrandLogoUrl] = useState(null);

  const {
    chatEnabled,
    screenShareEnabled,
    pollEnabled,
    whiteBoardEnabled,
    participantCanToggleSelfWebcam,
    participantCanToggleSelfMic,
    raiseHandEnabled,
    recordingEnabled,
    brandingEnabled,
    brandLogoURL,
    brandName,
    participantCanLeave,
    poweredBy,
  } = useMeetingAppContext();

  const handleClickFAB = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseFAB = () => {
    setAnchorEl(null);
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
    }),
    []
  );

  const topBarIcons = useMemo(() => {
    const arr = [];

    if (participantCanLeave) {
      arr.unshift([topBarButtonTypes.END_CALL]);
    }

    const arrSideBar = [];

    if (pollEnabled || whiteBoardEnabled) {
      arrSideBar.unshift(topBarButtonTypes.ACTIVITIES);
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

    if (utilsArr.length) {
      arr.unshift(utilsArr);
    }
    return arr;
  }, [
    participantCanToggleSelfMic,
    participantCanToggleSelfWebcam,
    screenShareEnabled,
    pollEnabled,
    whiteBoardEnabled,
    chatEnabled,
    raiseHandEnabled,
    topBarButtonTypes,
    recordingEnabled,
  ]);

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
      {participantCanLeave && (
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
      {chatEnabled && (
        <Box ml={2}>
          <ChatBTN />
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
            <Box mb={2}>
              <RaiseHandBTN onClick={handleCloseFAB} />
            </Box>
          )}
          <Box mb={2}>
            <ParticipantsBTN onClick={handleCloseFAB} />
          </Box>
          {(pollEnabled || whiteBoardEnabled) && (
            <Box mb={2}>
              <ActivitiesBTN onClick={handleCloseFAB} />
            </Box>
          )}
          {screenShareEnabled && (
            <Box mb={2}>
              <ScreenShareBTN onClick={handleCloseFAB} />
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
                `https://static.zujonow.com/prebuilt/videosdk_logo_circle.png`
              }
              onError={() => {
                setDefaultBrandLogoUrl(
                  `https://static.zujonow.com/prebuilt/videosdk_logo_circle.png`
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
