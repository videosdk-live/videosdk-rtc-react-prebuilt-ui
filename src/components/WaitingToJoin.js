import React from "react";
import useResponsiveSize from "../utils/useResponsiveSize";
import animationData from "../../src/animations/join_meeting.json";
import Lottie from "react-lottie";

const WaitingToJoin = () => {
  const lottieSize = useResponsiveSize({
    xl: 500,
    lg: 500,
    md: 400,
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
      <Lottie
        options={defaultOptions}
        eventListeners={[{ eventName: "done" }]}
        height={lottieSize}
        width={lottieSize}
      />
    </div>
  );
};

export default WaitingToJoin;
