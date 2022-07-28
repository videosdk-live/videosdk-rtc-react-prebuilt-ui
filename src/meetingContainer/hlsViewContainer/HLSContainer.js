import React, { useEffect, useState } from "react";
import { useMeetingAppContext } from "../../MeetingAppContextDef";
import { Motion as TransitionMotion, spring } from "react-motion";
import useResponsiveSize from "../../utils/useResponsiveSize";
import PlayerViewer from "./PlayerViewer";

const MotionPlayer = ({
  gutter,
  relativeHeight,
  relativeWidth,
  relativeTop,
  relativeLeft,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);

    return () => {
      setTimeout(() => setMounted(false), 100);
    };
  }, []);

  const animeConfig = { stiffness: 180, damping: 22 };

  const { animationsEnabled } = useMeetingAppContext();

  return (
    <TransitionMotion
      style={{
        top: spring(relativeTop, animeConfig),
        left: spring(relativeLeft, animeConfig),
        height: spring(relativeHeight, animeConfig),
        width: spring(relativeWidth, animeConfig),
        scale: spring(mounted ? 1 : animationsEnabled ? 0 : 0.5, animeConfig),
      }}
    >
      {({ top, left, height, width, scale }) => (
        <div
          style={{
            position: "absolute",
            top: `${top}%`,
            left: `${left}%`,
            height: `${height}%`,
            width: `${width}%`,
            paddingTop: gutter,
            paddingBottom: gutter,
            paddingRight: gutter,
            paddingLeft: gutter,
            transform: `scale(${scale})`,
          }}
        >
          <div
            style={{
              height: `calc(100% - ${2 * gutter}px)`,
              width: `calc(100% - ${2 * gutter}px)`,
            }}
          >
            <PlayerViewer />
          </div>
        </div>
      )}
    </TransitionMotion>
  );
};

export const MemoizedMotionPlayer = React.memo(
  MotionPlayer,
  (prevProps, nextProps) =>
    prevProps.gutter === nextProps.gutter &&
    prevProps.relativeHeight === nextProps.relativeHeight &&
    prevProps.relativeWidth === nextProps.relativeWidth &&
    prevProps.relativeTop === nextProps.relativeTop &&
    prevProps.relativeLeft === nextProps.relativeLeft
);

const HLSContainer = ({ width }) => {
  const { animationsEnabled, reduceEdgeSpacing } = useMeetingAppContext();

  const rowSpacing = useResponsiveSize({
    xl: 24,
    lg: 16,
    md: 14,
    sm: 12,
    xs: 8,
  });

  const gutter = 4;

  const spacing = reduceEdgeSpacing ? 4 : rowSpacing - gutter;

  return (
    <div
      style={{
        height: `calc(100% - ${2 * spacing}px)`,
        width: width - 2 * spacing,
        margin: spacing,
        transition: `all ${800 * (animationsEnabled ? 1 : 0.5)}ms`,
        transitionTimingFunction: "ease-in-out",
        position: "relative",
      }}
    >
      <MemoizedMotionPlayer
        {...{
          gutter,
          relativeHeight: 100,
          relativeWidth: 100,
          relativeTop: 0,
          relativeLeft: 0,
        }}
      />
    </div>
  );
};

export default HLSContainer;
