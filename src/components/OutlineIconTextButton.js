import {
  Box,
  ButtonBase,
  Tooltip,
  Typography,
  useTheme,
} from "@material-ui/core";
import React, { useState } from "react";
import { useMeetingAppContext } from "../MeetingAppContextDef";

const OutlineIconTextButton = ({
  onClick,
  isFocused,
  bgColor,
  focusBGColor,
  disabled,
  renderRightComponent,
  liveStreamStarted,
  tooltipTitle,
  btnID,
  buttonText,
}) => {
  const theme = useTheme();
  const [mouseOver, setMouseOver] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);

  const { animationsEnabled } = useMeetingAppContext();

  return (
    <Tooltip placement="bottom" title={tooltipTitle || ""}>
      <ButtonBase
        id={btnID}
        onMouseEnter={() => {
          setMouseOver(true);
        }}
        onMouseLeave={() => {
          setMouseOver(false);
        }}
        onMouseDown={() => {
          setMouseDown(true);
        }}
        onMouseUp={() => {
          setMouseDown(false);
        }}
        disabled={disabled}
        onClick={onClick}
        style={{
          padding: "8px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: theme.spacing(1),
          overflow: "hidden",
          backgroundColor: bgColor
            ? bgColor
            : isFocused
            ? focusBGColor || "#fff"
            : theme.palette.background.default,
          border: `${2}px solid ${
            mouseOver || mouseDown
              ? "transparent"
              : bgColor
              ? bgColor
              : focusBGColor
              ? focusBGColor
              : "#ffffff33"
          }`,
          transition: `all ${200 * (animationsEnabled ? 1 : 0.5)}ms`,
          transitionTimingFunction: "linear",
          cursor: "pointer",
        }}
      >
        <Box
          style={{
            opacity: disabled ? 0.7 : 1,
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: theme.spacing(1),
            transform: `scale(${mouseOver ? (mouseDown ? 0.97 : 1.05) : 1})`,
            transition: `all ${200 * (animationsEnabled ? 1 : 0.5)}ms`,
            transitionTimingFunction: "linear",
          }}
        >
          {buttonText ? (
            liveStreamStarted ? (
              <Typography
                variant="subtitle2"
                style={{
                  fontWeight: "bold",
                  color: "#D32F2F",
                }}
              >
                {buttonText}
              </Typography>
            ) : (
              <Typography
                variant="subtitle2"
                style={{
                  fontWeight: "bold",
                  color: isFocused ? "#1C1F2E" : "#fff",
                }}
              >
                {buttonText}
              </Typography>
            )
          ) : null}
        </Box>

        {typeof renderRightComponent === "function" && renderRightComponent()}
      </ButtonBase>
    </Tooltip>
  );
};

export default OutlineIconTextButton;
