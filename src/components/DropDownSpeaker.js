import React, { useState, useRef } from "react";
import {
  Popover,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Box,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/system";
import { SelectedIcon, ChevronDownIcon } from "../icons";
import DropSpeaker from "../icons/DropDown/DropSpeaker";
import TestSpeaker from "../icons/DropDown/TestSpeaker";
import { appThemes, useMeetingAppContext } from "../MeetingAppContextDef";

// Styled components
const StyledPopoverButton = styled(Button, {
  shouldForwardProp: (prop) =>
    prop !== "isOpen" && prop !== "isHovered" && prop !== "isLight",
})(({ theme, isOpen, isHovered, disabled, isLight }) => {
  const palette = isLight ? theme.palette.lightTheme : theme.palette.darkTheme;
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: 400,
    textTransform: "none",
    color: isOpen
      ? isLight
        ? palette.contrastText
        : palette.one
      : isLight
        ? palette.four
        : palette.contrastText,
    backgroundColor: isOpen
      ? isLight
        ? palette.two
        : theme.palette.common.black
      : "transparent",
    border: "1px solid transparent",
    outline: isOpen ? `1px solid ${palette.five}` : "none",
    "&:hover": {
      backgroundColor: disabled
        ? "transparent"
        : isLight
          ? palette.two
          : theme.palette.common.black,
      borderColor: disabled ? "transparent" : palette.three,
      outline: disabled ? "none" : `1px solid ${palette.five}`,
    },
    opacity: disabled ? 0.5 : 1,
    "&:focus": {
      outline: "none",
    },
    "&.Mui-disabled": {
      color: palette.four,
    },
  };
});

const StyledPopover = styled(Popover, {
  shouldForwardProp: (prop) => prop !== "isLight",
})(({ theme, isLight }) => ({
  "& .MuiPaper-root": {
    backgroundColor: isLight
      ? theme.palette.lightTheme.main
      : theme.palette.darkTheme.eight,
    borderRadius: "8px",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)",
    marginBottom: "8px",
  },
}));

const StyledListItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== "isLight",
})(({ theme, isLight }) => ({
  padding: "4px 16px 4px 8px",
  color: isLight
    ? theme.palette.lightTheme.contrastText
    : theme.palette.common.white,
}));

