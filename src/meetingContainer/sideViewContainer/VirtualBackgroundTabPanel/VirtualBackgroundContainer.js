import {
  Box,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
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

const SingleImage = ({
  videoProcessor,
  backgroundImageUrl,
  previewImageUrl,
  i,
  noFilter,
  blurEffect,
}) => {
  const Width = useResponsiveSize({
    xl: 102,
    lg: 98,
    md: 102,
    sm: 90,
    xs: 90,
  });
  const mMeeting = useMeeting();
  const changeWebcam = mMeeting?.changeWebcam;

  const participantId = mMeeting?.localParticipant?.id;
  const localWebcamOn = mMeeting?.localWebcamOn;

  const { isLocal } = useParticipant(participantId, {});

  const flipStyle = useMemo(
    () =>
      isLocal ? { transform: "scaleX(-1)", WebkitTransform: "scaleX(-1)" } : {},
    [isLocal]
  );
  return (
    <Box
      onClick={async () => {
        if (!videoProcessor.ready) {
          await videoProcessor.init();
        }
        let config = {};

        const stream = await createCameraVideoTrack({});
        if (i === 0 && noFilter) {
          try {
            if (videoProcessor.processorRunning || !localWebcamOn) {
              videoProcessor.stop();
              changeWebcam(stream);
            }
            return;
          } catch (error) {
            console.log(error);
          }
        }
        if (i === 1 && blurEffect) {
          config.type = "blur";
        } else {
          config = {
            type: "image",
            imageUrl: previewImageUrl,
          };
        }

        if (!videoProcessor.processorRunning) {
          try {
            const processedStream = await videoProcessor.start(stream, config);
            changeWebcam(processedStream);
          } catch (error) {
            console.log(error);
          }
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
      {backgroundImageUrl && (
        <img
          style={flipStyle}
          id={`virtualBgImage_${i}`}
          src={backgroundImageUrl}
          width={Width}
        />
      )}
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

  const backgroundImageArr = [
    {
      backgroundImageUrl:
        appTheme === appThemes.DARK
          ? `${process.env.PUBLIC_URL}/VirtualBackground/no-filter-dark.png`
          : appTheme === appThemes.LIGHT
          ? `${process.env.PUBLIC_URL}/VirtualBackground/no-filter-light.png`
          : `${process.env.PUBLIC_URL}/VirtualBackground/No-filter.png`,
      previewImageUrl: "",
      noFilter: true,
    },
    {
      backgroundImageUrl:
        appTheme === appThemes.DARK
          ? `${process.env.PUBLIC_URL}/VirtualBackground/blur-dark.png`
          : appTheme === appThemes.LIGHT
          ? `${process.env.PUBLIC_URL}/VirtualBackground/blur-light.png`
          : `${process.env.PUBLIC_URL}/VirtualBackground/Blur.png`,
      previewImageUrl: "",
      blurEffect: true,
    },
    {
      backgroundImageUrl: `${process.env.PUBLIC_URL}/VirtualBackground/image-1.png`,
      previewImageUrl: `${process.env.PUBLIC_URL}/bgImages/image-1.jpg`,
    },
    {
      backgroundImageUrl: `${process.env.PUBLIC_URL}/VirtualBackground/image-2.png`,
      previewImageUrl: `${process.env.PUBLIC_URL}/bgImages/image-2.jpg`,
    },
    {
      backgroundImageUrl: `${process.env.PUBLIC_URL}/VirtualBackground/image-3.png`,
      previewImageUrl: `${process.env.PUBLIC_URL}/bgImages/image-3.jpg`,
    },
    ,
    {
      backgroundImageUrl: `${process.env.PUBLIC_URL}/VirtualBackground/image-4.png`,
      previewImageUrl: `${process.env.PUBLIC_URL}/bgImages/image-4.jpg`,
    },
    {
      backgroundImageUrl: `${process.env.PUBLIC_URL}/VirtualBackground/image-5.png`,
      previewImageUrl: `${process.env.PUBLIC_URL}/bgImages/image-5.jpg`,
    },
    {
      backgroundImageUrl: `${process.env.PUBLIC_URL}/VirtualBackground/image-6.png`,
      previewImageUrl: `${process.env.PUBLIC_URL}/bgImages/image-6.jpg`,
    },
    {
      backgroundImageUrl: `${process.env.PUBLIC_URL}/VirtualBackground/image-7.png`,
      previewImageUrl: `${process.env.PUBLIC_URL}/bgImages/image-7.jpg`,
    },
    {
      backgroundImageUrl: `${process.env.PUBLIC_URL}/VirtualBackground/image-8.png`,
      previewImageUrl: `${process.env.PUBLIC_URL}/bgImages/image-8.jpg`,
    },
    {
      backgroundImageUrl: `${process.env.PUBLIC_URL}/VirtualBackground/image-9.png`,
      previewImageUrl: `${process.env.PUBLIC_URL}/bgImages/image-9.jpg`,
    },
    {
      backgroundImageUrl: `${process.env.PUBLIC_URL}/VirtualBackground/image-10.png`,
      previewImageUrl: `${process.env.PUBLIC_URL}/bgImages/image-10.jpg`,
    },
    {
      backgroundImageUrl: `${process.env.PUBLIC_URL}/VirtualBackground/image-11.png`,
      previewImageUrl: `${process.env.PUBLIC_URL}/bgImages/image-11.jpg`,
    },
    {
      backgroundImageUrl: `${process.env.PUBLIC_URL}/VirtualBackground/image-12.png`,
      previewImageUrl: `${process.env.PUBLIC_URL}/bgImages/image-12.jpg`,
    },
    {
      backgroundImageUrl: `${process.env.PUBLIC_URL}/VirtualBackground/image-13.png`,
      previewImageUrl: `${process.env.PUBLIC_URL}/bgImages/image-13.jpg`,
    },
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
              width: isXStoSM ? "100%" : "100%",
              height: isXStoSM ? "100%" : "100%",
              paddingTop: !isXSOnly ? "56.25%" : "56.25%",
              position: "relative",
              borderRadius: theme.spacing(1 / 4),
              overflow: "hidden",
            }}
          >
            <Box
              style={{
                position: !isXSOnly ? "absolute" : "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor:
                  appTheme === appThemes.DARK
                    ? theme.palette.darkTheme.eight
                    : appTheme === appThemes.LIGHT
                    ? theme.palette.lightTheme.three
                    : theme.palette.background.default,
                display: "flex",
                flexDirection: "column",
                borderRadius: theme.spacing(1),
                overflow: "hidden",
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
          <Grid container spacing={1}>
            {backgroundImageArr.map(
              (
                { backgroundImageUrl, previewImageUrl, noFilter, blurEffect },
                i
              ) => {
                return (
                  <Grid item xs={isTab || isLGDesktop ? 2 : 4} key={i}>
                    <SingleImage
                      videoProcessor={videoProcessor}
                      backgroundImageUrl={backgroundImageUrl}
                      previewImageUrl={previewImageUrl}
                      i={i}
                      noFilter={noFilter}
                      blurEffect={blurEffect}
                    />
                  </Grid>
                );
              }
            )}
          </Grid>
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
