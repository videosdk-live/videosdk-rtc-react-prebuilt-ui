// import React from "react";
// import WhiteboardContainer, {
//   convertHWAspectRatio,
// } from "../../components/whiteboard/WhiteboardContainer";
// import useIsMobile from "../../utils/useIsMobile";

// export const WhiteBoardViewContainer = ({
//   pinnedParticipants,
//   height,
//   width,
//   whiteboardToolbarWidth,
//   whiteboardSpacing,
// }) => {
//   const isMobile = useIsMobile();

//   return pinnedParticipants.size > 0 ? (
//     ""
//   ) : (
//     <WhiteboardContainer
//       {...{
//         ...convertHWAspectRatio({
//           height:
//             height - 2 * spacing - (whiteboardToolbarWidth === 0 ? 2 * 16 : 0),
//           width: whiteboardStarted
//             ? width -
//               (isMobile ? 0 : presentingSideBarWidth) -
//               2 * spacing -
//               (whiteboardToolbarWidth + 2 * whiteboardSpacing) -
//               (whiteboardToolbarWidth === 0 ? 2 * 16 : 0)
//             : 0,
//         }),
//         whiteboardToolbarWidth,
//         whiteboardSpacing,
//         originalHeight: height - 2 * spacing,
//         originalWidth: whiteboardStarted
//           ? width - (isMobile ? 0 : actualPresentingSideBarWidth) - 2 * spacing
//           : 0,
//       }}
//     />
//   );
// };
