import React, { useEffect, useState } from "react";
import useResponsiveSize from "../utils/useResponsiveSize";
import animationData from "../../src/animations/join_meeting.json";
import Lottie from "react-lottie";
import { Box } from "@material-ui/core";

const WaitingToJoin = () => {
  const waitingMessages = [
    { index: 0, text: "Creating a room for you..." },
    { index: 1, text: "Almost there..." },
  ];
  const [message, setMessage] = useState(waitingMessages[0]);

  useEffect(() => {
    setInterval(() => {
      setMessage((s) =>
        s.index === waitingMessages.length - 1
          ? s
          : waitingMessages[s.index + 1]
      );
    }, 2000);
  }, []);

  const lottieSize = useResponsiveSize({
    xl: 250,
    lg: 250,
    md: 200,
    sm: 200,
    xs: 180,
  });

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Box style={{ display: "flex", flexDirection: "column" }}>
        <Lottie
          options={defaultOptions}
          eventListeners={[{ eventName: "done" }]}
          height={lottieSize}
          width={lottieSize}
        />
        <h2 style={{ color: "white", marginTop: 4, textAlign: "center" }}>
          {message.text}
        </h2>
      </Box>
    </div>
  );
};

export default WaitingToJoin;
