import { Box, Typography, useMediaQuery, useTheme } from "@material-ui/core";
import {
  createCameraVideoTrack,
  useMeeting,
  useParticipant,
} from "@videosdk.live/react-sdk";
import { useMemo, useRef } from "react";
import ReactPlayer from "react-player";
import { appThemes, useMeetingAppContext } from "../../../MeetingAppContextDef";
import useIsLGDesktop from "../../../utils/useIsLGDesktop";
import useIsTab from "../../../utils/useIsTab";
import useResponsiveSize from "../../../utils/useResponsiveSize";
import DesktopBackgroundSection from "./DesktopBackgroundSection";
import LGDesktopBackgroundSection from "./LGDesktopBackgroundSection";
import TabBackgroundSection from "./TabBackgroundSection";
// import { VideoSDKNoiseSuppressor } from "videosdk-processor";

export const SingleRow = ({ arr, blur, topSpacing, videoProcessor, isTab }) => {
  const Width = useResponsiveSize({
    xl: 102,
    lg: 98,
    md: 98,
    sm: 90,
    xs: 90,
  });
  const mMeeting = useMeeting();
  const changeWebcam = mMeeting?.changeWebcam;

  const participantId = mMeeting?.localParticipant?.id;

  const { isLocal } = useParticipant(participantId, {});

  const flipStyle = useMemo(
    () =>
      isLocal ? { transform: "scaleX(-1)", WebkitTransform: "scaleX(-1)" } : {},
    [isLocal]
  );

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "row",
        // justifyContent: "space-between",
        marginTop: topSpacing && isTab ? 14 : 8,
      }}
    >
      {arr.map(({ imageUrl, displayImageUrl }, i) => {
        return (
          <Box
            onClick={async () => {
              if (!videoProcessor.ready) {
                await videoProcessor.init();
              }
              let config = {};
              if (i === 0 && blur) {
                videoProcessor.stop();
                const stream = await createCameraVideoTrack({});
                changeWebcam(stream);
                return;
              }
              if (i === 1 && blur) {
                config.type = "blur";
              } else {
                config = {
                  type: "image",
                  imageUrl: displayImageUrl,
                };
              }

              if (!videoProcessor.processorRunning) {
                const stream = await createCameraVideoTrack({});
                const processedStream = await videoProcessor.start(
                  stream,
                  config
                );
                changeWebcam(processedStream);
              } else {
                videoProcessor.updateProcessorConfig(config);
              }
            }}
            style={{
              display: "flex",
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              borderRadius: 4,
              marginLeft: i === 0 ? 0 : 8,
            }}
          >
            {imageUrl && (
              <img
                style={flipStyle}
                id={`virtualBgImage_${i}`}
                src={imageUrl}
                width={Width}
              />
            )}
          </Box>
        );
      })}
    </Box>
  );
};

const BackgroundSelection = ({ padding, theme }) => {
  const { appTheme, videoProcessor } = useMeetingAppContext();
  const isXStoSM = useMediaQuery(theme.breakpoints.between("xs", "sm"));
  const isXSOnly = useMediaQuery(theme.breakpoints.only("xs"));

  const videoPlayer = useRef();

  const isLGDesktop = useIsLGDesktop();
  const isTab = useIsTab();

  const mMeeting = useMeeting();
  const participantId = mMeeting?.localParticipant?.id;

  const { webcamStream, webcamOn, isLocal } = useParticipant(participantId, {});

  const mediaStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);

  const flipStyle = useMemo(
    () =>
      isLocal ? { transform: "scaleX(-1)", WebkitTransform: "scaleX(-1)" } : {},
    [isLocal]
  );

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      <Box style={{ margin: padding }}>
        <Box style={{ position: "relative" }}>
          <Box
            style={{
              flex: 1,
              display: "flex",
              width: isXStoSM ? "100%" : "100%",
              height: isXStoSM ? "100%" : "100%",
              paddingTop: !isXSOnly ? "56.25%" : "56.25%",
              position: "relative",
              borderRadius: theme.spacing(1 / 4),
              overflow: "hidden",
              // alignItems: isXStoSM && "center",
              // justifyContent: isXStoSM && "center",
            }}
          >
            <Box
              style={{
                position: !isXSOnly ? "absolute" : "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: theme.palette.darkTheme.main,
                display: "flex",
                flexDirection: "column",
                borderRadius: theme.spacing(1),
                overflow: "hidden",
                // alignItems: isXStoSM && "center",
                // justifyContent: isXStoSM && "center",
              }}
            >
              {webcamOn ? (
                <ReactPlayer
                  ref={videoPlayer}
                  //
                  playsinline // very very imp prop
                  playIcon={<></>}
                  //
                  pip={false}
                  light={false}
                  controls={false}
                  muted={true}
                  playing={true}
                  //
                  url={mediaStream}
                  //
                  height={"100%"}
                  width={"100%"}
                  style={flipStyle}
                  onError={(err) => {
                    console.log(err, "participant video error");
                  }}
                  // onProgress={() => {
                  //   checkAndUpdatePortrait();
                  // }}
                />
              ) : (
                <Box
                  style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="body1"
                    style={{
                      color:
                        appTheme === appThemes.LIGHT
                          ? theme.palette.lightTheme.contrastText
                          : theme.palette.common.white,
                      textAlign: "center",
                    }}
                  >
                    Your camera is turned off.Selecting an effect will turn it
                    on.
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
        <Box
          style={{ marginTop: 12, display: "flex", flexDirection: "column" }}
        >
          {isTab ? (
            <TabBackgroundSection
              videoProcessor={videoProcessor}
              appTheme={appTheme}
              isTab={isTab}
            />
          ) : isLGDesktop ? (
            <LGDesktopBackgroundSection
              videoProcessor={videoProcessor}
              appTheme={appTheme}
            />
          ) : (
            <DesktopBackgroundSection
              videoProcessor={videoProcessor}
              appTheme={appTheme}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

const VirtualBackgroundContainer = ({ panelHeight }) => {
  const padding = useResponsiveSize({
    xl: 12,
    lg: 16,
    md: 8,
    sm: 6,
    xs: 4,
  });
  const theme = useTheme();

  const Height = panelHeight - 14;

  return (
    <Box
      style={{
        height: Height,
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <Box
        style={{
          display: "flex",
          flexDirection: "column",

          flex: 1,
          height: "100%",
        }}
      >
        <BackgroundSelection padding={padding} theme={theme} />
      </Box>
    </Box>
  );
};

export default VirtualBackgroundContainer;
