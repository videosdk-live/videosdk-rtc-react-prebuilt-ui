import { Box, useTheme } from "@material-ui/core";
import { useEffect, useMemo, useState } from "react";
import Lottie from "react-lottie";
import useResponsiveSize from "../../utils/useResponsiveSize";
import animationData from "../../../src/animations/wait_for_HLS_animation.json";
import stoppedHLSSnimationData from "../../../src/animations/stopped_HLS_animation.json";
import { appEvents, eventEmitter } from "../../utils/common";
import { appThemes, useMeetingAppContext } from "../../MeetingAppContextDef";
import Hls from "hls.js";
import useIsMobile from "../../utils/useIsMobile";
import { useRef } from "react";
import { Constants, useMeeting } from "@videosdk.live/react-sdk";

export async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const PlayerViewer = () => {
  const theme = useTheme();
  const isMobile = useIsMobile();
  const playerRef = useRef();

  const { hlsPlayerControlsVisible, afterMeetingJoinedHLSState, appTheme } =
    useMeetingAppContext();
  const { hlsUrls, hlsState } = useMeeting();
  const playHls = useMemo(() => {
    return (
      hlsUrls.playbackHlsUrl &&
      (hlsState == Constants.hlsEvents.HLS_PLAYABLE ||
        hlsState == Constants.hlsEvents.HLS_STOPPING)
    );
  }, [hlsUrls, hlsState]);

  const lottieSize = useResponsiveSize({
    xl: 240,
    lg: 240,
    md: 180,
    sm: 180,
    xs: 160,
  });

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const defaultOptionsStoppedHls = {
    loop: false,
    autoplay: true,
    animationData: stoppedHLSSnimationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    if (hlsUrls?.playbackHlsUrl && playHls) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          maxLoadingDelay: 1, // max video loading delay used in automatic start level selection
          defaultAudioCodec: "mp4a.40.2", // default audio codec
          maxBufferLength: 0, // If buffer length is/become less than this value, a new fragment will be loaded
          maxMaxBufferLength: 1, // Hls.js will never exceed this value
          startLevel: 0, // Start playback at the lowest quality level
          startPosition: -1, // set -1 playback will start from intialtime = 0
          maxBufferHole: 0.001, // 'Maximum' inter-fragment buffer hole tolerance that hls.js can cope with when searching for the next fragment to load.
          highBufferWatchdogPeriod: 0, // if media element is expected to play and if currentTime has not moved for more than highBufferWatchdogPeriod and if there are more than maxBufferHole seconds buffered upfront, hls.js will jump buffer gaps, or try to nudge playhead to recover playback.
          nudgeOffset: 0.05, // In case playback continues to stall after first playhead nudging, currentTime will be nudged evenmore following nudgeOffset to try to restore playback. media.currentTime += (nb nudge retry -1)*nudgeOffset
          nudgeMaxRetry: 1, // Max nb of nudge retries before hls.js raise a fatal BUFFER_STALLED_ERROR
          maxFragLookUpTolerance: 0.1, // This tolerance factor is used during fragment lookup.
          liveSyncDurationCount: 1, // if set to 3, playback will start from fragment N-3, N being the last fragment of the live playlist
          abrEwmaFastLive: 1, // Fast bitrate Exponential moving average half-life, used to compute average bitrate for Live streams.
          abrEwmaSlowLive: 3, // Slow bitrate Exponential moving average half-life, used to compute average bitrate for Live streams.
          abrEwmaFastVoD: 1, // Fast bitrate Exponential moving average half-life, used to compute average bitrate for VoD streams
          abrEwmaSlowVoD: 3, // Slow bitrate Exponential moving average half-life, used to compute average bitrate for VoD streams
          maxStarvationDelay: 1, // ABR algorithm will always try to choose a quality level that should avoid rebuffering
        });

        let player = document.querySelector("#hlsPlayer");

        hls.loadSource(hlsUrls?.playbackHlsUrl);
        hls.attachMedia(player);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {});
        hls.on(Hls.Events.ERROR, function (err) {
          console.log(err);
        });
      } else {
        if (typeof playerRef.current?.play === "function") {
          playerRef.current.src = hlsUrls?.playbackHlsUrl;
          playerRef.current.play();
        }
        // console.error("HLS is not supported");
      }
    }
  }, [hlsUrls, playHls]);

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        backgroundColor:
          appTheme === appThemes.DARK
            ? theme.palette.darkTheme.slightLighter
            : appTheme === appThemes.LIGHT
            ? theme.palette.lightTheme.two
            : theme.palette.background.default,
        position: "relative",
        overflow: "hidden",
        borderRadius: theme.spacing(1),
      }}
      onDoubleClick={() => {
        eventEmitter.emit(appEvents["toggle-full-screen"]);
      }}
    >
      {hlsUrls?.playbackHlsUrl && playHls ? (
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <video
            ref={playerRef}
            id="hlsPlayer"
            controls={isMobile ? true : hlsPlayerControlsVisible}
            autoPlay={true}
            muted={true}
            playsinline
            playsInline
            playing
            style={{ width: "100%", height: "100%" }}
          />
        </Box>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
            // backgroundColor: theme.palette.background.paper,
          }}
        >
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              position: "absolute",
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Lottie
              options={
                afterMeetingJoinedHLSState === "STOPPED"
                  ? defaultOptionsStoppedHls
                  : defaultOptions
              }
              eventListeners={[{ eventName: "done" }]}
              height={lottieSize}
              width={lottieSize}
            />
            <h2
              style={{
                color:
                  appTheme === appThemes.LIGHT
                    ? theme.palette.lightTheme.contrastText
                    : "white",
                marginTop: 0,
                marginBottom: 4,
                textAlign: "center",
              }}
            >
              {afterMeetingJoinedHLSState === "STOPPED"
                ? "Host has stopped the live streaming."
                : "Waiting for host to start live stream."}
            </h2>
            {afterMeetingJoinedHLSState !== "STOPPED" && (
              <h2
                style={{
                  color:
                    appTheme === appThemes.LIGHT
                      ? theme.palette.lightTheme.contrastText
                      : "white",
                  marginTop: 0,
                  textAlign: "center",
                }}
              >
                Meanwhile, take a few deep breaths.
              </h2>
            )}
          </Box>
        </div>
      )}
    </div>
  );
};

export default PlayerViewer;
