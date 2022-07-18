import { Box, useTheme } from "@material-ui/core";
import { useEffect, useState } from "react";
import Lottie from "react-lottie";
import ReactPlayer from "react-player";
import useResponsiveSize from "../../utils/useResponsiveSize";
import animationData from "../../../src/animations/wait_for_HLS_animation.json";

const PlayerViewer = ({ downstreamUrl }) => {
  const theme = useTheme();

  const [canPlay, setCanPlay] = useState(false);

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

  async function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  async function waitForHLSPlayable(downstreamUrl, maxRetry) {
    return new Promise(async (resolve, reject) => {
      if (maxRetry < 1) {
        return reject(false);
      }

      let status;

      try {
        const res = await fetch(downstreamUrl, {
          method: "GET",
        });
        status = res.status;
      } catch (err) {
        const mute = err;
      }

      if (status === 200) {
        return resolve(true);
      }

      await sleep(1000);

      return resolve(
        await waitForHLSPlayable(downstreamUrl, maxRetry - 1).catch((err) => {
          const mute = err;
        })
      );
    });
  }

  const checkHLSPlayable = async (downstreamUrl) => {
    const canPlay = await waitForHLSPlayable(downstreamUrl, 20);

    if (canPlay) {
      setCanPlay(true);
    } else {
      setCanPlay(false);
    }
  };

  useEffect(async () => {
    if (downstreamUrl) {
      checkHLSPlayable(downstreamUrl);
    }
  }, [downstreamUrl]);

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        backgroundColor: theme.palette.background.default,
        position: "relative",
        overflow: "hidden",
        borderRadius: theme.spacing(1),
      }}
      className={"video-contain"}
    >
      {downstreamUrl && canPlay ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
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
            <ReactPlayer
              playsinline
              playIcon={<></>}
              pip={false}
              light={false}
              controls={false}
              muted={true}
              playing={true}
              loop={true}
              url={downstreamUrl}
              height={"100%"}
              width={"100%"}
              style={
                {
                  // filter: isLocal ? "blur(1rem)" : undefined,
                }
              }
            />
          </Box>
        </div>
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
              options={defaultOptions}
              eventListeners={[{ eventName: "done" }]}
              height={lottieSize}
              width={lottieSize}
            />
            <h2
              style={{
                color: "white",
                marginTop: 0,
                marginBottom: 4,
                textAlign: "center",
              }}
            >
              Waiting for host to start live stream.
            </h2>
            <h2 style={{ color: "white", marginTop: 0, textAlign: "center" }}>
              Meanwhile, take a few deep breaths.
            </h2>
          </Box>
        </div>
      )}
    </div>
  );
};

export default PlayerViewer;