export default function DropDownSpeaker({
  speakers,
  selectedSpeaker: selectedSpeakerProp,
  setSelectedSpeaker: setSelectedSpeakerProp,
  isMicrophonePermissionAllowed,
  appTheme: appThemeProp,
}) {
  const ctx = useMeetingAppContext();

  const setSelectedSpeaker =
    setSelectedSpeakerProp ?? ctx?.setSelectedSpeaker ?? (() => {});
  const selectedSpeaker = selectedSpeakerProp ?? ctx?.selectedSpeaker ?? {};
  const appTheme = appThemeProp ?? ctx?.appTheme;
  const isLight = appTheme === appThemes.LIGHT;
  const theme = useTheme();

  const [audioProgress, setAudioProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const audioRef = useRef(null);
  const anchorWidthRef = useRef(null);

  const open = Boolean(anchorEl);

  const timeupdateHandlerRef = useRef(null);
  const endedHandlerRef = useRef(null);

  const cleanupAudioListeners = () => {
    if (audioRef.current) {
      if (timeupdateHandlerRef.current) {
        audioRef.current.removeEventListener(
          "timeupdate",
          timeupdateHandlerRef.current
        );
      }
      if (endedHandlerRef.current) {
        audioRef.current.removeEventListener("ended", endedHandlerRef.current);
      }
    }
    timeupdateHandlerRef.current = null;
    endedHandlerRef.current = null;
  };

  const testSpeakers = () => {
    // If already playing, stop it
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      cleanupAudioListeners();
      audioRef.current = null;
      setAudioProgress(0);
      setIsPlaying(false);
      return;
    }

    const selectedSpeakerDeviceId = selectedSpeaker?.id;
    // Stop any previous audio just in case
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      cleanupAudioListeners();
    }
    // const audio = new Audio(`https://static.videosdk.live/prebuilt/test_sound.mp3`);
    const audio = new Audio(`${process.env.PUBLIC_URL || ""}/test_sound.mp3`);
    audioRef.current = audio;

    const onTimeUpdate = () => {
      const progress = (audio.currentTime / audio.duration) * 100;
      setAudioProgress(progress);
    };
    const onEnded = () => {
      setAudioProgress(0);
      setIsPlaying(false);
      cleanupAudioListeners();
      audioRef.current = null;
    };

    timeupdateHandlerRef.current = onTimeUpdate;
    endedHandlerRef.current = onEnded;

    const startPlay = () => {
      audio.play();
      setIsPlaying(true);
      audio.addEventListener("timeupdate", onTimeUpdate);
      audio.addEventListener("ended", onEnded);
    };

    try {
      if (selectedSpeakerDeviceId && audio.setSinkId) {
        audio
          .setSinkId(selectedSpeakerDeviceId)
          .then(startPlay)
          .catch((error) => {
            console.error("Failed to set sinkId:", error);
            startPlay();
          });
      } else {
        startPlay();
      }
    } catch (error) {
      console.log(error);
      startPlay();
    }
  };

  const handleClick = (event) => {
    anchorWidthRef.current = event.currentTarget.offsetWidth;
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setAudioProgress(0);
    setIsPlaying(false);
    cleanupAudioListeners();
    audioRef.current = null;
  };

  return (
    <Box
      sx={{
        width: "100%",
        cursor:
          isMicrophonePermissionAllowed === true ? "pointer" : "not-allowed",
      }}
    >
      <StyledPopoverButton
        onMouseEnter={() =>
          isMicrophonePermissionAllowed === true ? setIsHovered(true) : null
        }
        onMouseLeave={() => setIsHovered(false)}
        disabled={isMicrophonePermissionAllowed !== true}
        isOpen={open}
        isHovered={isHovered}
        isLight={isLight}
        onClick={
          isMicrophonePermissionAllowed === true ? handleClick : undefined
        }
        sx={{
          pointerEvents:
            isMicrophonePermissionAllowed === true ? "auto" : "none",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <DropSpeaker
            style={{
              marginBottom: "2.5px",
            }}
            fillColor={isHovered || open ? "#FFF" : "#B4B4B4"}
          />
          <Typography
            sx={{
              ml: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
            }}
          >
            {isMicrophonePermissionAllowed === true
              ? selectedSpeaker?.label
              : "Permission Needed"}
          </Typography>
          <ChevronDownIcon
            style={{
              marginLeft: "10px",
              height: "20px",
              width: "20px",
              // marginTop: "2px",
              color: open ? "#FFF" : "#B4B4B4",
            }}
          />
        </Box>
      </StyledPopoverButton>

      <StyledPopover
        isLight={isLight}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        sx={{
          "& .MuiPaper-root": {
            width: anchorWidthRef.current ?? "auto",
          },
        }}
      >
        <List sx={{ py: 0 }}>
          {speakers.map((item, index) => {
            return (
              item?.kind === "audiooutput" && (
                <StyledListItem
                  key={`speaker_${index}`}
                  isLight={isLight}
                  disablePadding
                >
                  <Box
                    sx={{
                      width: "24px",
                      mr: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {selectedSpeaker?.label === item?.label && (
                      <SelectedIcon style={{ height: "20px", width: "20px" }} />
                    )}
                  </Box>
                  <ListItemButton
                    onClick={() => {
                      setSelectedSpeaker((s) => ({
                        ...s,
                        id: item?.deviceId,
                        label: item?.label,
                      }));
                    }}
                    sx={{ py: 0.5, px: 0 }}
                  >
                    <ListItemText
                      primary={
                        item?.label ? item?.label : `Speaker ${index + 1}`
                      }
                    />
                  </ListItemButton>
                </StyledListItem>
              )
            );
          })}

          {speakers.length > 0 && (
            <>
              <Divider
                sx={{
                  borderColor: isLight
                    ? theme.palette.lightTheme.three
                    : theme.palette.darkTheme.seven,
                  my: 1,
                  mx: 2,
                }}
              />
              <Box
                sx={{
                  my: 1,
                  pl: 2,
                  pr: 1,
                  color: isLight
                    ? theme.palette.lightTheme.contrastText
                    : theme.palette.common.white,
                }}
              >
                <Button
                  onClick={testSpeakers}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    justifyContent: "flex-start",
                    textTransform: "none",
                    color: isLight
                      ? theme.palette.lightTheme.contrastText
                      : theme.palette.common.white,
                    p: 0.5,
                    pl: 0.5,
                    mb: 0.5,
                    "&:focus": {
                      outline: "none",
                    },
                    "&:hover": {
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 1.5,
                    }}
                  >
                    <TestSpeaker />
                  </Box>
                  <Box sx={{ width: "90%", alignItems: "center" }}>
                    {isPlaying ? (
                      <Box
                        sx={{
                          width: "90%",
                          mt: 0,
                          backgroundColor: "#6F767E",
                          borderRadius: "9999px",
                          height: "8px",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{
                            backgroundColor: "#FFF",
                            opacity: 0.5,
                            height: "8px",
                            borderRadius: "9999px",
                            width: `${audioProgress}%`,
                          }}
                        />
                      </Box>
                    ) : (
                      <Typography>Test Speakers</Typography>
                    )}
                  </Box>
                </Button>
              </Box>
            </>
          )}
        </List>
      </StyledPopover>
    </Box>
  );
}
