import { useMeeting } from "@videosdk.live/react-sdk";
import React, { useEffect, useMemo, useState } from "react";
import ParticipantViewer from "./ParticipantViewer";
import PresenterView from "./PresenterView";
import {
  getGridRowsAndColumns,
  getGridForMainParticipants,
  calcQuality,
  localAndPinnedOnTop,
} from "../../utils/common";
import useIsMobile from "../../utils/useIsMobile";
import useIsTab from "../../utils/useIsTab";
import useIsSMDesktop from "../../utils/useIsSMDesktop";
import useIsLGDesktop from "../../utils/useIsLGDesktop";
import {
  meetingLayouts,
  useMeetingAppContext,
} from "../../MeetingAppContextDef";
import { Motion as TransitionMotion, spring } from "react-motion";
import { useTheme } from "@material-ui/core";
import useResponsiveSize from "../../utils/useResponsiveSize";
import { useMediaQuery } from "react-responsive";
import WhiteboardContainer, {
  convertHWAspectRatio,
} from "../../components/whiteboard/WhiteboardContainer";

const MemoizedParticipant = React.memo(
  ParticipantViewer,
  (
    { participantId, quality, useVisibilitySensor },
    {
      participantId: oldParticipantId,
      quality: oldQuality,
      useVisibilitySensor: oldUseVisibilitySensor,
    }
  ) =>
    participantId === oldParticipantId &&
    quality === oldQuality &&
    useVisibilitySensor === oldUseVisibilitySensor
);

// const MotionParticipant = ({
//   participantId,
//   gutter,
//   quality,
//   relativeHeight,
//   relativeWidth,
//   relativeTop,
//   relativeLeft,
//   useVisibilitySensor,
// }) => {
//   return (
//     <div
//       style={{
//         position: "absolute",
//         top: `${relativeTop}%`,
//         left: `${relativeLeft}%`,
//         height: `${relativeHeight}%`,
//         width: `${relativeWidth}%`,
//         paddingTop: gutter,
//         paddingBottom: gutter,
//         paddingRight: gutter,
//         paddingLeft: gutter,
//       }}
//     >
//       <div
//         style={{
//           height: `calc(100% - ${2 * gutter}px)`,
//           width: `calc(100% - ${2 * gutter}px)`,
//         }}
//       >
//         <MemoizedParticipant
//           {...{ participantId, quality, useVisibilitySensor }}
//         />
//       </div>
//     </div>
//   );
// };

const MotionParticipant = ({
  participantId,
  gutter,
  quality,
  relativeHeight,
  relativeWidth,
  relativeTop,
  relativeLeft,
  useVisibilitySensor,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);

    return () => {
      setTimeout(() => setMounted(false), 100);
    };
  }, []);

  // const animeConfig = { stiffness:120, damping:21 };
  const animeConfig = { stiffness: 180, damping: 22 };

  return (
    <TransitionMotion
      style={{
        top: spring(relativeTop, animeConfig),
        left: spring(relativeLeft, animeConfig),
        height: spring(relativeHeight, animeConfig),
        width: spring(relativeWidth, animeConfig),
        scale: spring(mounted ? 1 : 0, animeConfig),
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
            <MemoizedParticipant
              {...{ participantId, quality, useVisibilitySensor }}
            />
          </div>
        </div>
      )}
    </TransitionMotion>
  );
};

export const MemoizedMotionParticipant = React.memo(
  MotionParticipant,
  (prevProps, nextProps) =>
    prevProps.participantId === nextProps.participantId &&
    prevProps.gutter === nextProps.gutter &&
    prevProps.quality === nextProps.quality &&
    prevProps.relativeHeight === nextProps.relativeHeight &&
    prevProps.relativeWidth === nextProps.relativeWidth &&
    prevProps.relativeTop === nextProps.relativeTop &&
    prevProps.relativeLeft === nextProps.relativeLeft &&
    prevProps.useVisibilitySensor === nextProps.useVisibilitySensor
);

