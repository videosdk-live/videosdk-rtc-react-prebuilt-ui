import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Box, Typography, Slider, ButtonBase, useTheme } from "@mui/material";
import {
  meetingLayoutTopics,
  appThemes,
  useMeetingAppContext,
} from "../../MeetingAppContextDef";
import SpotlightIcon from "../../icons/SpotlightIcon";
import SideBarIcon from "../../icons/SideBarIcon";
import GridIcon from "../../icons/GridIcon";
import SpeakerIcon from "../../icons/SpeakerIcon";
import PinParticipantIcon from "../../icons/PinParticipantIcon";
import { usePubSub } from "@videosdk.live/react-sdk";
import useIsMobile from "../../utils/useIsMobile";
import { debounce } from "../../utils/common";
import SpeakerLightIcon from "../../icons/SpeakerLightIcon";
import PinParticipantLightIcon from "../../icons/PinParticipantLightIcon";
import GridLightIcon from "../../icons/GridLightIcon";
import SideBarLightIcon from "../../icons/SideBarLightIcon";
import SpotlightLightIcon from "../../icons/SpotlightLightIcon";
import SDLightIcon from "../../icons/SDLightIcon";
import SDDarkIcon from "../../icons/SDDarkIcon";
import HDLightIcon from "../../icons/HDLightIcon";
import HDDarkIcon from "../../icons/HDDarkIcon";
import { useSnackbar } from "notistack";

const Card = ({ isActive, title, Icon, onClick, appTheme, theme, isMobile }) => {
  const isLight = appTheme === appThemes.LIGHT;
  return (
    <Box
      mr={isMobile ? 0.8 : 2}
      style={{
        justifyItems: "center",
        alignItems: "center",
        textAlign: "center",
        maxWidth: "fit-content",
      }}
    >
      <ButtonBase
        value={title}
        onClick={onClick}
        style={{ cursor: "pointer" }}
      >
        {isActive ? (
          <Icon
            fillColor={
              isLight ? theme.palette.lightTheme.contrastText : "white"
            }
            strokeColor={
              isLight ? theme.palette.lightTheme.contrastText : "white"
            }
            pathColor={isLight ? theme.palette.common.white : "white"}
          />
        ) : (
          <Icon
            fillColor={isLight ? "" : "#95959E"}
            strokeColor={isLight ? "" : "#474657"}
          />
        )}
      </ButtonBase>
      <Typography
        style={{
          marginTop: 12,
          fontSize: "14px",
          fontWeight: "400",
          color: isActive
            ? isLight
              ? theme.palette.lightTheme.contrastText
              : "white"
            : isLight
              ? theme.palette.lightTheme.four
              : theme.palette.darkTheme.contrastText,
        }}
      >
        {title}
      </Typography>
    </Box>
  );
};

const Section = ({
  heading,
  onLayoutChange,
  onPriorityChange,
  onResolutionChange,
  meetingResolution,
  type,
  priority,
  resolutionArr,
  layoutArr,
  priorityArr,
  appTheme,
  theme,
  isMobile,
}) => {
  const isLight = appTheme === appThemes.LIGHT;
  return (
    <Box style={{ display: "flex", flexDirection: "column" }}>
      <Typography
        style={{
          fontWeight: 600,
          lineHeight: "16px",
          fontSize: "16px",
          marginTop: 24,
          color: isLight ? theme.palette.lightTheme.contrastText : "white",
        }}
        variant="body1"
      >
        {heading}
      </Typography>
      <Box style={{ display: "flex", marginTop: 16, marginBottom: 24 }}>
        {heading === "Incoming video resolution" ? (
          <>
            {resolutionArr.map((resolutionObj) => (
              <Card
                key={`res_${resolutionObj.type}`}
                onClick={onResolutionChange}
                isActive={
                  resolutionObj.type.toUpperCase() === meetingResolution
                }
                title={resolutionObj.type}
                Icon={resolutionObj.Icon}
                appTheme={appTheme}
                theme={theme}
                isMobile={isMobile}
              />
            ))}
          </>
        ) : heading === "Layout" ? (
          <>
            {layoutArr.map((layoutObj) => (
              <Card
                key={`layout_${layoutObj.type}`}
                onClick={onLayoutChange}
                isActive={layoutObj.type.toUpperCase() === type}
                title={layoutObj.type}
                Icon={layoutObj.Icon}
                appTheme={appTheme}
                theme={theme}
                isMobile={isMobile}
              />
            ))}
          </>
        ) : (
          <>
            {priorityArr.map((priorityObj) => (
              <Card
                key={`priority_${priorityObj.type}`}
                onClick={onPriorityChange}
                isActive={priorityObj.type.toUpperCase() === priority}
                title={priorityObj.type}
                Icon={priorityObj.Icon}
                appTheme={appTheme}
                theme={theme}
                isMobile={isMobile}
              />
            ))}
          </>
        )}
      </Box>
      <Box
        style={{
          borderBottom: `2px solid ${
            appTheme === appThemes.DARK
              ? theme.palette.darkTheme.seven
              : isLight
                ? theme.palette.lightTheme.three
                : "#3A3F4B"
          }`,
          marginLeft: -12,
        }}
      />
    </Box>
  );
};

