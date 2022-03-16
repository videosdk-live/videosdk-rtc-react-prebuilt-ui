import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import {
  Box,
  Typography,
  Slider,
  ButtonBase,
  Tooltip,
} from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import {
  meetingLayouts,
  useMeetingAppContext,
} from "../../MeetingAppContextDef";
import SpotlightIcon from "../../icons/SpotlightIcon";
import SideBarIcon from "../../icons/SideBarIcon";
import GridIcon from "../../icons/GridIcon";
import SpeakerIcon from "../../icons/SpeakerIcon";
import PinParticipantIcon from "../../icons/PinParticipantIcon";
import { usePubSub } from "@videosdk.live/react-sdk";
import useIsMobile from "../../utils/useIsMobile";
import { debounce } from "lodash";

function ConfigTabPanel({ panelHeight }) {
  const isMobile = useIsMobile(375);

  const { appMeetingLayout } = useMeetingAppContext();

  let { type, priority, gridSize } = appMeetingLayout;

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

  const { publish: livestreamPublish } = usePubSub("LIVESTREAM_LAYOUT");
  const { publish: recordingPublish } = usePubSub("RECORDING_LAYOUT");
  const { publish: hlsPublish } = usePubSub("HLS_LAYOUT");
  const { publish: meetingPublish } = usePubSub("MEETING_LAYOUT");

  const marks = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25,
  ];
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

  //lightToolTip
  const LightTooltip = withStyles((theme) => ({
    tooltip: {
      background: "none",
      fontSize: "14px",
      lineHeight: "16px",
      fontWeight: 600,
      color: "fff",
      marginBottom: "8px",
    },
  }))(Tooltip);

  //BaseButton focus
  function focusVisible() {
    document.getElementById("card").style.cursor = "pointer";
  }

  //sliders events
  function valuetext(value) {
    return `${value}`;
  }
  function ValueLabelComponent(props) {
    const { children, open, value } = props;
    return (
      <LightTooltip
        open={open}
        interactive
        enterTouchDelay={0}
        placement="top"
        title={value}
      >
        {children}
      </LightTooltip>
    );
  }

  //handlers
  const _handleChangeLayout = (event) => {
    type = event.currentTarget.value.toUpperCase() || typeRef.current;
    publishToPubSub();
  };

  const _handleChangePriority = (event) => {
    priority = event.currentTarget.value.toUpperCase() || priorityRef.current;
    publishToPubSub();
  };

  let _handleGridSize = (e, newValue) => {
    gridSize = newValue || gridSizeRef.current;
    // publishToPubSub();
  };

  function publishToPubSub() {
    let layout = { type, gridSize, priority };
    livestreamPublish(layout, { persist: true });
    hlsPublish(layout, { persist: true });
    meetingPublish(layout, { persist: true });
    recordingPublish(layout, { persist: true });
  }

  //layout and priority card
  let Card = ({ isActive, ref, title, Icon, onClick }) => {
    return isActive ? (
      <Box
        mr={isMobile ? "7px" : "12px"}
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
            marginTop: "12px",
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
        mr={isMobile ? "7px" : "12px"}
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
            marginTop: "12px",
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
            marginTop: "24px",
          }}
          variant="body1"
        >
          {heading}
        </Typography>
        <Box
          style={{
            display: "flex",
            marginTop: "16px",
            marginBottom: "24px",
          }}
        >
          {heading == "Layout" ? (
            <>
              {layoutArr.map((layoutObj) => {
                return layoutObj.type.toUpperCase() == type ? (
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
                return priorityObj.type.toUpperCase() == priority ? (
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
          style={{ borderBottom: "2px solid #3A3F4B", marginLeft: "-12px" }}
        ></Box>
      </Box>
    );
  };

  return (
    <Box
      style={{
        display: "flex",
        maxWidth: "100%",
        marginLeft: "12px",
        flexDirection: "column",
      }}
    >
      <Div onLayoutChange={_handleChangeLayout} heading="Layout" />
      <Div onPriorityChange={_handleChangePriority} heading="Priority" />
      {type == "GRID" ? (
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            marginRight: "12px",
          }}
        >
          <Typography
            style={{
              fontWeight: 600,
              lineHeight: "16px",
              fontSize: "16px",
              marginTop: "24px",
            }}
            variant="body1"
          >
            Max number of participants
          </Typography>
          <Slider
            getAriaValueText={valuetext}
            min={1}
            max={25}
            defaultValue={gridSize}
            onChange={(e, newValue) => _handleGridSize(e, newValue)}
            onChangeCommitted={publishToPubSub}
            ValueLabelComponent={ValueLabelComponent}
            valueLabelDisplay="on"
            step={1}
            style={{
              marginTop: "48px",
              color: "#ffffff",
            }}
            marks={marks}
          />
        </Box>
      ) : null}
    </Box>
  );
}
export default ConfigTabPanel;
