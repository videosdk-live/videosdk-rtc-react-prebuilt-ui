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
      hlsUrls.downstreamUrl &&
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
    if (hlsUrls?.downstreamUrl && playHls) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          capLevelToPlayerSize: true,
          maxLoadingDelay: 4,
          minAutoBitrate: 0,
          autoStartLoad: true,
          defaultAudioCodec: "mp4a.40.2",
        });

        let player = document.querySelector("#hlsPlayer");

        hls.loadSource(hlsUrls?.downstreamUrl);
        hls.attachMedia(player);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {});
        hls.on(Hls.Events.ERROR, function (err) {
          console.log(err);
        });
      } else {
        if (typeof playerRef.current?.play === "function") {
          playerRef.current.src = hlsUrls?.downstreamUrl;
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
      {hlsUrls?.downstreamUrl && playHls ? (
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
