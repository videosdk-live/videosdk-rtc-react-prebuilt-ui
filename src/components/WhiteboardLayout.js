import { useMeeting } from "@videosdk.live/react-sdk";
import React, { useMemo } from "react";
import WhiteboardContainer, {
  convertHWAspectRatio,
} from "../components/whiteboard/WhiteboardContainer";
import { meetingLayouts, useMeetingAppContext } from "../MeetingAppContextDef";
import {
  getGridForMainParticipants,
  getGridRowsAndColumns,
  localAndPinnedOnTop,
} from "../utils/common";
import useIsMobile from "../utils/useIsMobile";
import useResponsiveSize from "../utils/useResponsiveSize";

export const WhiteboardLayout = ({
  height,
  width,
  whiteboardToolbarWidth,
  whiteboardSpacing,
}) => {
  const mMeeting = useMeeting();
  const localParticipantId = mMeeting?.localParticipant?.id;
  const isMobile = useIsMobile();

  const rowSpacing = useResponsiveSize({
    xl: 24,
    lg: 16,
    md: 14,
    sm: 12,
    xs: 8,
  });

  const presentingSideBarWidth = useResponsiveSize({
    xl: 320,
    lg: 280,
    md: 260,
    sm: 240,
    xs: 200,
  });

  const gutter = 4;

  const {
    mainViewParticipants,
    meetingLayout,
    whiteboardStarted,
    hideLocalParticipant,
    reduceEdgeSpacing,
  } = useMeetingAppContext();

  let mainParticipants = [...mainViewParticipants];

  const spacing = reduceEdgeSpacing ? 4 : rowSpacing - gutter;

  const singleRow = useMemo(() => {
    const { singleRow } = getGridForMainParticipants({
      participants: localAndPinnedOnTop({
        localParticipantId: hideLocalParticipant ? null : localParticipantId,
        participants: mainParticipants,
        pinnedParticipantIds:
          meetingLayout === meetingLayouts.UNPINNED_SIDEBAR ||
          meetingLayout === meetingLayouts.UNPINNED_SPOTLIGHT
            ? []
            : [...mMeeting.pinnedParticipants.keys()],
        moveLocalUnpinnedOnTop:
          mMeeting.pinnedParticipants.size &&
          meetingLayout !== meetingLayouts.GRID
            ? false
            : true,
      }),
      //   gridInfo,
    });
    return singleRow;
  }, [singleRow]);

  const actualPresentingSideBarWidth = useMemo(
    () => (singleRow.length ? presentingSideBarWidth : 0),
    [singleRow, presentingSideBarWidth]
  );

  return (
    <WhiteboardContainer
      {...{
        ...convertHWAspectRatio({
          height:
            height - 2 * spacing - (whiteboardToolbarWidth === 0 ? 2 * 16 : 0),
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
        originalWidth:
          width - (isMobile ? 0 : actualPresentingSideBarWidth) - 2 * spacing,
        originalWidth: whiteboardStarted
          ? width - (isMobile ? 0 : actualPresentingSideBarWidth) - 2 * spacing
          : 0,
      }}
    />
  );
};
