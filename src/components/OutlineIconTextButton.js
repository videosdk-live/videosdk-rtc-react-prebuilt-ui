import {
  Badge,
  Box,
  ButtonBase,
  Tooltip,
  Typography,
  useTheme,
} from "@material-ui/core";
import React, { useState } from "react";
import { useMeetingAppContext } from "../MeetingAppContextDef";
import useResponsiveSize from "../utils/useResponsiveSize";
import Lottie from "react-lottie";

const OutlineIconTextButton = ({
  onClick,
  isFocused,
  bgColor,
  focusBGColor,
  disabled,
  large,
  renderRightComponent,
  tooltipTitle,
  btnID,
  buttonText,
}) => {
  const theme = useTheme();
  const [mouseOver, setMouseOver] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);

  const iconSize = useResponsiveSize({
    xl: 24 * (large ? 1.7 : 1),
    lg: 24 * (large ? 1.7 : 1),
    md: 32 * (large ? 1.7 : 1),
    sm: 28 * (large ? 1.7 : 1),
    xs: 24 * (large ? 1.7 : 1),
  });

  const { animationsEnabled } = useMeetingAppContext();

  return (
    <Tooltip placement="bottom" title={tooltipTitle || ""}>
      <Box
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
        }}
      >
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
        >
          {buttonText ? (
            <Typography
              variant="subtitle2"
              style={{
                fontWeight: "bold",
                color: isFocused ? "#1C1F2E" : "#fff",
              }}
            >
              {buttonText}
            </Typography>
          ) : null}
        </ButtonBase>
        {typeof renderRightComponent === "function" && renderRightComponent()}
      </Box>
    </Tooltip>
  );
};

export default OutlineIconTextButton;
