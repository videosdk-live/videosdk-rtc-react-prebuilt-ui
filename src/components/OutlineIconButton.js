import {
  Badge,
  Box,
  ButtonBase,
  Tooltip,
  Typography,
  useTheme,
} from "@material-ui/core";
import React, { useEffect, useState, useRef } from "react";
import { appThemes, useMeetingAppContext } from "../MeetingAppContextDef";
import useResponsiveSize from "../utils/useResponsiveSize";
import Lottie from "react-lottie";

const OutlineIconButton = ({
  badge,
  onClick,
  Icon,
  isFocused,
  bgColor,
  focusBGColor,
  focusIconColor,
  disabledOpacity,
  disabled,
  large,
  renderRightComponent,
  tooltipTitle,
  btnID,
  buttonText,
  lottieOption,
  isRequestProcessing,
  color,
}) => {
  const theme = useTheme();
  const [mouseOver, setMouseOver] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);
  const [blinkingState, setBlinkingState] = useState(1);

  const intervalRef = useRef();

  const iconSize = useResponsiveSize({
    xl: 24 * (large ? 1.7 : 1),
    lg: 24 * (large ? 1.7 : 1),
    md: 32 * (large ? 1.7 : 1),
    sm: 28 * (large ? 1.7 : 1),
    xs: 24 * (large ? 1.7 : 1),
  });

  const { animationsEnabled, themeColor } = useMeetingAppContext();

  const startBlinking = () => {
    intervalRef.current = setInterval(() => {
      setBlinkingState((s) => (s === 1 ? 0.4 : 1));
    }, 600);
  };

  const stopBlinking = () => {
    clearInterval(intervalRef.current);

    setBlinkingState(1);
  };

  useEffect(() => {
    if (isRequestProcessing) {
      startBlinking();
    } else {
      stopBlinking();
    }
  }, [isRequestProcessing]);

  useEffect(() => {
    return () => {
      stopBlinking();
    };
  }, []);

  return (
    <Tooltip placement="bottom" title={tooltipTitle || ""}>
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: theme.spacing(1),
          // overflow: "hidden",
          backgroundColor: bgColor
            ? bgColor
            : isFocused
            ? focusBGColor || "#fff"
            : themeColor === appThemes.DARK
            ? theme.palette.darkTheme.main
            : themeColor === appThemes.LIGHT
            ? theme.palette.lightTheme.main
            : theme.palette.background.default,
          border: `${2}px solid ${
            mouseOver || mouseDown
              ? "transparent"
              : bgColor
              ? bgColor
              : focusBGColor
              ? themeColor === appThemes.LIGHT
                ? theme.palette.lightTheme.outlineColor
                : focusBGColor
              : themeColor === appThemes.LIGHT
              ? theme.palette.lightTheme.outlineColor
              : "#ffffff33"
          }`,
          transition: `all ${200 * (animationsEnabled ? 1 : 0.5)}ms`,
          transitionTimingFunction: "linear",
          opacity: blinkingState,
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
            {Icon && (
              <Badge max={1000} color={"secondary"} badgeContent={badge}>
                {lottieOption ? (
                  <Box
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
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
                      color: isFocused
                        ? focusIconColor || themeColor === appThemes.LIGHT
                          ? theme.palette.common.white
                          : "#1C1F2E"
                        : color
                        ? color
                        : themeColor === appThemes.LIGHT
                        ? theme.palette.lightTheme.contrastText
                        : "#fff",
                      height: iconSize,
                      width: iconSize,
                    }}
                    fillColor={
                      isFocused
                        ? focusIconColor || themeColor === appThemes.LIGHT
                          ? theme.palette.common.white
                          : "#1C1F2E"
                        : color
                        ? color
                        : themeColor === appThemes.LIGHT
                        ? theme.palette.lightTheme.contrastText
                        : "#fff"
                    }
                  />
                )}
              </Badge>
            )}
          </Box>
          {buttonText ? (
            <Typography variant="subtitle2" style={{ fontWeight: "bold" }}>
              {buttonText}
            </Typography>
          ) : null}
        </ButtonBase>
        {typeof renderRightComponent === "function" && renderRightComponent()}
      </Box>
    </Tooltip>
  );
};

export default OutlineIconButton;
