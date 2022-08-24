import React, { useEffect, useRef, useState } from "react";
import useResponsiveSize from "../utils/useResponsiveSize";
import animationData from "../../src/animations/join_meeting.json";
import Lottie from "react-lottie";
import { Box } from "@material-ui/core";
import { useMeetingAppContext } from "../MeetingAppContextDef";

const WaitingToJoin = () => {
  const { waitingScreenImageUrl, waitingScreenText } = useMeetingAppContext();

  const waitingMessages = [
    { index: 0, text: "Creating a room for you..." },
    { index: 1, text: "Almost there..." },
  ];
  const [message, setMessage] = useState(waitingMessages[0]);

  const extension = waitingScreenImageUrl?.substring(
    waitingScreenImageUrl?.lastIndexOf(".") + 1
  );

  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setMessage((s) =>
        s.index === waitingMessages.length - 1
          ? s
          : waitingMessages[s.index + 1]
      );
    }, 3000);

    return () => {
      clearInterval(intervalRef.current);
    };
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
    path: waitingScreenImageUrl,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const animationDefaultOptions = {
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
      {waitingScreenImageUrl?.length || waitingScreenText?.length ? (
        <Box style={{ display: "flex", flexDirection: "column" }}>
          {waitingScreenImageUrl?.length ? (
            extension === "json" ? (
              <Lottie
                options={defaultOptions}
                eventListeners={[{ eventName: "done" }]}
                height={lottieSize}
                width={lottieSize}
              />
            ) : (
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  alt={"waiting screen image"}
                  style={{
                    height: lottieSize,
                    width: lottieSize,
                  }}
                  src={waitingScreenImageUrl}
                  onError={(err) => {
                    console.log(err, "image err");
                  }}
                />
              </Box>
            )
          ) : null}
          {waitingScreenText?.length ? (
            <h2 style={{ color: "white", marginTop: 4, textAlign: "center" }}>
              {waitingScreenText}
            </h2>
          ) : null}
        </Box>
      ) : (
        <Box style={{ display: "flex", flexDirection: "column" }}>
          <Lottie
            options={animationDefaultOptions}
            eventListeners={[{ eventName: "done" }]}
            height={lottieSize}
            width={lottieSize}
          />
          <h2 style={{ color: "white", marginTop: 4, textAlign: "center" }}>
            {message.text}
          </h2>
        </Box>
      )}
    </div>
  );
};

export default WaitingToJoin;
