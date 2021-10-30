import React from "react";
import robot from "../animations/robot.json";
import Lottie from "react-lottie";
import { Typography, Box } from "@material-ui/core";
import useResponsiveSize from "../utils/useResponsiveSize";

const ClickAnywhereToContinue = ({ onClick, title }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: robot,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const jsonSize = useResponsiveSize({
    xl: 320,
    lg: 280,
    md: 240,
    sm: 200,
    xs: 180,
  });

  return (
    <div
      onClick={onClick}
      id={"checkuserinteractionelementid"}
      style={{
        height: "100vh",
        width: "100vw",
        backgroundImage: `url(https://static.zujonow.com/prebuilt/space-background.png)`,
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
        backgroundSize: "100% 100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Lottie
        options={defaultOptions}
        eventListeners={[{ eventName: "done" }]}
        height={jsonSize}
        width={jsonSize}
      />
      <Box mt={5}>
        <Typography variant="h4" style={{}}>
          {title}
        </Typography>
      </Box>
    </div>
  );
};

export default ClickAnywhereToContinue;
