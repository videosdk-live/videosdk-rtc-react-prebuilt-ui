import {
  Box,
  capitalize,
  Dialog,
  IconButton,
  Slide,
  Typography,
  useTheme,
  Fade,
} from "@mui/material";
import React, { useMemo } from "react";
import {
  sideBarModes,
  appThemes,
  useMeetingAppContext,
  sideBarNestedModes,
} from "../../MeetingAppContextDef";
import ChatTabPanel from "./ChatTabPanel";
import ParticipantsTabPanel from "./ParticipantsTabPanel";
import CloseIcon from "@mui/icons-material/Close";
import useIsTab from "../../utils/useIsTab";
import useIsMobile from "../../utils/useIsMobile";
import ActivitiesTabPanel from "./ActivitiesTabPanel";
import useResponsiveSize from "../../utils/useResponsiveSize";
import { useMeeting } from "@videosdk.live/react-sdk";
import LiveStreamConfigTabPanel from "./LivestreamConfigTabPanel";
import ConfigTabPanel from "./ConfigTabPanel";
import { NavigateBeforeOutlined } from "@mui/icons-material";
import { meetingModes } from "../../CONSTS";
import { styled } from "@mui/material/styles";

const SideBarTabView = ({ width, height }) => {
  const {
    sideBarMode,
    setSideBarMode,
    polls,
    draftPolls,
    canCreatePoll,
    sideBarNestedMode,
    setSideBarNestedMode,
    meetingMode,
    appTheme,
  } = useMeetingAppContext();

  const CustomIconButton = styled(IconButton)`
    &:hover {
      background: transparent;
    }
    &:hover .MuiSvgIcon-root {
      color: ${appTheme === appThemes.LIGHT ? `#404B53` : `white`};
    }
    & .MuiSvgIcon-root {
      color: #9fa0a7;
    }
  `;

  const { participants } = useMeeting();
  const value =
    sideBarMode === sideBarModes.PARTICIPANTS
      ? 0
      : sideBarMode === sideBarModes.CHAT
      ? 1
      : sideBarMode === sideBarModes.ACTIVITIES
      ? 2
      : sideBarNestedMode === sideBarNestedModes.ADD_LIVE_STREAM //sideBarMode === sideBarModes.ADD_LIVE_STREAM
      ? 3
      : sideBarMode === sideBarModes.CONFIGURATION
      ? 4
      : null;

  const panelPadding = 8;

  const paddedHeight = height - panelPadding * 2;

  const panelHeaderHeight = useResponsiveSize({
    xl: 38,
    lg: 34,
    md: 44,
    sm: 40,
    xs: 36,
  });

  const panelHeaderPadding = useResponsiveSize({
    xl: 12,
    lg: 12,
    md: 10,
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
        backgroundColor:
          appTheme === appThemes.DARK
            ? theme.palette.darkTheme.main
            : appTheme === appThemes.LIGHT
            ? theme.palette.lightTheme.main
            : theme.palette.background.default,
      }}
    >
      <Fade in={sideBarMode}>
        <div
          style={{
            backgroundColor:
              appTheme === appThemes.DARK
                ? theme.palette.darkTheme.slightLighter
                : appTheme === appThemes.LIGHT
                ? theme.palette.lightTheme.two
                : theme.palette.background.paper,
            height: paddedHeight,
            borderRadius: 10,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            flex: 1,
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
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {sideBarMode === sideBarModes.ACTIVITIES &&
                    (sideBarNestedMode === "POLLS" ||
                      sideBarNestedMode === "CREATE_POLL" ||
                      sideBarNestedMode === "ADD_LIVE_STREAM" ||
                      sideBarNestedMode === "VIRTUAL_BACKGROUND") && (
                      <CustomIconButton
                        onClick={() => {
                          setSideBarNestedMode(null);
                        }}
                        disableFocusRipple
                        disableRipple
                        disableTouchRipple
                        style={{
                          cursor: "pointer",
                          margin: 0,
                          padding: 0,
                          marginLeft: -4,
                        }}
                      >
                        <NavigateBeforeOutlined fontSize="medium" />
                      </CustomIconButton>
                    )}
                  <Typography
                    variant={"body1"}
                    style={{
                      fontWeight: "bold",
                      color:
                        appTheme === appThemes.LIGHT
                          ? theme.palette.lightTheme.contrastText
                          : "white",
                    }}
                  >
                    {sideBarMode === "PARTICIPANTS"
                      ? `${capitalize(
                          String(sideBarMode || "").toLowerCase()
                        )} (${new Map(participants)?.size})`
                      : sideBarMode === "ADD_LIVE_STREAM" ||
                        sideBarNestedMode === "ADD_LIVE_STREAM"
                      ? "Add Live Streams"
                      : sideBarMode === "ACTIVITIES" &&
                        sideBarNestedMode === "POLLS"
                      ? polls.length >= 1 || draftPolls.length >= 1
                        ? `Polls (${polls.length || draftPolls.length})`
                        : sideBarNestedMode === "CREATE_POLL" &&
                          sideBarMode === "ACTIVITIES"
                        ? "Create a poll"
                        : canCreatePoll &&
                          sideBarMode === "ACTIVITIES" &&
                          meetingMode !== meetingModes.SIGNALLING_ONLY
                        ? "Create a poll"
                        : `Polls ${polls.length > 0 ? `(${polls.length})` : ""}`
                      : sideBarNestedMode === "CREATE_POLL" &&
                        sideBarMode === "ACTIVITIES"
                      ? "Create a poll"
                      : sideBarMode === "ACTIVITIES"
                      ? sideBarNestedMode ===
                        sideBarNestedModes.VIRTUAL_BACKGROUND
                        ? "Virtual Background (BETA)"
                        : "More Options"
                      : capitalize(String(sideBarMode || "").toLowerCase())}
                  </Typography>
                </Box>
                <Box>
                  <CustomIconButton
                    onClick={handleClose}
                    disableFocusRipple
                    disableRipple
                    disableTouchRipple
                    style={{ padding: 0, margin: 0 }}
                  >
                    <CloseIcon fontSize={"small"} />
                  </CustomIconButton>
                </Box>
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
            ) : value === 4 ? (
              <ConfigTabPanel {...{ panelHeight }} />
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
    appTheme,
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
          backgroundColor:
            appTheme === appThemes.DARK
              ? theme.palette.darkTheme.slightLighter
              : appTheme === appThemes.LIGHT
              ? theme.palette.lightTheme.two
              : theme.palette.background.paper,
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
