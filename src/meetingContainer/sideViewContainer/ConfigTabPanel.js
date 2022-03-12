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

function ConfigTabPanel({ panelHeight }) {
  const isMobile = useIsMobile(375);

  const { meetingLayout } = useMeetingAppContext();

  const { type, priority, gridSize } = meetingLayout;

  console.log(type, priority, gridSize, "type, priority, gridSize");

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

  function focusVisible() {
    document.getElementById("card").style.cursor = "pointer";
  }

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

  //layout and priority card
  let Card = ({ isActive, title, Icon, onClick }) => {
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
        <ButtonBase onClick={onClick} action={focusVisible} id="card">
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
        <ButtonBase onClick={onClick} action={focusVisible} id="card">
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

  const _handleChangeLayout = ({ _type, _gridSize, _priority }) => {
    const type = _type || typeRef.current;
    const gridSize = _gridSize || gridSizeRef.current;
    const priority = _priority || priorityRef.current;

    // livestreamPublish()
    // recordingPublish()
    // hlsPublish()
    // meetingPublish()
  };

  let prioritySelectHandler = () => {};

  //slider change handler
  const gridSizeHandler = (event, newValue) => {
    console.log(`newValue : ${newValue}`);
  };

  let Div = ({ heading, onLayoutSelected, onPrioritySelected }) => {
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
                return layoutObj.type.toUpperCase() == meetingLayout ? (
                  <Card
                    onClick={onLayoutSelected}
                    isActive={true}
                    title={layoutObj.type}
                    Icon={layoutObj.Icon}
                  />
                ) : (
                  <Card
                    onClick={onLayoutSelected}
                    isActive={false}
                    title={layoutObj.type}
                    Icon={layoutObj.Icon}
                  />
                );
              })}
            </>
          ) : (
            <>
              <Card
                onClick={() => {
                  onPrioritySelected();
                }}
                isActive={true}
                title="Speaker"
                Icon={SpeakerIcon}
              />
              <Card
                onClick={() => {}}
                isActive={false}
                title="Pin Participant"
                Icon={PinParticipantIcon}
              />
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
      <Div onLayoutSelected={_handleChangeLayout} heading="Layout" />
      <Div onPrioritySelected={prioritySelectHandler} heading="Priority" />
      {meetingLayout == "GRID" ? (
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
            value={gridSize}
            onChange={gridSizeHandler}
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
