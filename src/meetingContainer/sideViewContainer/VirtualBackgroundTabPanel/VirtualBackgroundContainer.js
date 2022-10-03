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
import BlurIcon from "../../../icons/BlurIcon";
import NoFilterIcon from "../../../icons/NoFilterIcon";
import { appThemes, useMeetingAppContext } from "../../../MeetingAppContextDef";
import useIsLGDesktop from "../../../utils/useIsLGDesktop";
import useIsTab from "../../../utils/useIsTab";
import useResponsiveSize from "../../../utils/useResponsiveSize";

const SingleImage = ({
  videoProcessor,
  previewImageUrl,
  backgroudImageUrl,
  Icon,
  theme,
  appTheme,
  i,
  type,
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

        const stream = await createCameraVideoTrack({});
        if (type === "DEFAULT") {
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

        if (!videoProcessor.processorRunning) {
          try {
            const processedStream = await videoProcessor.start(stream, {
              type,
              imageUrl: backgroudImageUrl,
            });
            changeWebcam(processedStream);
          } catch (error) {
            console.log(error);
          }
        } else {
          videoProcessor.updateProcessorConfig({
            type,
            imageUrl: backgroudImageUrl,
          });
        }
      }}
      style={{
        display: "flex",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        borderRadius: 4,
        // width: Icon && Width,
        // height: Icon && 69,
        // backgroundColor:
        //   Icon && appTheme === appThemes.DARK
        //     ? theme.palette.darkTheme.eight
        //     : appTheme === appThemes.LIGHT
        //     ? theme.palette.lightTheme.three
        //     : theme.palette.background.default,
        // borderRadius: Icon && 6,
      }}
    >
      {/* {Icon && (
        <Icon
          fillColor={
            appTheme === appThemes.LIGHT
              ? theme.palette.lightTheme.contrastText
              : theme.palette.common.white
          }
        />
      )} */}
      {previewImageUrl && (
        <img
          style={flipStyle}
          id={`virtualBgImage_${i}`}
          src={previewImageUrl}
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

  const BASE_URL = "https://cdn.videosdk.live/virtual-background";

  const backgroundImageArr = [
    {
      // Icon: NoFilterIcon,
      previewImageUrl:
        appTheme === appThemes.DARK
          ? `${BASE_URL}/webcam-no-filter-dark-preview.png`
          : appTheme === appThemes.LIGHT
          ? `${BASE_URL}/webcam-no-filter-light-preview.png`
          : `${BASE_URL}/webcam-no-filter-preview.png`,
      type: "DEFAULT",
    },
    {
      // Icon: BlurIcon,
      previewImageUrl:
        appTheme === appThemes.DARK
          ? `${BASE_URL}/webcam-blur-dark-preview.png`
          : appTheme === appThemes.LIGHT
          ? `${BASE_URL}/webcam-blur-light-preview.png`
          : `${BASE_URL}/webcam-blur-preview.png`,
      type: "blur",
    },
    {
      type: "image",
      previewImageUrl: `${BASE_URL}/san-fran-preview.png`,
      backgroudImageUrl: `${BASE_URL}/san-fran.jpeg`,
    },
    {
      previewImageUrl: `${BASE_URL}/hill-preview.png`,
      backgroudImageUrl: `${BASE_URL}/hill.jpeg`,
      type: "image",
    },

    {
      type: "image",
      previewImageUrl: `${BASE_URL}/cloud-preview.png`,
      backgroudImageUrl: `${BASE_URL}/cloud.jpeg`,
    },
    ,
    {
      type: "image",
      previewImageUrl: `${BASE_URL}/beach-preview.png`,
      backgroudImageUrl: `${BASE_URL}/beach.jpeg`,
    },
    {
      type: "image",
      previewImageUrl: `${BASE_URL}/white-wall-preview.png`,
      backgroudImageUrl: `${BASE_URL}/white-wall.jpeg`,
    },
    {
      type: "image",
      previewImageUrl: `${BASE_URL}/wall-with-pot-preview.png`,
      backgroudImageUrl: `${BASE_URL}/wall-with-pot.jpeg`,
    },
    {
      type: "image",
      previewImageUrl: `${BASE_URL}/window-conference-preview.png`,
      backgroudImageUrl: `${BASE_URL}/window-conference.jpeg`,
    },
    {
      type: "image",
      previewImageUrl: `${BASE_URL}/sky-preview.png`,
      backgroudImageUrl: `${BASE_URL}/sky.jpeg`,
    },
    {
      previewImageUrl: `${BASE_URL}/red-mix-preview.png`,
      backgroudImageUrl: `${BASE_URL}/red-mix.jpeg`,
      type: "image",
    },
    {
      type: "image",
      previewImageUrl: `${BASE_URL}/blue-mix-preview.png`,
      backgroudImageUrl: `${BASE_URL}/blue-mix.jpeg`,
    },
    {
      type: "image",
      previewImageUrl: `${BASE_URL}/coffe-wall-preview.png`,
      backgroudImageUrl: `${BASE_URL}/coffe-wall.jpeg`,
    },
    {
      type: "image",
      previewImageUrl: `${BASE_URL}/paper-wall-preview.png`,
      backgroudImageUrl: `${BASE_URL}/paper-wall.jpeg`,
    },
    {
      type: "image",
      previewImageUrl: `${BASE_URL}/design-wall-preview.png`,
      backgroudImageUrl: `${BASE_URL}/design-wall.jpeg`,
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
                    Your camera is turned off. Selecting an effect will turn it
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
              ({ previewImageUrl, backgroudImageUrl, type, Icon }, i) => {
                return (
                  <Grid item xl={4} xs={isTab || isLGDesktop ? 2 : 4} key={i}>
                    <SingleImage
                      videoProcessor={videoProcessor}
                      previewImageUrl={previewImageUrl}
                      backgroudImageUrl={backgroudImageUrl}
                      Icon={Icon}
                      theme={theme}
                      appTheme={appTheme}
                      i={i}
                      type={type}
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
