import {
  Box,
  capitalize,
  Dialog,
  IconButton,
  Slide,
  Typography,
  useTheme,
  Fade,
} from "@material-ui/core";
import React, { useMemo } from "react";
import { sideBarModes, useMeetingAppContext } from "../../MeetingAppContextDef";
import ChatTabPanel from "./ChatTabPanel";
import ParticipantsTabPanel from "./ParticipantsTabPanel";
import CloseIcon from "@material-ui/icons/Close";
import useIsTab from "../../utils/useIsTab";
import useIsMobile from "../../utils/useIsMobile";
import ActivitiesTabPanel from "./ActivitiesTabPanel";
import useResponsiveSize from "../../utils/useResponsiveSize";
import { useMeeting } from "@videosdk.live/react-sdk";
import LiveStreamConfigTabPanel from "./LivestreamConfigTabPanel";

const SideBarTabView = ({ width, height }) => {
  const { sideBarMode, setSideBarMode } = useMeetingAppContext();
  const { participants } = useMeeting();

  const value =
    sideBarMode === sideBarModes.PARTICIPANTS
      ? 0
      : sideBarMode === sideBarModes.CHAT
      ? 1
      : sideBarMode === sideBarModes.ACTIVITIES
      ? 2
      : sideBarMode === sideBarModes.STREAMS
      ? 3
      : null;

  const panelPadding = 8;

  const paddedHeight = height - panelPadding * 2;

  const panelHeaderHeight = useResponsiveSize({
    xl: 52,
    lg: 48,
    md: 44,
    sm: 40,
    xs: 36,
  });

  const panelHeaderPadding = useResponsiveSize({
    xl: 12,
    lg: 10,
    md: 8,
    sm: 6,
    xs: 4,
  });

  const panelHeight = paddedHeight - panelHeaderPadding - panelHeaderHeight;

  const handleClose = () => {
    setSideBarMode(null);
  };

  const theme = useTheme();

  return (
    <div
      style={{
        height,
        paddingTop: panelPadding,
        paddingLeft: panelPadding,
        paddingRight: panelPadding,
        paddingBottom: panelPadding,
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Fade in={sideBarMode}>
        <div
          style={{
            backgroundColor: theme.palette.background.paper,
            height: paddedHeight,
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <>
            {sideBarMode && (
              <Box
                style={{
                  padding: panelHeaderPadding,
                  height: panelHeaderHeight - 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #70707033",
                }}
              >
                <Typography variant={"body1"} style={{ fontWeight: "bold" }}>
                  {sideBarMode === "PARTICIPANTS"
                    ? `${capitalize(
                        String(sideBarMode || "").toLowerCase()
                      )} (${new Map(participants)?.size})`
                    : capitalize(String(sideBarMode || "").toLowerCase())}
                </Typography>
                <IconButton onClick={handleClose}>
                  <CloseIcon fontSize={"small"} />
                </IconButton>
              </Box>
            )}
            {value === 0 ? (
              <ParticipantsTabPanel {...{ panelHeight, panelWidth: width }} />
            ) : value === 1 ? (
              <ChatTabPanel {...{ panelHeight }} />
            ) : value === 2 ? (
              <ActivitiesTabPanel {...{ panelHeight }} />
            ) : value === 3 ? (
              <LiveStreamConfigTabPanel {...{ panelHeight }} />
            ) : null}
          </>
        </div>
      </Fade>
    </div>
  );
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const SideViewContainer = ({ topBarHeight, width, height }) => {
  const {
    sideBarMode,
    setSideBarMode,
    endCallContainerRef,
    animationsEnabled,
  } = useMeetingAppContext();
  const isTab = useIsTab();
  const isMobile = useIsMobile();

  const isOpen = useMemo(() => typeof sideBarMode === "string", [sideBarMode]);

  const handleClose = () => {
    setSideBarMode(null);
  };

  const theme = useTheme();

  return isTab || isMobile ? (
    <Dialog
      container={endCallContainerRef?.current}
      closeAfterTransition
      fullScreen
      open={sideBarMode}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <SideBarTabView {...{ width, height: height + topBarHeight }} />
    </Dialog>
  ) : (
    <div
      style={{
        height,
        position: "relative",
        width: isOpen ? width : 0,
        transition: `width ${400 * (animationsEnabled ? 1 : 0.5)}ms`,
        transitionTimingFunction: "ease-in-out",
      }}
    >
      <div
        style={{
          position: "absolute",
          height,
          width,
          top: 0,
          left: 0,
          backgroundColor: theme.palette.background.paper,
          flex: 1,
          flexDirection: "column",
          display: "flex",
        }}
      >
        <SideBarTabView {...{ width, height }} />
      </div>
    </div>
  );
};

export default SideViewContainer;
