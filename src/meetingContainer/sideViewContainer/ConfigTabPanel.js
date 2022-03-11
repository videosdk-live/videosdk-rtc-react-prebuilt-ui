import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  Box,
  Typography,
  Slider,
  ButtonBase,
  Tooltip,
} from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";

import { meetingLayouts } from "../../MeetingAppContextDef";
import SpotlightIcon from "../../icons/SpotlightIcon";
import SideBarIcon from "../../icons/SideBarIcon";
import GridIcon from "../../icons/GridIcon";
import SpeakerIcon from "../../icons/SpeakerIcon";
import PinParticipantIcon from "../../icons/PinParticipantIcon";

function ConfigTabPanel({ panelHeight }) {
  const [isMobile, setIsMobile] = useState(false);
  const [layout, setLayout] = useState("GRID");
  const [gridSize, setgridSize] = useState(1);

  const marks = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25,
  ];

  useLayoutEffect(() => {
    if (window.innerWidth < 375) {
      setIsMobile(true);
    }
  }, []);

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

  useEffect(() => {
    console.log(layout);
  }, [layout]);

  //layout and priority card
  let Card = ({ isActive, title, Icon, click }) => {
    return isActive ? (
      <Box
        id="card"
        action={focusVisible}
        style={{
          justifyItems: "center",
          alignItems: "center",
          textAlign: "center",
          maxWidth: "fit-content",
          marginRight: "12px",
          // marginRight: {isMobile?"8px":"12px"},
        }}
      >
        <ButtonBase action={focusVisible} id="card">
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
        style={{
          justifyItems: "center",
          alignItems: "center",
          textAlign: "center",
          maxWidth: "fit-content",
          marginRight: "12px",
        }}
      >
        <ButtonBase action={focusVisible} id="card">
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

  //slider change handler
  const handleChange = (event, newValue) => {
    console.log(`newValue : ${newValue}`);
    setgridSize(newValue);
  };

  let Div = ({ heading }) => {
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
              <Card isActive={true} title="Spotlight" Icon={SpotlightIcon} />
              <Card isActive={false} title="Sidebar" Icon={SideBarIcon} />
              <Card isActive={false} title="Grid" Icon={GridIcon} />
            </>
          ) : (
            <>
              <Card isActive={true} title="Speaker" Icon={SpeakerIcon} />
              <Card
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
      <Div heading="Layout" />
      <Div heading="Priority" />
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
          onChange={handleChange}
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
    </Box>
  );
}
export default ConfigTabPanel;