const MainViewContainer = ({
  height,
  width,
  whiteboardToolbarWidth,
  whiteboardSpacing,
}) => {
  const mMeeting = useMeeting();

  const participants = mMeeting?.participants;
  const presenterId = mMeeting?.presenterId;
  const localParticipantId = mMeeting?.localParticipant?.id;
  const pinnedParticipants = mMeeting?.pinnedParticipants;
  const isMobile = useIsMobile();
  const isTab = useIsTab();
  const isSMDesktop = useIsSMDesktop();
  const isLGDesktop = useIsLGDesktop();

  const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });

  const rowSpacing = useResponsiveSize({
    xl: 24,
    lg: 16,
    md: 14,
    sm: 12,
    xs: 8,
  });

  const gutter = 4;

  const {
    mainViewParticipants,
    sideBarMode,
    meetingLayout,
    whiteboardStarted,
  } = useMeetingAppContext();

  const { singleRow } = useMemo(() => {
    let mainParticipants = [...mainViewParticipants];

    if (presenterId || whiteboardStarted) {
      const remainingParticipants = [...participants.keys()].filter(
        (pId) => mainParticipants.findIndex((id) => id === pId) === -1
      );

      mainParticipants = [...mainParticipants, ...remainingParticipants];
    }

    const participantsCount = mainParticipants?.length || 1;

    const gridInfo = getGridRowsAndColumns({
      participantsCount,
      isMobile,
      isTab,
      isSMDesktop,
      isLGDesktop,
      isLandscape: !isPortrait,
      isPresenting: !!(presenterId || whiteboardStarted),
    });

    const { singleRow } = getGridForMainParticipants({
      participants: localAndPinnedOnTop({
        localParticipantId,
        participants: mainParticipants,
        pinnedParticipantIds: [...pinnedParticipants.keys()],
        moveLocalUnpinnedOnTop:
          pinnedParticipants.size && meetingLayout !== meetingLayouts.GRID
            ? false
            : true,
      }),
      gridInfo,
    });

    return { singleRow };
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
  ]);

  const spacing = rowSpacing - gutter;

  const theme = useTheme();

  const presentingSideBarWidth = useResponsiveSize({
    xl: 320,
    lg: 280,
    md: 260,
    sm: 240,
    xs: 200,
  });

  const mainContainerHorizontalPadding =
    presenterId || whiteboardStarted
      ? 0
      : typeof sideBarMode === "string"
      ? 0
      : mainViewParticipants?.length <= 9
      ? isLGDesktop
        ? !(presenterId || whiteboardStarted) && singleRow.length === 2
          ? 0
          : 140
        : isSMDesktop
        ? !(presenterId || whiteboardStarted) && singleRow.length === 2
          ? 20
          : 90
        : isTab && !isPortrait
        ? 60
        : 0
      : 0;

  const gridVerticalSpacing = useResponsiveSize({
    xl: 160,
    lg: 90,
    md: 90,
    sm: 60,
    xs: 60,
  });

  return participants ? (
    <>
      <div
        style={{
          width,
          backgroundColor: theme.palette.background.default,
          overflow: "hidden",
          transition: "width 400ms",
          transitionTimingFunction: "ease-in-out",
          display: "flex",
          position: "relative",
        }}
      >
        <div
          style={{
            width:
              presenterId || whiteboardStarted
                ? width - presentingSideBarWidth
                : 0,
            height,
            transition: "width 800ms",
            transitionTimingFunction: "ease-in-out",
            paddingLeft: presenterId || whiteboardStarted ? spacing : 0,
            paddingTop: presenterId || whiteboardStarted ? spacing : 0,
          }}
        >
          <div
            style={{
              height: height - 2 * spacing,
              width:
                presenterId || whiteboardStarted
                  ? width -
                    (isMobile ? 0 : presentingSideBarWidth) -
                    2 * spacing
                  : 0,
              backgroundColor: theme.palette.background.paper,
              // backgroundColor: "pink",
              transition: "width 800ms",
              transitionTimingFunction: "ease-in-out",
              borderRadius: theme.spacing(1),
              overflow: "hidden",
            }}
          >
            {whiteboardStarted && (
              <WhiteboardContainer
                {...{
                  ...convertHWAspectRatio({
                    height:
                      height -
                      2 * spacing -
                      (whiteboardToolbarWidth === 0 ? 2 * 16 : 0),
                    width: whiteboardStarted
                      ? width -
                        (isMobile ? 0 : presentingSideBarWidth) -
                        2 * spacing -
                        (whiteboardToolbarWidth + 2 * whiteboardSpacing) -
                        (whiteboardToolbarWidth === 0 ? 2 * 16 : 0)
                      : 0,
                  }),
                  whiteboardToolbarWidth,
                  whiteboardSpacing,
                  originalHeight: height - 2 * spacing,
                  originalWidth: whiteboardStarted
                    ? width -
                      (isMobile ? 0 : presentingSideBarWidth) -
                      2 * spacing
                    : 0,
                }}
              />
            )}
            {presenterId && <PresenterView presenterId={presenterId} />}
          </div>
        </div>
        {isMobile && (presenterId || whiteboardStarted) ? null : (
          <div
            style={{
              backgroundColor: theme.palette.background.default,
              overflowX: "hidden",
              overflowY: presenterId || whiteboardStarted ? "scroll" : "hidden",
              width:
                presenterId || whiteboardStarted
                  ? presentingSideBarWidth
                  : width - 2 * spacing,
              height:
                height -
                2 * spacing -
                (singleRow.length === 2 &&
                !(presenterId || whiteboardStarted) &&
                !isMobile
                  ? 2 * gridVerticalSpacing
                  : 0),
              margin: spacing,
              transition: "all 800ms",
              transitionTimingFunction: "ease-in-out",
              paddingLeft:
                mainContainerHorizontalPadding +
                (!(presenterId || whiteboardStarted) &&
                singleRow.length > 12 &&
                singleRow.length < 17 &&
                typeof sideBarMode !== "string"
                  ? 160
                  : 0),
              paddingRight:
                mainContainerHorizontalPadding +
                (!(presenterId || whiteboardStarted) &&
                singleRow.length > 12 &&
                singleRow.length < 17 &&
                typeof sideBarMode !== "string"
                  ? 160
                  : 0),
              paddingTop:
                singleRow.length === 2 &&
                !(presenterId || whiteboardStarted) &&
                !isMobile
                  ? gridVerticalSpacing
                  : 0,
            }}
          >
            <div
              style={{
                height:
                  (presenterId || whiteboardStarted
                    ? (singleRow.length * presentingSideBarWidth * 2) / 3
                    : height) -
                  2 * spacing -
                  (singleRow.length === 2 &&
                  !(presenterId || whiteboardStarted) &&
                  !isMobile
                    ? 2 * gridVerticalSpacing
                    : 0),
                position: "relative",
                transition: "height 800ms",
                transitionTimingFunction: "ease-in-out",
              }}
            >
              {singleRow.map((c) => (
                <MemoizedMotionParticipant
                  quality={calcQuality(mainViewParticipants?.length || 1)}
                  key={`main_participant_${c.participantId}`}
                  {...c}
                  gutter={gutter}
                  useVisibilitySensor={
                    presenterId || whiteboardStarted ? true : false
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  ) : null;
};

export default React.memo(
  MainViewContainer,
  (prevProps, nextProps) =>
    prevProps.width === nextProps.width && prevProps.height === nextProps.height
);
