import React, { useEffect, useState } from "react";
import { useMeetingAppContext } from "../../MeetingAppContextDef";
import { useSpring, animated } from 'react-spring';
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


  const { animationsEnabled } = useMeetingAppContext();

  const animeConfig = { tension: 180, friction: 22 };

  const animatedProps = useSpring({
    to: {
      top: relativeTop,
      left: relativeLeft,
      height: relativeHeight,
      width: relativeWidth,
      scale: mounted ? 1 : (animationsEnabled ? 0 : 0.5),
    },
    config: animeConfig,
  });




  return (
    <animated.div
      style={{
        position: 'absolute',
        top: animatedProps.top.interpolate((val) => `${val}%`),
        left: animatedProps.left.interpolate((val) => `${val}%`),
        height: animatedProps.height.interpolate((val) => `${val}%`),
        width: animatedProps.width.interpolate((val) => `${val}%`),
        paddingTop: gutter,
        paddingBottom: gutter,
        paddingRight: gutter,
        paddingLeft: gutter,
        transform: animatedProps.scale.interpolate((val) => `scale(${val})`),
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
    </animated.div>
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
