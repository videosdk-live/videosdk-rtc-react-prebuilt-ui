import React, { useMemo, useState } from "react";
import robot from "../animations/robot.json";
import Lottie from "react-lottie";
import { Typography, Box, Button } from "@material-ui/core";
import useResponsiveSize from "../utils/useResponsiveSize";
import useWindowSize from "../utils/useWindowSize";

const ClickAnywhereToContinue = ({ onClick, title, brandLogoURL }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: robot,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const [brandLogoErr, setBrandLogoErr] = useState(false);
  const jsonSize = useResponsiveSize({
    xl: 320,
    lg: 280,
    md: 240,
    sm: 200,
    xs: 180,
  });

  const { height: windowHeight, width: windowWidth } = useWindowSize();

  const bgImageHeight = 1536;
  const bgImageWidth = 2732;

  const { imageWidth, imageHeight } = useMemo(() => {
    const constantWidth =
      bgImageHeight / bgImageWidth <= windowHeight / windowWidth;

    const imageWidth = constantWidth
      ? windowWidth
      : (bgImageWidth * windowHeight) / bgImageHeight;

    const imageHeight = (imageWidth * bgImageHeight) / bgImageWidth;

    return { imageWidth, imageHeight };
  }, [windowHeight, windowWidth]);

  return (
    <div
      style={{
        height: windowHeight,
        width: windowWidth,
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            height: imageHeight,
            width: imageWidth,
            backgroundImage: `url(https://static.videosdk.live/prebuilt/space-background.png)`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {brandLogoErr || !brandLogoURL ? (
            <Lottie
              options={defaultOptions}
              eventListeners={[{ eventName: "done" }]}
              height={jsonSize}
              width={jsonSize}
              isClickToPauseDisabled
            />
          ) : (
            <img
              style={{
                height: jsonSize,
                width: jsonSize,
              }}
              src={brandLogoURL}
              onError={(err) => {
                console.log(err, "erer");
                setBrandLogoErr(true);
              }}
            />
          )}
          <Box mt={5}>
            {typeof onClick === "function" ? (
              <Button
                size={"large"}
                variant="contained"
                color={"primary"}
                style={{ fontWeight: "bold" }}
                onClick={onClick}
              >
                JOIN THE MEETING
              </Button>
            ) : (
              <Typography variant="h4">{title}</Typography>
            )}
          </Box>
        </div>
      </div>
    </div>
  );
};

export default ClickAnywhereToContinue;
