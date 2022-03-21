import React, { useEffect, useMemo, useRef } from "react";
import { Box, Typography, Slider, ButtonBase } from "@material-ui/core";
import {
  meetingLayoutTopics,
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

function ConfigTabPanel() {
  const isMobile = useIsMobile(375);

  const { appMeetingLayout } = useMeetingAppContext();

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

  useEffect(() => {
    typeRef.current = type;
  }, [type]);

  useEffect(() => {
    priorityRef.current = priority;
  }, [priority]);

  useEffect(() => {
    gridSizeRef.current = gridSize;
  }, [gridSize]);

  const { publish: livestreamPublish } = usePubSub(
    meetingLayoutTopics.MEETING_LAYOUT
  );
  const { publish: recordingPublish } = usePubSub(
    meetingLayoutTopics.RECORDING_LAYOUT
  );
  const { publish: hlsPublish } = usePubSub(
    meetingLayoutTopics.LIVE_STREAM_LAYOUT
  );
  const { publish: meetingPublish } = usePubSub(meetingLayoutTopics.HLS_LAYOUT);

  const livestreamPublishRef = useRef(livestreamPublish);
  const recordingPublishRef = useRef(recordingPublish);
  const hlsPublishRef = useRef(hlsPublish);
  const meetingPublishRef = useRef(meetingPublish);

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

  const marks = Array.from({ length: 25 }, (_, i) => i + 1);

  const layoutArr = [
    {
      type: "Spotlight",
      Icon: SpotlightIcon,
    },
    {
      type: "Sidebar",
      Icon: SideBarIcon,
    },
    {
      type: "Grid",
      Icon: GridIcon,
    },
  ];

  const priorityArr = [
    {
      type: "Pin",
      Icon: PinParticipantIcon,
    },
    {
      type: "Speaker",
      Icon: SpeakerIcon,
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
  }) {
    const type = _type || typeRef.current;
    const gridSize = _gridSize || gridSizeRef.current;
    const priority = _priority || priorityRef.current;

    const layout = { type, gridSize, priority };

    livestreamPublishRef.current({ layout }, { persist: true });
    hlsPublishRef.current({ layout }, { persist: true });
    meetingPublishRef.current({ layout }, { persist: true });
    recordingPublishRef.current({ layout }, { persist: true });
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
          <Icon fillColor="white" strokeColor="#fff" />
        </ButtonBase>
        <Typography
          style={{
            marginTop: 12,
            fontSize: "14px",
            fontWeight: "400",
            color: "white",
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
          <Icon fillColor="#95959E" strokeColor="#474657" />
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

  let Div = ({ heading, onLayoutChange, onPriorityChange }) => {
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
          {heading === "Layout" ? (
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
          style={{ borderBottom: "2px solid #3A3F4B", marginLeft: -12 }}
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
      }}
    >
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
            }}
            variant="body1"
          >
            Participants On Screen
          </Typography>
          <Slider
            getAriaValueText={valuetext}
            min={1}
            max={25}
            defaultValue={gridSize}
            onChange={(_, newValue) => {
              _handleGridSize(newValue);
            }}
            valueLabelDisplay="on"
            step={1}
            style={{
              marginTop: 48,
              color: "#ffffff",
            }}
            area-label="default"
            marks={marks}
          />
        </Box>
      ) : null}
    </Box>
  );
}
export default ConfigTabPanel;
