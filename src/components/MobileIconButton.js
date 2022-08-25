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

const MobileIconButton = ({
  badge,
  onClick,
  Icon,
  isFocused,
  bgColor,
  focusBGColor,
  disabledOpacity,
  focusIconColor,
  disabled,
  large,
  // liveStreamStarted,
  // renderRightComponent,
  tooltipTitle,
  btnID,
  isActive,
  buttonText,
  lottieOption,
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
        p={1}
        style={{
          borderRadius: theme.spacing(1),
          // overflow: "hidden",
          transition: `all ${200 * (animationsEnabled ? 1 : 0.5)}ms`,
          transitionTimingFunction: "linear",
        }}
      >
        <ButtonBase
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
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
          <Box
            p={1}
            style={{
              opacity: disabled ? disabledOpacity || 0.7 : 1,
              // overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: theme.spacing(1),
              transform: `scale(${mouseOver ? (mouseDown ? 0.95 : 1.1) : 1})`,
              transition: `all ${200 * (animationsEnabled ? 1 : 0.5)}ms`,
              transitionTimingFunction: "linear",
            }}
          >
            <Badge max={1000} color={"secondary"} badgeContent={badge}>
              {lottieOption ? (
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: bgColor,
                    padding: "5px",
                    borderRadius: "5px",
                  }}
                >
                  <Lottie
                    style={{ height: iconSize }}
                    options={lottieOption}
                    eventListeners={[{ eventName: "done" }]}
                    height={iconSize}
                    width={
                      (iconSize * lottieOption?.width) / lottieOption?.height
                    }
                    isClickToPauseDisabled
                  />
                </Box>
              ) : (
                <Icon
                  style={{
                    color: isFocused ? focusIconColor || "#fff" : "#95959E",
                    height: iconSize,
                    width: iconSize,
                  }}
                  fillColor={isFocused ? "#fff" : "#95959E"}
                />
              )}
            </Badge>
          </Box>
          <Box>
            {buttonText ? (
              <Typography
                variant="subtitle2"
                style={{
                  fontWeight: "bold",
                  color: isFocused ? "#fff" : "#95959E",
                }}
              >
                {buttonText}
              </Typography>
            ) : null}
          </Box>
        </ButtonBase>
        {/* {typeof renderRightComponent === "function" && renderRightComponent()} */}
      </Box>
    </Tooltip>
  );
};

export default MobileIconButton;
