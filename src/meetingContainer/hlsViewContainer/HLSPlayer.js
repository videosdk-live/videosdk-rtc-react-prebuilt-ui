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
  participantId,
  gutter,
  quality,
  relativeHeight,
  relativeWidth,
  relativeTop,
  relativeLeft,
  useVisibilitySensor,
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
  participantId,
  gutter,
  quality,
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
        participantId,
        gutter,
        quality,
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
    prevProps.participantId === nextProps.participantId &&
    prevProps.gutter === nextProps.gutter &&
    prevProps.quality === nextProps.quality &&
    prevProps.relativeHeight === nextProps.relativeHeight &&
    prevProps.relativeWidth === nextProps.relativeWidth &&
    prevProps.relativeTop === nextProps.relativeTop &&
    prevProps.relativeLeft === nextProps.relativeLeft &&
    prevProps.downstreamUrl === nextProps.downstreamUrl &&
    prevProps.useVisibilitySensor === nextProps.useVisibilitySensor
);

const HLSPlayer = ({ height, width }) => {
  const [downstreamUrl, setDownstreamUrl] = useState(null);
  const _handleOnHlsStarted = (data) => {
    console.log("HLS started", data);
    setDownstreamUrl(data);
  };

  const _handleOnHlsStopped = () => {
    console.log("HLS stopped");
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

  const mainScreenViewActive = useMemo(
    () =>
      presenterId ||
      whiteboardStarted ||
      meetingLayout === meetingLayouts.UNPINNED_SIDEBAR ||
      meetingLayout === meetingLayouts.UNPINNED_SPOTLIGHT,
    [presenterId, whiteboardStarted, meetingLayout]
  );

  const presentingSideBarWidth = useResponsiveSize({
    xl: 320,
    lg: 280,
    md: 260,
    sm: 240,
    xs: 200,
  });

  const { singleRow, mainLayoutParticipantId } = useMemo(() => {
    let mainLayoutParticipantId;

    let _pinnedParticipants = new Map(pinnedParticipants);

    let mainParticipants = [...mainViewParticipants];

    // if (presenterId || whiteboardStarted) {
    //   const remainingParticipants = [...participants.keys()].filter(
    //     (pId) => mainParticipants.findIndex((id) => id === pId) === -1
    //   );

    //   mainParticipants = [...mainParticipants, ...remainingParticipants];
    // }

    if (hideLocalParticipant) {
      mainParticipants = mainParticipants.filter(
        (id) => id !== localParticipantId
      );

      _pinnedParticipants.delete(localParticipantId);
      _pinnedParticipants = new Map(_pinnedParticipants);
    }

    if (meetingLayout === meetingLayouts.UNPINNED_SIDEBAR) {
      if (!(!!presenterId || !!whiteboardStarted)) {
        if (_pinnedParticipants.size === 0) {
          if (activeSpeakerId) {
            mainParticipants = mainParticipants.filter(
              (id) => id !== activeSpeakerId
            );
            mainLayoutParticipantId = activeSpeakerId;
          } else {
            mainParticipants = mainParticipants.filter(
              (id) => id !== lastActiveParticipantId
            );
            mainLayoutParticipantId = lastActiveParticipantId;
          }
        } else {
          if (activeSpeakerId) {
            const pinnedActiveSpeaker =
              _pinnedParticipants.get(activeSpeakerId);

            if (pinnedActiveSpeaker) {
              mainParticipants = mainParticipants.filter(
                (id) => id !== activeSpeakerId
              );

              _pinnedParticipants.delete(activeSpeakerId);
              _pinnedParticipants = new Map(_pinnedParticipants);

              mainLayoutParticipantId = activeSpeakerId;
            } else {
              const firstPinnedParticipantId = _pinnedParticipants
                .keys()
                .next().value;

              mainParticipants = mainParticipants.filter(
                (id) => id !== firstPinnedParticipantId
              );

              _pinnedParticipants.delete(firstPinnedParticipantId);
              _pinnedParticipants = new Map(_pinnedParticipants);

              mainLayoutParticipantId = firstPinnedParticipantId;
            }
          } else {
            const lastActivePinnedParticipant = _pinnedParticipants.get(
              lastActiveParticipantId
            );

            if (lastActivePinnedParticipant) {
              mainParticipants = mainParticipants.filter(
                (id) => id !== lastActiveParticipantId
              );
              _pinnedParticipants.delete(lastActiveParticipantId);
              _pinnedParticipants = new Map(_pinnedParticipants);

              mainLayoutParticipantId = lastActiveParticipantId;
            } else {
              const firstPinnedParticipantId = _pinnedParticipants
                .keys()
                .next().value;

              mainParticipants = mainParticipants.filter(
                (id) => id !== firstPinnedParticipantId
              );

              _pinnedParticipants.delete(firstPinnedParticipantId);
              _pinnedParticipants = new Map(_pinnedParticipants);

              mainLayoutParticipantId = firstPinnedParticipantId;
            }
          }
        }
      } else {
        if (_pinnedParticipants.size === 0) {
          if (activeSpeakerId) {
            let activeIndex = mainParticipants.findIndex(
              (id) => id === activeSpeakerId
            );

            if (activeIndex !== -1) {
              const firstMainParticipantId = mainParticipants[0];
              mainParticipants[0] = activeSpeakerId;
              mainParticipants[activeIndex] = firstMainParticipantId;

              _pinnedParticipants.delete(firstMainParticipantId);
              _pinnedParticipants = new Map(_pinnedParticipants);
            } else {
              const mainGridRemovedParticipantId = mainParticipants.pop();

              mainParticipants[0] = activeSpeakerId;

              _pinnedParticipants.delete(mainGridRemovedParticipantId);
              _pinnedParticipants = new Map(_pinnedParticipants);
            }
          } else {
          }
        } else {
          if (activeSpeakerId) {
          } else {
          }
        }
      }
    } else if (meetingLayout === meetingLayouts.UNPINNED_SPOTLIGHT) {
      if (!!presenterId || !!whiteboardStarted) {
        mainParticipants = [];
      } else {
        mainParticipants = [];
        mainLayoutParticipantId = activeSpeakerId || lastActiveParticipantId;
      }
    }

    let participantsCount = mainParticipants?.length;

    if (participantsCount > layoutGridSize) {
      mainParticipants = mainParticipants.slice(0, layoutGridSize);
      const remainingMainParticipants = mainParticipants.splice(layoutGridSize);

      remainingMainParticipants.forEach((p) => {
        _pinnedParticipants.delete(p);
      });

      _pinnedParticipants = new Map(_pinnedParticipants);

      participantsCount = mainParticipants?.length;
    }

    if (mainScreenViewActive && participantsCount > sideStackSize) {
      mainParticipants = mainParticipants.slice(0, sideStackSize);
      const remainingMainParticipants = mainParticipants.splice(sideStackSize);

      remainingMainParticipants.forEach((p) => {
        _pinnedParticipants.delete(p);
      });

      _pinnedParticipants = new Map(_pinnedParticipants);

      participantsCount = mainParticipants?.length;
    }

    const gridInfo = getGridRowsAndColumns({
      participantsCount,
      isMobile,
      isTab,
      isSMDesktop,
      isLGDesktop,
      isLandscape: !isPortrait,
      isPresenting: !!mainScreenViewActive,
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
    mainScreenViewActive,
  ]);
  const actualPresentingSideBarWidth = useMemo(
    () => (singleRow.length ? presentingSideBarWidth : 0),
    [singleRow, presentingSideBarWidth]
  );

  const rowSpacing = useResponsiveSize({
    xl: 24,
    lg: 16,
    md: 14,
    sm: 12,
    xs: 8,
  });

  const mobilePortrait = isMobile && isPortrait;

  const gutter = 4;

  const spacing = reduceEdgeSpacing ? 4 : rowSpacing - gutter;

  const theme = useTheme();

  const mainContainerHorizontalPadding = useMemo(
    () =>
      //   presenterId ||
      //   whiteboardStarted ||
      mainLayoutParticipantId && singleRow.length !== 0
        ? 0
        : typeof sideBarMode === "string"
        ? 0
        : mainViewParticipants?.length <= 9
        ? isLGDesktop
          ? !mainScreenViewActive && singleRow.length === 2
            ? 0
            : 140
          : isSMDesktop
          ? !mainScreenViewActive && singleRow.length === 2
            ? 20
            : 90
          : isTab && !isPortrait
          ? 60
          : 0
        : 0,
    [
      mainScreenViewActive,
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
  console.log("downstreamUrl", downstreamUrl);
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
          width: mainScreenViewActive
            ? width - actualPresentingSideBarWidth
            : 0,
          height,
          transition: `all ${800 * (animationsEnabled ? 1 : 0.5)}ms`,
          transitionTimingFunction: "ease-in-out",
          paddingLeft: mainScreenViewActive ? spacing : 0,
          paddingTop: mainScreenViewActive ? spacing : 0,
        }}
      >
        <div
          style={{
            height: height - 2 * spacing,
            width: mainScreenViewActive
              ? width -
                (isMobile ? 0 : actualPresentingSideBarWidth) -
                2 * spacing
              : 0,
            backgroundColor: undefined,
            //   presenterId || whiteboardStarted
            //     ? theme.palette.background.paper
            //     : undefined,
            transition: `width ${800 * (animationsEnabled ? 1 : 0.5)}ms`,
            transitionTimingFunction: "ease-in-out",
            borderRadius: theme.spacing(1),
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* {!presenterId && !whiteboardStarted && mainLayoutParticipantId && ( */}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: mainContainerHorizontalPadding,
              right: mainContainerHorizontalPadding,
            }}
          >
            <MemoizedMotionPlayer
              {...{
                participantId: mainLayoutParticipantId,
                gutter,
                quality: "high",
                relativeHeight: 100,
                relativeWidth: 100,
                relativeTop: 0,
                relativeLeft: 0,
                downstreamUrl,
              }}
              key={`mainLayoutParticipantId_${mainLayoutParticipantId}`}
            />
          </div>
          {/* )} */}
        </div>
      </div>

      {/* Memorized participant mobile view */}
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
