import { useTheme } from "@material-ui/core";
import { useMeeting } from "@videosdk.live/react-sdk";
import { useMediaQuery } from "react-responsive";
import React, { useEffect, useMemo, useState } from "react";
import {
  meetingLayouts,
  useMeetingAppContext,
} from "../../MeetingAppContextDef";
import {
  getGridForMainParticipants,
  getGridRowsAndColumns,
  localAndPinnedOnTop,
} from "../../utils/common";
import useIsLGDesktop from "../../utils/useIsLGDesktop";
import useIsMobile from "../../utils/useIsMobile";
import useIsSMDesktop from "../../utils/useIsSMDesktop";
import useIsTab from "../../utils/useIsTab";
import { Motion as TransitionMotion, spring } from "react-motion";
import useResponsiveSize from "../../utils/useResponsiveSize";
import PlayerViewer from "./PlayerViewer";

const MemoizedPlayer = ({ downstreamUrl }) => {
  return <PlayerViewer downstreamUrl={downstreamUrl} />;
};

const MotionPlayer = ({
  gutter,
  relativeHeight,
  relativeWidth,
  relativeTop,
  relativeLeft,
  downstreamUrl,
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
            <MemoizedPlayer
              {...{
                downstreamUrl,
              }}
            />
          </div>
        </div>
      )}
    </TransitionMotion>
  );
};

const MotionPlayerContainer = ({
  gutter,
  relativeHeight: height,
  relativeWidth: width,
  relativeTop: top,
  relativeLeft: left,
  useVisibilitySensor,
  downstreamUrl,
}) => {
  const { animationsEnabled } = useMeetingAppContext();

  return animationsEnabled ? (
    <MotionPlayer
      {...{
        gutter,
        relativeHeight: height,
        relativeWidth: width,
        relativeTop: top,
        relativeLeft: left,
        useVisibilitySensor,
        downstreamUrl,
      }}
    />
  ) : (
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
      }}
    >
      <div
        style={{
          height: `calc(100% - ${2 * gutter}px)`,
          width: `calc(100% - ${2 * gutter}px)`,
        }}
      >
        <MemoizedPlayer {...{ downstreamUrl }} />
      </div>
    </div>
  );
};

export const MemoizedMotionPlayer = React.memo(
  MotionPlayerContainer,
  (prevProps, nextProps) =>
    prevProps.gutter === nextProps.gutter &&
    prevProps.relativeHeight === nextProps.relativeHeight &&
    prevProps.relativeWidth === nextProps.relativeWidth &&
    prevProps.relativeTop === nextProps.relativeTop &&
    prevProps.relativeLeft === nextProps.relativeLeft &&
    prevProps.downstreamUrl === nextProps.downstreamUrl
);

