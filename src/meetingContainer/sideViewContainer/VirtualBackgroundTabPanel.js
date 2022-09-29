import { Box, useMediaQuery, useTheme } from "@material-ui/core";
import {
  createCameraVideoTrack,
  useMeeting,
  useParticipant,
} from "@videosdk.live/react-sdk";
import { useMemo, useRef } from "react";
import ReactPlayer from "react-player";
import { appThemes, useMeetingAppContext } from "../../MeetingAppContextDef";
import useResponsiveSize from "../../utils/useResponsiveSize";
import { VirtualBackgroundProcessor } from "videosdk-processor";
// import { VideoSDKNoiseSuppressor } from "videosdk-processor";

const SingleRow = ({ arr, blur, topSpacing, videoProcessor }) => {
  const Width = useResponsiveSize({
    xl: 102,
    lg: 98,
    md: 98,
    sm: 98,
    xs: 98,
  });
  const mMeeting = useMeeting();

  const changeWebcam = mMeeting?.changeWebcam;

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: topSpacing && 8,
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
              if (i === 0) {
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
              <img id={`virtualBgImage_${i}`} src={imageUrl} width={Width} />
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

  const firstRowArr = [
    {
      imageUrl:
        appTheme === appThemes.DARK
          ? "VirtualBackground/no-filter-dark.png"
          : appTheme === appThemes.LIGHT
          ? "VirtualBackground/no-filter-light.png"
          : "VirtualBackground/No-filter.png",
      displayImageUrl: "",
    },
    {
      imageUrl:
        appTheme === appThemes.DARK
          ? "VirtualBackground/blur-dark.png"
          : appTheme === appThemes.LIGHT
          ? "VirtualBackground/blur-light.png"
          : "VirtualBackground/Blur.png",
      displayImageUrl: "",
    },

    {
      imageUrl: `${process.env.PUBLIC_URL}/VirtualBackground/image-1.png`,
      displayImageUrl: `${process.env.PUBLIC_URL}/bgImages/image-1.jpg`,
    },
  ];

  const secondRowArr = [
    {
      imageUrl: `${process.env.PUBLIC_URL}/VirtualBackground/image-2.png`,
      displayImageUrl: `${process.env.PUBLIC_URL}/bgImages/image-2.jpg`,
    },
    {
      imageUrl: `${process.env.PUBLIC_URL}/VirtualBackground/image-3.png`,
      displayImageUrl: `${process.env.PUBLIC_URL}/bgImages/image-3.jpg`,
    },
    ,
    {
      imageUrl: "VirtualBackground/image-4.png",
      displayImageUrl: "bgImages/image-4.jpg",
    },
  ];

  const thirdRowArr = [
    {
      imageUrl: "VirtualBackground/image-5.png",
      displayImageUrl: "bgImages/image-5.jpg",
    },
    {
      imageUrl: "VirtualBackground/image-6.png",
      displayImageUrl: "bgImages/image-6.jpg",
    },
    { imageUrl: "" },
  ];

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
              width: isXStoSM ? "50%" : "100%",
              height: isXStoSM ? "50%" : undefined,
              paddingTop: !isXSOnly ? "56.25%" : "auto",
              position: "relative",
              borderRadius: theme.spacing(1 / 4),
              overflow: "hidden",
            }}
          >
            <Box
              style={{
                position: !isXSOnly ? "absolute" : "unset",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: theme.palette.darkTheme.main,
                display: "flex",
                flexDirection: "column",
                borderRadius: theme.spacing(1),
                overflow: "hidden",
              }}
            >
              {webcamOn && (
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
              )}
            </Box>
          </Box>
        </Box>
        <Box
          style={{ marginTop: 12, display: "flex", flexDirection: "column" }}
        >
          {/* 1st row */}
          <SingleRow
            arr={firstRowArr}
            blur={true}
            videoProcessor={videoProcessor}
          />
          {/* 2nd row */}
          <SingleRow
            arr={secondRowArr}
            topSpacing={true}
            videoProcessor={videoProcessor}
          />
          {/* 3rd row */}
          <SingleRow
            arr={thirdRowArr}
            topSpacing={true}
            videoProcessor={videoProcessor}
          />
        </Box>
      </Box>
    </Box>
  );
};

const VirtualBackgroundTabPanel = ({ panelWidth, panelHeight }) => {
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

export default VirtualBackgroundTabPanel;