function ConfigTabPanel({ panelHeight }) {
  const isMobile = useIsMobile(375);
  const theme = useTheme();

  const {
    appMeetingLayout,
    appTheme,
    setMeetingResolution,
    meetingResolution,
  } = useMeetingAppContext();
  const { enqueueSnackbar } = useSnackbar();

  const { type, priority, gridSize } = useMemo(
    () => ({
      type: appMeetingLayout.type,
      priority: appMeetingLayout.priority,
      gridSize: appMeetingLayout.gridSize,
    }),
    [appMeetingLayout]
  );

  const typeRef = useRef(type);
  const priorityRef = useRef(priority);
  const gridSizeRef = useRef(gridSize);
  const resolutionRef = useRef(meetingResolution);

  useEffect(() => {
    typeRef.current = type;
  }, [type]);

  useEffect(() => {
    priorityRef.current = priority;
  }, [priority]);

  useEffect(() => {
    gridSizeRef.current = gridSize;
  }, [gridSize]);

  useEffect(() => {
    resolutionRef.current = meetingResolution;
  }, [meetingResolution]);

  const { publish: livestreamPublish } = usePubSub(
    meetingLayoutTopics.LIVE_STREAM_LAYOUT
  );
  const { publish: recordingPublish } = usePubSub(
    meetingLayoutTopics.RECORDING_LAYOUT
  );
  const { publish: hlsPublish } = usePubSub(meetingLayoutTopics.HLS_LAYOUT);
  const { publish: meetingPublish } = usePubSub(
    meetingLayoutTopics.MEETING_LAYOUT
  );
  const { publish: resolutionPublish } = usePubSub("CHANGE_RESOLUTION");

  const livestreamPublishRef = useRef(livestreamPublish);
  const recordingPublishRef = useRef(recordingPublish);
  const hlsPublishRef = useRef(hlsPublish);
  const meetingPublishRef = useRef(meetingPublish);
  const resolutionPublishRef = useRef(resolutionPublish);

  useEffect(() => {
    livestreamPublishRef.current = livestreamPublish;
  }, [livestreamPublish]);
  useEffect(() => {
    recordingPublishRef.current = recordingPublish;
  }, [recordingPublish]);
  useEffect(() => {
    hlsPublishRef.current = hlsPublish;
  }, [hlsPublish]);
  useEffect(() => {
    meetingPublishRef.current = meetingPublish;
  }, [meetingPublish]);
  useEffect(() => {
    resolutionPublishRef.current = resolutionPublish;
  }, [resolutionPublish]);

  const marks = useMemo(() => Array.from({ length: 25 }, (_, i) => i + 1), []);

  const resolutionArr = useMemo(
    () => [
      {
        type: "SD",
        Icon: appTheme === appThemes.LIGHT ? SDLightIcon : SDDarkIcon,
      },
      {
        type: "HD",
        Icon: appTheme === appThemes.LIGHT ? HDLightIcon : HDDarkIcon,
      },
    ],
    [appTheme]
  );

  const layoutArr = useMemo(
    () => [
      {
        type: "Spotlight",
        Icon:
          appTheme === appThemes.LIGHT ? SpotlightLightIcon : SpotlightIcon,
      },
      {
        type: "Sidebar",
        Icon: appTheme === appThemes.LIGHT ? SideBarLightIcon : SideBarIcon,
      },
      {
        type: "Grid",
        Icon: appTheme === appThemes.LIGHT ? GridLightIcon : GridIcon,
      },
    ],
    [appTheme]
  );

  const priorityArr = useMemo(
    () => [
      {
        type: "Pin",
        Icon:
          appTheme === appThemes.LIGHT
            ? PinParticipantLightIcon
            : PinParticipantIcon,
      },
      {
        type: "Speaker",
        Icon: appTheme === appThemes.LIGHT ? SpeakerLightIcon : SpeakerIcon,
      },
    ],
    [appTheme]
  );

  function valuetext(value) {
    return `${value}`;
  }

  const publishToPubSub = useMemo(
    () =>
      debounce(async function ({
        type: _type,
        gridSize: _gridSize,
        priority: _priority,
        resolution: _resolution,
      }) {
        const type = _type || typeRef.current;
        const gridSize = _gridSize || gridSizeRef.current;
        const priority = _priority || priorityRef.current;
        const resolution = _resolution || resolutionRef.current;

        const layout = { type, gridSize, priority };
        try {
          await livestreamPublishRef.current(
            "livestream-layout-change",
            { persist: true },
            { layout }
          );
        } catch (error) {
          console.log("Error in Pubsub ", error);
        }
        try {
          await hlsPublishRef.current(
            "hls-layout-change",
            { persist: true },
            { layout }
          );
        } catch (error) {
          console.log("Error in Pubsub ", error);
        }
        try {
          await meetingPublishRef.current(
            "meeting-layout-change",
            { persist: true },
            { layout }
          );
        } catch (error) {
          console.log("Error in Pubsub ", error);
        }
        try {
          await recordingPublishRef.current(
            "recording-layout-change",
            { persist: true },
            { layout }
          );
        } catch (error) {
          console.log("Error in Pubsub ", error);
        }
        try {
          await resolutionPublishRef.current(
            "resolution-change",
            { persist: true },
            { resolution }
          );
        } catch (error) {
          console.log("Error in Pubsub ", error);
        }
      }, 500),
    []
  );

  const _handleChangeResolution = useCallback(
    (event) => {
      const resolution = event.currentTarget.value.toUpperCase();
      setMeetingResolution(resolution);
      publishToPubSub({ resolution });
      enqueueSnackbar(
        `Video resolution of all participants changed to ${resolution}.`
      );
    },
    [setMeetingResolution, publishToPubSub, enqueueSnackbar]
  );

  const _handleChangeLayout = useCallback(
    (event) => {
      const type = event.currentTarget.value.toUpperCase() || typeRef.current;
      publishToPubSub({ type });
    },
    [publishToPubSub]
  );

  const _handleChangePriority = useCallback(
    (event) => {
      const priority =
        event.currentTarget.value.toUpperCase() || priorityRef.current;
      publishToPubSub({ priority });
    },
    [publishToPubSub]
  );

  const _handleGridSize = useCallback(
    (newGridSize) => {
      const gridSize = newGridSize || gridSizeRef.current;
      publishToPubSub({ gridSize });
    },
    [publishToPubSub]
  );

  return (
    <Box
      style={{
        display: "flex",
        maxWidth: "100%",
        marginLeft: 12,
        flexDirection: "column",
        height: panelHeight,
        overflowY: "auto",
      }}
    >
      <Section
        onResolutionChange={_handleChangeResolution}
        heading={"Incoming video resolution"}
        meetingResolution={meetingResolution}
        type={type}
        priority={priority}
        resolutionArr={resolutionArr}
        layoutArr={layoutArr}
        priorityArr={priorityArr}
        appTheme={appTheme}
        theme={theme}
        isMobile={isMobile}
      />
      <Section
        onLayoutChange={_handleChangeLayout}
        heading="Layout"
        meetingResolution={meetingResolution}
        type={type}
        priority={priority}
        resolutionArr={resolutionArr}
        layoutArr={layoutArr}
        priorityArr={priorityArr}
        appTheme={appTheme}
        theme={theme}
        isMobile={isMobile}
      />
      <Section
        onPriorityChange={_handleChangePriority}
        heading="Priority"
        meetingResolution={meetingResolution}
        type={type}
        priority={priority}
        resolutionArr={resolutionArr}
        layoutArr={layoutArr}
        priorityArr={priorityArr}
        appTheme={appTheme}
        theme={theme}
        isMobile={isMobile}
      />
      {type === "GRID" ? (
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            marginRight: 12,
          }}
        >
          <Typography
            style={{
              fontWeight: 600,
              lineHeight: "16px",
              fontSize: "16px",
              marginTop: 24,
              color:
                appTheme === appThemes.LIGHT
                  ? theme.palette.lightTheme.contrastText
                  : "white",
            }}
            variant="body1"
          >
            Participants On Screen
          </Typography>

          <Box
            sx={{
              paddingLeft: theme.spacing(2),
              paddingRight: theme.spacing(2),
            }}
          >
            <Slider
              getAriaValueText={valuetext}
              min={1}
              max={25}
              size="small"
              defaultValue={gridSize}
              onChange={(_, newValue) => {
                _handleGridSize(newValue);
              }}
              valueLabelDisplay="auto"
              step={1}
              style={{
                marginTop: 32,
                marginBottom: 24,
                color:
                  appTheme === appThemes.LIGHT
                    ? theme.palette.lightTheme.contrastText
                    : "#ffffff",
              }}
              area-label="default"
              marks={marks}
            />
          </Box>
        </Box>
      ) : null}
    </Box>
  );
}
export default ConfigTabPanel;
