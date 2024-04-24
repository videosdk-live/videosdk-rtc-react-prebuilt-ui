import React, { useEffect, useMemo, useRef } from "react";
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

  const marks = Array.from({ length: 25 }, (_, i) => i + 1);

  const resolutionArr = [
    {
      type: "SD",
      Icon: appTheme === appThemes.LIGHT ? SDLightIcon : SDDarkIcon,
    },
    {
      type: "HD",
      Icon: appTheme === appThemes.LIGHT ? HDLightIcon : HDDarkIcon,
    },
  ];

  const layoutArr = [
    {
      type: "Spotlight",
      Icon: appTheme === appThemes.LIGHT ? SpotlightLightIcon : SpotlightIcon,
    },
    {
      type: "Sidebar",
      Icon: appTheme === appThemes.LIGHT ? SideBarLightIcon : SideBarIcon,
    },
    {
      type: "Grid",
      Icon: appTheme === appThemes.LIGHT ? GridLightIcon : GridIcon,
    },
  ];

  const priorityArr = [
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
  ];

  //BaseButton focus
  function focusVisible() {
    document.getElementById("card").style.cursor = "pointer";
  }

  //sliders events
  function valuetext(value) {
    return `${value}`;
  }

  //handlers

  const _handleChangeResolution = (event) => {
    const resolution = event.currentTarget.value.toUpperCase();
    // publishToPubSub({ resolution });
    setMeetingResolution(resolution);
    enqueueSnackbar(
      `Video resolution of all participants changed to ${resolution}.`
    );
  };

  const _handleChangeLayout = (event) => {
    const type = event.currentTarget.value.toUpperCase() || typeRef.current;
    publishToPubSub({ type });
  };

  const _handleChangePriority = (event) => {
    const priority =
      event.currentTarget.value.toUpperCase() || priorityRef.current;
    publishToPubSub({ priority });
  };

  const _handleGridSize = (newGridSize) => {
    const gridSize = newGridSize || gridSizeRef.current;
    publishToPubSub({ gridSize });
  };

  const publishToPubSub = debounce(function ({
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

    livestreamPublishRef.current({ layout }, { persist: true });
    hlsPublishRef.current({ layout }, { persist: true });
    meetingPublishRef.current({ layout }, { persist: true });
    recordingPublishRef.current({ layout }, { persist: true });
    resolutionPublishRef.current({ resolution }, { persist: true });
  },
  500);

  //layout and priority card
  let Card = ({ isActive, ref, title, Icon, onClick }) => {
    return isActive ? (
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
          action={focusVisible}
          id="card"
          ref={ref}
        >
          <Icon
            fillColor={
              appTheme === appThemes.LIGHT
                ? theme.palette.lightTheme.contrastText
                : "white"
            }
            strokeColor={
              appTheme === appThemes.LIGHT
                ? theme.palette.lightTheme.contrastText
                : "white"
            }
            pathColor={
              appTheme === appThemes.LIGHT
                ? theme.palette.common.white
                : "white"
            }
          />
        </ButtonBase>
        <Typography
          style={{
            marginTop: 12,
            fontSize: "14px",
            fontWeight: "400",
            color:
              appTheme === appThemes.LIGHT
                ? theme.palette.lightTheme.contrastText
                : "white",
          }}
        >
          {title}
        </Typography>
      </Box>
    ) : (
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
          action={focusVisible}
          id="card"
          ref={ref}
        >
          <Icon
            // fillColor={"#959595"}
            // strokeColor={"#474657"}
            fillColor={
              appTheme === appThemes.LIGHT
                ? ""
                : appTheme === appThemes.DARK
                ? "#95959E"
                : "#95959E"
            }
            strokeColor={appTheme === appThemes.LIGHT ? "" : "#474657"}
          />
        </ButtonBase>
        <Typography
          style={{
            marginTop: 12,
            fontSize: "14px",
            fontWeight: "400",
            color: "#95959E",
          }}
        >
          {title}
        </Typography>
      </Box>
    );
  };

  let Div = ({
    heading,
    onLayoutChange,
    onPriorityChange,
    onResolutionChange,
  }) => {
    return (
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
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
          {heading}
        </Typography>
        <Box
          style={{
            display: "flex",
            marginTop: 16,
            marginBottom: 24,
          }}
        >
          {heading === "Incoming video resolution" ? (
            <>
              {resolutionArr.map((resolutionObj) => {
                return resolutionObj.type.toUpperCase() ===
                  meetingResolution ? (
                  <Card
                    onClick={onResolutionChange}
                    isActive={true}
                    title={resolutionObj.type}
                    Icon={resolutionObj.Icon}
                  />
                ) : (
                  <Card
                    onClick={onResolutionChange}
                    isActive={false}
                    title={resolutionObj.type}
                    Icon={resolutionObj.Icon}
                  />
                );
              })}
            </>
          ) : heading === "Layout" ? (
            <>
              {layoutArr.map((layoutObj) => {
                return layoutObj.type.toUpperCase() === type ? (
                  <Card
                    onClick={onLayoutChange}
                    isActive={true}
                    title={layoutObj.type}
                    Icon={layoutObj.Icon}
                    ref={typeRef}
                  />
                ) : (
                  <Card
                    onClick={onLayoutChange}
                    isActive={false}
                    title={layoutObj.type}
                    Icon={layoutObj.Icon}
                    ref={priorityRef}
                  />
                );
              })}
            </>
          ) : (
            <>
              {priorityArr.map((priorityObj) => {
                return priorityObj.type.toUpperCase() === priority ? (
                  <Card
                    onClick={onPriorityChange}
                    isActive={true}
                    title={priorityObj.type}
                    Icon={priorityObj.Icon}
                  />
                ) : (
                  <Card
                    onClick={onPriorityChange}
                    isActive={false}
                    title={priorityObj.type}
                    Icon={priorityObj.Icon}
                  />
                );
              })}
            </>
          )}
        </Box>
        <Box
          style={{
            borderBottom: `2px solid ${
              appTheme === appThemes.DARK
                ? theme.palette.darkTheme.seven
                : appTheme === appThemes.LIGHT
                ? theme.palette.lightTheme.three
                : "#3A3F4B"
            }`,
            marginLeft: -12,
          }}
        ></Box>
      </Box>
    );
  };

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
      <Div
        onResolutionChange={_handleChangeResolution}
        heading={"Incoming video resolution"}
      />
      <Div onLayoutChange={_handleChangeLayout} heading="Layout" />
      <Div onPriorityChange={_handleChangePriority} heading="Priority" />
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