const HLSPlayer = ({ height, width }) => {
  const [downstreamUrl, setDownstreamUrl] = useState(null);
  const _handleOnHlsStarted = (data) => {
    setDownstreamUrl(data);
  };

  const _handleOnHlsStopped = () => {
    // console.log("HLS stopped");
  };

  const mMeeting = useMeeting({
    onHlsStarted: _handleOnHlsStarted,
    onHlsStopped: _handleOnHlsStopped,
  });

  const participants = mMeeting?.participants;
  const presenterId = mMeeting?.presenterId;
  const localParticipantId = mMeeting?.localParticipant?.id;
  const pinnedParticipants = mMeeting?.pinnedParticipants;
  const activeSpeakerId = mMeeting?.activeSpeakerId;
  const mainParticipantId = mMeeting?.mainParticipant?.id;
  const isMobile = useIsMobile();
  const isTab = useIsTab();
  const isSMDesktop = useIsSMDesktop();
  const isLGDesktop = useIsLGDesktop();

  const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });
  const {
    mainViewParticipants,
    sideBarMode,
    meetingLayout,
    whiteboardStarted,
    activeSortedParticipants,
    animationsEnabled,
    layoutGridSize,
    hideLocalParticipant,
    sideStackSize,
    reduceEdgeSpacing,
  } = useMeetingAppContext();

  const lastActiveParticipantId = useMemo(
    () => activeSortedParticipants[0]?.participantId,
    [activeSortedParticipants]
  );

  const { singleRow, mainLayoutParticipantId } = useMemo(() => {
    let mainLayoutParticipantId;

    let _pinnedParticipants = new Map(pinnedParticipants);

    let mainParticipants = [...mainViewParticipants];

    let participantsCount = mainParticipants?.length;

    const gridInfo = getGridRowsAndColumns({
      participantsCount,
      isMobile,
      isTab,
      isSMDesktop,
      isLGDesktop,
      isLandscape: !isPortrait,
    });

    const { singleRow } = getGridForMainParticipants({
      participants: localAndPinnedOnTop({
        localParticipantId: hideLocalParticipant ? null : localParticipantId,
        participants: mainParticipants,
        pinnedParticipantIds:
          meetingLayout === meetingLayouts.UNPINNED_SIDEBAR ||
          meetingLayout === meetingLayouts.UNPINNED_SPOTLIGHT
            ? []
            : [..._pinnedParticipants.keys()],
        moveLocalUnpinnedOnTop:
          _pinnedParticipants.size && meetingLayout !== meetingLayouts.GRID
            ? false
            : true,
      }),
      gridInfo,
    });

    return { singleRow, mainLayoutParticipantId };
  }, [
    meetingLayout,
    participants,
    mainViewParticipants,
    isPortrait,
    isMobile,
    isTab,
    isSMDesktop,
    isLGDesktop,
    presenterId,
    whiteboardStarted,
    localParticipantId,
    pinnedParticipants,
    activeSpeakerId,
    lastActiveParticipantId,
    mainParticipantId,
    layoutGridSize,
    hideLocalParticipant,
    sideStackSize,
  ]);

  const rowSpacing = useResponsiveSize({
    xl: 24,
    lg: 16,
    md: 14,
    sm: 12,
    xs: 8,
  });

  const gutter = 4;

  const spacing = reduceEdgeSpacing ? 4 : rowSpacing - gutter;

  const theme = useTheme();

  const mainContainerHorizontalPadding = useMemo(
    () =>
      mainLayoutParticipantId && singleRow.length !== 0
        ? 0
        : typeof sideBarMode === "string"
        ? 0
        : mainViewParticipants?.length <= 9
        ? isLGDesktop
          ? singleRow.length === 2
            ? 140
            : 140
          : isSMDesktop
          ? singleRow.length === 2
            ? 90
            : 90
          : isTab && !isPortrait
          ? 60
          : 0
        : 0,
    [
      sideBarMode,
      mainViewParticipants,
      isLGDesktop,
      isSMDesktop,
      singleRow,
      isTab,
      isPortrait,
      whiteboardStarted,
      presenterId,
      mainLayoutParticipantId,
      meetingLayout,
    ]
  );

  return (
    <div
      style={{
        width,
        backgroundColor: theme.palette.background.default,
        overflow: "hidden",
        transition: `width ${400 * (animationsEnabled ? 1 : 0.5)}ms`,
        transitionTimingFunction: "ease-in-out",
        display: "flex",
        position: "relative",
      }}
    >
      <div
        style={{
          width: 0,
          height,
          transition: `all ${800 * (animationsEnabled ? 1 : 0.5)}ms`,
          transitionTimingFunction: "ease-in-out",
          paddingLeft: 0,
          paddingTop: 0,
        }}
      >
        <div
          style={{
            height: height - 2 * spacing,
            width: 0,
            backgroundColor: undefined,
            transition: `width ${800 * (animationsEnabled ? 1 : 0.5)}ms`,
            transitionTimingFunction: "ease-in-out",
            borderRadius: theme.spacing(1),
            overflow: "hidden",
            position: "relative",
          }}
        >
          {mainLayoutParticipantId && (
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                // left: mainContainerHorizontalPadding,
                // right: mainContainerHorizontalPadding,
              }}
            >
              <MemoizedMotionPlayer
                {...{
                  gutter,
                  relativeHeight: 100,
                  relativeWidth: 100,
                  relativeTop: 0,
                  relativeLeft: 0,
                  downstreamUrl,
                }}
                key={`mainLayoutParticipantId_${mainLayoutParticipantId}`}
              />
            </div>
          )}
        </div>
      </div>

      {/* Memorized participant mobile view */}
      {isMobile ? null : singleRow.length <= 0 ? null : (
        <div
          style={{
            backgroundColor: theme.palette.background.default,
            overflowX: "hidden",
            overflowY: "hidden",
            width: width - 2 * spacing,
            height: height - 2 * spacing,
            margin: spacing,
            transition: `all ${800 * (animationsEnabled ? 1 : 0.5)}ms`,
            transitionTimingFunction: "ease-in-out",
            // paddingLeft:
            //   mainContainerHorizontalPadding +
            //   (singleRow.length > 12 &&
            //   singleRow.length < 17 &&
            //   typeof sideBarMode !== "string"
            //     ? 160
            //     : 0),
            // paddingRight:
            //   mainContainerHorizontalPadding +
            //   (singleRow.length > 12 &&
            //   singleRow.length < 17 &&
            //   typeof sideBarMode !== "string"
            //     ? 160
            //     : 0),
          }}
        >
          <div
            style={{
              height: height - 2 * spacing,
              position: "relative",
              transition: `height ${800 * (animationsEnabled ? 1 : 0.5)}ms`,
              transitionTimingFunction: "ease-in-out",
            }}
          >
            <MemoizedMotionPlayer
              {...{
                gutter,
                relativeHeight: 100,
                relativeWidth: 100,
                relativeTop: 0,
                relativeLeft: 0,
                downstreamUrl,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(
  HLSPlayer,
  (prevProps, nextProps) =>
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height &&
    prevProps.whiteboardToolbarWidth === nextProps.whiteboardToolbarWidth &&
    prevProps.whiteboardSpacing === nextProps.whiteboardSpacing
);
