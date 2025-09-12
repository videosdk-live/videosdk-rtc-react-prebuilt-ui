import React, { useEffect, useMemo, useRef, useState } from "react";
import { ScreenShare } from "@mui/icons-material";
import { useMeeting, useParticipant, VideoPlayer } from "@videosdk.live/react-sdk";
import { Box, Button, Typography, useTheme } from "@mui/material";
import ParticipantViewer, { CornerDisplayName } from "./ParticipantViewer";
import useIsMobile from "../../utils/useIsMobile";
import {
  appEvents,
  eventEmitter,
  getGridForMainParticipants,
  getGridRowsAndColumns,
  localAndPinnedOnTop,
} from "../../utils/common";
import {
  meetingLayouts,
  appThemes,
  useMeetingAppContext,
} from "../../MeetingAppContextDef";
import { useMediaQuery } from "react-responsive";

const PresenterView = ({ presenterId }) => {
  const mMeeting = useMeeting();
  const {
    webcamOn,
    micOn,
    isLocal,
    // screenShareStream,
    screenShareAudioStream,
    screenShareOn,
    displayName,
    pin,
    unpin,
    pinState,
  } = useParticipant(presenterId);
  const toggleScreenShare = mMeeting?.toggleScreenShare;
  const localParticipantId = mMeeting?.localParticipant?.id;
  const pinnedParticipants = mMeeting?.pinnedParticipants;

  const isMobile = useIsMobile();
  const {
    selectedOutputDeviceId,
    setOverlaidInfoVisible,
    mainViewParticipants,
    meetingLayout,
    animationsEnabled,
    appTheme,
  } = useMeetingAppContext();
  const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });

  const theme = useTheme();

  const [mouseOver, setMouseOver] = useState(false);

  const mobilePortrait = isMobile && isPortrait;

  const { singleRow } = useMemo(() => {
    let mainParticipants = [...mainViewParticipants];

    const participants = localAndPinnedOnTop({
      localParticipantId,
      participants: mainParticipants,
      pinnedParticipantIds: [...pinnedParticipants.keys()],
      moveLocalUnpinnedOnTop:
        pinnedParticipants.size && meetingLayout !== meetingLayouts.GRID
          ? false
          : true,
    });

    const splicesActiveParticipants = participants.splice(0, 4);

    const gridInfo = getGridRowsAndColumns({
      participantsCount: splicesActiveParticipants.length,
    });

    return getGridForMainParticipants({
      participants: splicesActiveParticipants,
      gridInfo,
    });
  }, [
    mainViewParticipants,
    localParticipantId,
    pinnedParticipants,
    meetingLayout,
  ]);

  const audioPlayer = useRef();

  useEffect(() => {
    if (
      !isLocal &&
      audioPlayer.current &&
      screenShareOn &&
      screenShareAudioStream
    ) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(screenShareAudioStream.track);

      audioPlayer.current.srcObject = mediaStream;
      try {
        audioPlayer.current.setSinkId(selectedOutputDeviceId);
      } catch (error) {
        console.log("error", error);
      }
      audioPlayer.current.play().catch((err) => {
        if (
          err.message ===
          "play() failed because the user didn't interact with the document first. https://goo.gl/xX8pDD"
        ) {
          console.error("audio" + err.message);
        }
      });
    } else {
      audioPlayer.current.srcObject = null;
    }
  }, [screenShareAudioStream, screenShareOn, isLocal, selectedOutputDeviceId]);

  return (
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
        position: "relative",
        height: "100%",
        width: "100%",
        backgroundColor:
          appTheme === appThemes.DARK
            ? theme.palette.darkTheme.slightLighter
            : appTheme === appThemes.LIGHT
              ? theme.palette.lightTheme.two
              : "black",
        alignItems:
          mobilePortrait && meetingLayout !== meetingLayouts.SPOTLIGHT
            ? undefined
            : "center",
        justifyContent:
          mobilePortrait && meetingLayout !== meetingLayouts.SPOTLIGHT
            ? undefined
            : "center",
        display:
          mobilePortrait && meetingLayout !== meetingLayouts.SPOTLIGHT
            ? undefined
            : "flex",
      }}
    >
      <audio autoPlay playsInline controls={false} ref={audioPlayer} />

      <div
        style={{
          height: mobilePortrait ? "50%" : "100%",
          width: "100%",
          position: "relative",
        }}
        className={"video-contain"}
      >
        <>
          <VideoPlayer
            participantId={presenterId}
            type="share"
            containerStyle={{
              height: "100%",
              width: "100%",
            }}
            className={`h-full`}
            classNameVideo={`h-full`}
            videoStyle={{
              filter: isLocal ? "blur(1rem)" : undefined,
            }}
          />
        </>
        {isLocal && (
          <Box
            p={5}
            style={{
              borderRadius: theme.spacing(2),
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              backgroundColor:
                appTheme === appThemes.DARK
                  ? theme.palette.darkTheme.slightLighter
                  : appTheme === appThemes.LIGHT
                    ? theme.palette.lightTheme.two
                    : "#333244",
            }}
          >
            <ScreenShare
              style={{
                color:
                  appTheme === appThemes.LIGHT
                    ? theme.palette.lightTheme.contrastText
                    : theme.palette.common.white,
                height: theme.spacing(6),
                width: theme.spacing(6),
              }}
            />
            <Box mt={2}>
              <Typography
                variant="h6"
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  color:
                    appTheme === appThemes.LIGHT
                      ? theme.palette.lightTheme.contrastText
                      : theme.palette.common.white,
                }}
              >
                You are presenting to everyone
              </Typography>
            </Box>
            <Box mt={4}>
              <Button
                variant="contained"
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleScreenShare();
                }}
                style={{
                  transition: `all ${200 * (animationsEnabled ? 1 : 0.5)}ms`,
                  transitionTimingFunction: "linear",
                  backgroundColor:
                    appTheme === appThemes.LIGHT || appTheme === appThemes.DARK
                      ? theme.palette.lightTheme.primaryMain
                      : theme.palette.primary.main,
                }}
              >
                Stop presenting
              </Button>
            </Box>
          </Box>
        )}
      </div>
      <CornerDisplayName
        {...{
          isLocal,
          displayName,
          micOn,
          webcamOn,
          pin,
          unpin,
          pinState,
          isPresenting: true,
          participantId: presenterId,
          mouseOver,
        }}
      />
      {mobilePortrait && meetingLayout !== meetingLayouts.SPOTLIGHT ? (
        <div
          style={{
            height: "50%",
            width: "100%",
            display: "flex",
            position: "relative",
          }}
        >
          {singleRow.map(
            ({
              participantId,
              relativeHeight,
              relativeWidth,
              relativeTop,
              relativeLeft,
            }) => {
              return (
                <div
                  style={{
                    padding: 8,
                    position: "absolute",
                    top: `${relativeTop}%`,
                    left: `${relativeLeft}%`,
                    width: `${relativeWidth}%`,
                    height: `${relativeHeight}%`,
                  }}
                  key={`presenter_participant_${participantId}`}
                >
                  <div
                    style={{
                      height: `calc(100% - ${2 * 8}px)`,
                      width: `calc(100% - ${2 * 8}px)`,
                    }}
                  >
                    <ParticipantViewer
                      participantId={participantId}
                      quality={"low"}
                    />
                  </div>
                </div>
              );
            }
          )}
        </div>
      ) : null}
    </div>
  );
};

export default PresenterView;
