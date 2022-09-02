import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  Chip,
  makeStyles,
  TextField,
  useTheme,
} from "@material-ui/core";
import { useMeetingAppContext } from "../../MeetingAppContextDef";
import useIsMobile from "../../utils/useIsMobile";
import useIsTab from "../../utils/useIsTab";
import usePrevious from "../../utils/usePrevious";
import { useWindowLiveCursors } from "../../useWindowLiveCursors";
import Cursor from "../../icons/Cursor";
import { COLORS_PRESENCE } from "../../CONSTS";
import { useParticipant, usePubSub } from "@videosdk.live/react-sdk";
import useIsLGDesktop from "../../utils/useIsLGDesktop";
import useResponsiveSize from "../../utils/useResponsiveSize";
import { useObject } from "../../liveblocks.config";

const useStyles = makeStyles((theme) => ({
  textfield: {
    "& .MuiOutlinedInput-input": {
      padding: "8px 14px",
    },
  },
  button: {
    "& ..MuiButton-root": {
      padding: 0,
    },
  },
}));
function InteractionContainer({
  height,
  width,
  originalHeight,
  originalWidth,
  participantId,
}) {
  const { displayName } = useParticipant(participantId);
  const { interactionState, interactionEnabled } = useMeetingAppContext();
  const [interactionUrl, setInteractionUrl] = useState("");
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);
  const classes = useStyles();

  const theme = useTheme();
  const isMobile = useIsMobile();
  const isTab = useIsTab();
  const fabricRef = useRef(null);

  const previousHeight = usePrevious(height);
  const previousWidth = usePrevious(width);

  // const initialHeight = useRef(height);
  const initialWidth = useRef(width);

  //
  const { animationsEnabled } = useMeetingAppContext();

  //
  const canvasCotainerRef = useRef(null);

  // function convertZoomFrom800(zoom) {
  //   let currentCanvasWidth = canvasCotainerRef.current.getWidth();
  //   return (currentCanvasWidth * zoom) / 800;
  // }

  // useEffect(() => {
  //   if (height !== previousHeight || width !== previousWidth) {
  //     canvasCotainerRef.current.setZoom(
  //       convertZoomFrom800(width / initialWidth.current)
  //     );
  //   }
  // }, [height, width, previousWidth, previousHeight]);

  const space = isMobile ? 20 : isTab ? 32 : 48;
  const arrXLength = Math.floor(width / space);
  const arrYLength = Math.floor(height / space);

  const dotBoxHeight = arrYLength * space;
  const dotBoxWidth = arrXLength * space;

  const isLGDesktop = useIsLGDesktop();

  // console.log("isLGDesktop", isLGDesktop);

  const cursors = useWindowLiveCursors();
  const object = useObject("userInfo");

  const { publish } = usePubSub("INTERACTION_BACKGROUND_CHANGED");

  const iframeWidth = useResponsiveSize({
    xl: 2100,
    lg: 2100,
    md: 1500,
    sm: 1050,
    xs: 1200,
  });

  // return (
  //   <div class="iframe-container">
  //     <iframe
  //       width="560"
  //       height="315"
  //       src="https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/proto/eoSUGsf1YF9QBobSmt3a30/Poll?node-id=19%3A530&scaling=min-zoom&page-id=0%3A1"
  //       frameborder="0"
  //       allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
  //       loading="lazy"
  //       allowfullscreen
  //     ></iframe>
  //   </div>
  // );

  // return (
  //   <div
  //     style={{
  //       position: "relative",
  //       overflow: "hidden",
  //       width: "100%",
  //       paddingTop: "56.25%",
  //     }}
  //   >
  //     <iframe
  //       id="my-frame"
  //       // style={{
  //       //   position: "absolute",
  //       //   top: 0,
  //       //   left: 0,
  //       //   bottom: 0,
  //       //   right: 0,
  //       //   width: "100%",
  //       //   height: "100%",
  //       //   zoom: "reset",
  //       // }}

  //       src="https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/proto/eoSUGsf1YF9QBobSmt3a30/Poll?node-id=19%3A530&scaling=min-zoom&page-id=0%3A1"
  //       // style="-webkit-transform:scale(0.5);-moz-transform-scale(0.5);"
  //     ></iframe>
  //   </div>
  // );

  // console.log("iframeWidth", iframeWidth);

  console.log("name interaction", object, object?.get("name"));

  return (
    <>
      {interactionEnabled && (
        <Box style={{ display: "flex", padding: 8 }}>
          <TextField
            placeholder="Enter Url"
            variant="outlined"
            style={{ width: "100%", margin: "none" }}
            classes={{ root: classes.textfield }}
            value={interactionUrl}
            onChange={(e) => setInteractionUrl(e.target.value)}
          />
          {isSubmitClicked ? (
            <Button
              variant="contained"
              style={{ marginLeft: 12, marginRight: 8, padding: "0px 0px" }}
              onClick={() => {
                setIsSubmitClicked(false);
                setInteractionUrl("");
                publish({ url: null }, { persist: true });
              }}
            >
              Clear
            </Button>
          ) : (
            <Button
              variant="contained"
              style={{ marginLeft: 12, marginRight: 8, padding: "0px 0px" }}
              onClick={() => {
                setIsSubmitClicked(true);
                publish({ url: interactionUrl }, { persist: true });
              }}
            >
              Submit
            </Button>
          )}
        </Box>
      )}
      <Box
        id={"main-canvas-container"}
        style={{
          width: originalWidth - 2,
          height: originalHeight - 40,
          display: "flex",
          // overflow: "auto",
          // overflowX: "scroll",
          // border: "2px solid red",
          // backgroundColor: "pink",
          // overflowY: "auto",
          transition: animationsEnabled
            ? "height 800ms, width 800ms"
            : "height 400ms, width 400ms",
        }}
      >
        <Box
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            // backgroundColor: "coral",
          }}
        >
          <Box
            style={{
              position: "relative",
              // backgroundColor: "seagreen",
              width: "100%",
              height: "100%",
              transition: animationsEnabled
                ? "height 800ms, width 800ms"
                : undefined,
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                position: "relative",
                // backgroundColor: "purple",
                transition: animationsEnabled
                  ? "height 800ms, width 800ms"
                  : undefined,
              }}
              ref={canvasCotainerRef}
            >
              {interactionState.url ? (
                isLGDesktop ? (
                  <div
                    style={{
                      objectFit: "contain",
                      width: "100%",
                      height: "100%",
                      // border: "2px solid red",
                    }}
                  >
                    <iframe
                      style={{
                        pointerEvents: "none",
                        border: "none",
                        overflow: "scroll",
                        objectFit: "contain",
                        width: "100%",
                        height: "100%",
                        resize: "both",
                      }}
                      // style="-webkit-transform:scale(0.5);-moz-transform-scale(0.5);"
                      // src={`https://www.figma.com/embed?embed_host=share&url=${interactionState.url}`}
                      src={interactionState.url}
                      width={"100%"}
                      height={"100%"}
                      // width={"100%"}
                      // height={"100%"}
                    ></iframe>
                  </div>
                ) : (
                  <div
                    style={{
                      width: "2000px",
                      // backgroundColor: "red",
                      // height: "1250px",
                      // width: "1500px",
                      backgroundColor: "#333244",
                      height: "1250px",
                    }}
                  >
                    <iframe
                      style={{
                        transformOrigin: "0px 0px 0px",
                        transform: "scale(0.5)",
                        width: `${iframeWidth}px`,
                        height: "1100px",
                        pointerEvents: "none",
                        border: "none",
                        backgroundColor: "#333244",
                      }}
                      src={interactionState.url}
                      // src="https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/proto/eoSUGsf1YF9QBobSmt3a30/Poll?node-id=19%3A530&scaling=min-zoom&page-id=0%3A1"
                      name="iFrame"
                      scrolling="no"
                    ></iframe>
                  </div>
                )
              ) : (
                <div
                  style={{
                    width: "99.5%",
                    height: "97%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <h1 style={{ color: "white" }}>No url added</h1>
                </div>
              )}
              {interactionState.url &&
                cursors.map((data) => {
                  console.log("data", data);
                  return (
                    <>
                      <Cursor
                        key={`cursor-${data.connectionId}`}
                        color={`rgb(${
                          COLORS_PRESENCE[
                            data.connectionId % COLORS_PRESENCE.length
                          ]
                        }`}
                        x={data.x}
                        y={data.y}
                      />
                      <Chip
                        label={data.info.name}
                        color="primary"
                        size="small"
                        style={{
                          color: theme.palette.primary.main,
                          backgroundColor: "#D5E8FF",
                          fontSize: 12,
                          fontWeight: "bold",
                          position: "absolute",
                          left: 10,
                          top: 12,
                          transition:
                            "transform 0.5s cubic-bezier(.17,.93,.38,1)",
                          transform: `translateX(${data.x}px) translateY(${data.y}px)`,
                        }}
                      />
                    </>
                  );
                })}
            </div>
          </Box>

          {/* <div style={{ position: "absolute", top: 16, left: 16 }}>
            <Chip
              label="BETA"
              color="primary"
              size="medium"
              style={{
                color: theme.palette.primary.main,
                backgroundColor: "#D5E8FF",
                fontSize: 18,
                fontWeight: "bold",
              }}
            />
          </div> */}
        </Box>
      </Box>
    </>
  );
}

const MemoizedInteraction = React.memo(
  InteractionContainer,
  ({ height, width }, { height: oldHeight, width: oldWidth }) =>
    height === oldHeight && width === oldWidth
);

export default MemoizedInteraction;
