import { Box, Button, Typography, useTheme } from "@material-ui/core";
import { useMeeting, usePubSub } from "@videosdk.live/react-sdk";
import { useMeetingAppContext } from "../../MeetingAppContextDef";
import useResponsiveSize from "../../utils/useResponsiveSize";

// const PollList = ({ panelHeight }) => {
//   const theme = useTheme();
//   const padding = useResponsiveSize({
//     xl: 12,
//     lg: 10,
//     md: 8,
//     sm: 6,
//     xs: 4,
//   });
//   const marginY = useResponsiveSize({
//     xl: 14,
//     lg: 12,
//     md: 10,
//     sm: 8,
//     xs: 6,
//   });
//   const { polls, setIsCreateNewPollClicked } = useMeetingAppContext();
//   return (
// <Box
//   style={{
//     // padding: padding,
//     height: panelHeight - 32,
//     // backgroundColor: "pink",
//   }}
// >
//   <Box
//     style={{
//       display: "flex",
//       flexDirection: "column",
//       justifyContent: "space-between",
//       flex: 1,
//       height: "100%",
//     }}
//   >
//     <Box
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         // backgroundColor: "purple",
//         // paddingBottom: 12,
//         // margin: padding,
//       }}
//     >
//       {polls.map((option, i) => {
//         console.log("option", option);
//         return (
//           <Box
//             style={{
//               borderBottom: "1px solid #70707033",
//               //   paddingBottom: 8,
//             }}
//           >
//             <Box
//               style={{
//                 margin: padding,
//                 marginTop: marginY,
//                 marginBottom: marginY,
//                 // backgroundColor: "purple",
//               }}
//             >
//               <Box
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   //   backgroundColor: "pink",
//                   padding: 0,
//                   margin: 0,
//                   // justifyContent: "center",
//                 }}
//               >
//                 <Typography
//                   style={{
//                     fontSize: 14,
//                     color: "#95959E",
//                     fontWeight: 500,
//                     marginTop: 0,
//                     marginBottom: 0,
//                   }}
//                 >{`Poll ${i + 1}`}</Typography>
//                 <p
//                   style={{
//                     marginLeft: 8,
//                     marginRight: 8,
//                     color: "#95959E",
//                     fontWeight: 500,
//                     marginTop: 0,
//                     marginBottom: 0,
//                   }}
//                 >
//                   &#x2022;
//                 </p>
//                 <Typography
//                   style={{
//                     fontSize: 14,
//                     color: "#FF5D5D",
//                     fontWeight: 500,
//                     marginTop: 0,
//                     marginBottom: 0,
//                   }}
//                 >
//                   {option.timeout}
//                 </Typography>
//               </Box>
//               <Box style={{ marginTop: 20 }}>
//                 <Typography
//                   style={{ fontSize: 16, color: "white", fontWeight: 600 }}
//                 >
//                   {option.question}
//                 </Typography>
//                 {option.options.map((item, j) => {
//                   return (
//                     <Box style={{ marginTop: j === 0 ? 14 : 6 }}>
//                       <Typography
//                         style={{
//                           fontSize: 16,
//                           color: "white",
//                           fontWeight: 500,
//                         }}
//                       >
//                         {item.option}
//                       </Typography>
//                       <Box
//                         style={{
//                           marginTop: 4,
//                           display: "flex",
//                           alignItems: "center",
//                           // backgroundColor: "pink",
//                         }}
//                       >
//                         <Box
//                           style={{
//                             height: 6,
//                             backgroundColor: "#3D3C4E",
//                             borderRadius: 4,
//                             display: "flex",
//                             flex: 1,
//                           }}
//                         ></Box>
//                         <Typography
//                           style={{ marginLeft: 24 }}
//                         >{`30%`}</Typography>
//                       </Box>
//                     </Box>
//                   );
//                 })}
//               </Box>
//             </Box>
//           </Box>
//         );
//       })}
//     </Box>
//     <Box style={{ padding: padding }}>
//       <Button
//         variant="contained"
//         style={{
//           width: "100%",
//           color: theme.palette.common.white,
//           backgroundColor: theme.palette.primary.main,
//         }}
//         onClick={() => {
//           setIsCreateNewPollClicked(true);
//         }}
//       >
//         Create new poll
//       </Button>
//     </Box>
//   </Box>
// </Box>
//   );
// };

// export default PollList;
const Poll = ({ poll, panelHeight }) => {
  const theme = useTheme();
  const padding = useResponsiveSize({
    xl: 12,
    lg: 10,
    md: 8,
    sm: 6,
    xs: 4,
  });
  const marginY = useResponsiveSize({
    xl: 14,
    lg: 12,
    md: 10,
    sm: 8,
    xs: 6,
  });
  const { polls, setIsCreateNewPollClicked } = useMeetingAppContext();
  const mMeeting = useMeeting();
  const localParticipantId = mMeeting?.localParticipant?.id;
  const { publish } = usePubSub(`SUBMIT_A_POLL_${poll.id}`, {
    onMessageReceived: (message) => {
      console.log(message);
    },
    onOldMessagesReceived: (message) => {
      console.log(message);
    },
  });

  const isSubmitted =
    poll?.submissions?.findIndex(({ participantId }) => {
      if (participantId === localParticipantId) {
        return true;
      }
    }) !== -1;

  return (
    <Box
      style={{
        height: panelHeight - 14,
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
          height: "100%",
        }}
      >
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            // backgroundColor: "purple",
            // paddingBottom: 12,
            // margin: padding,
          }}
        >
          {polls.map((poll, i) => {
            console.log("poll", poll);
            return (
              <Box
                style={{
                  borderBottom: "1px solid #70707033",
                  //   paddingBottom: 8,
                }}
              >
                <Box
                  style={{
                    margin: padding,
                    marginTop: marginY,
                    marginBottom: marginY,
                    // backgroundColor: "purple",
                  }}
                >
                  <Box
                    style={{
                      display: "flex",
                      alignItems: "center",
                      //   backgroundColor: "pink",
                      padding: 0,
                      margin: 0,
                      // justifyContent: "center",
                    }}
                  >
                    <Typography
                      style={{
                        fontSize: 14,
                        color: "#95959E",
                        fontWeight: 500,
                        marginTop: 0,
                        marginBottom: 0,
                      }}
                    >{`Poll ${i + 1}`}</Typography>
                    <p
                      style={{
                        marginLeft: 8,
                        marginRight: 8,
                        color: "#95959E",
                        fontWeight: 500,
                        marginTop: 0,
                        marginBottom: 0,
                      }}
                    >
                      &#x2022;
                    </p>
                    <Typography
                      style={{
                        fontSize: 14,
                        color: "#FF5D5D",
                        fontWeight: 500,
                        marginTop: 0,
                        marginBottom: 0,
                      }}
                    >
                      {poll.timeout}
                    </Typography>
                  </Box>
                  <Box style={{ marginTop: 20 }}>
                    <Typography
                      style={{ fontSize: 16, color: "white", fontWeight: 600 }}
                    >
                      {poll.question}
                    </Typography>
                    {poll.options.map((item, j) => {
                      return (
                        <Box style={{ marginTop: j === 0 ? 14 : 6 }}>
                          <Typography
                            style={{
                              fontSize: 16,
                              color: "white",
                              fontWeight: 500,
                            }}
                          >
                            {item.option}
                          </Typography>
                          <Box
                            style={{
                              marginTop: 4,
                              display: "flex",
                              alignItems: "center",
                              // backgroundColor: "pink",
                            }}
                          >
                            <Box
                              style={{
                                height: 6,
                                backgroundColor: "#3D3C4E",
                                borderRadius: 4,
                                display: "flex",
                                flex: 1,
                              }}
                            ></Box>
                            <Typography
                              style={{ marginLeft: 24 }}
                            >{`30%`}</Typography>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
        <Box style={{ padding: padding }}>
          <Button
            variant="contained"
            style={{
              width: "100%",
              color: theme.palette.common.white,
              backgroundColor: theme.palette.primary.main,
            }}
            onClick={() => {
              setIsCreateNewPollClicked(true);
            }}
          >
            Create new poll
          </Button>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box style={{ backgroundColor: isSubmitted ? "red" : "green" }}>
      <Typography>{poll.question}</Typography>
      {poll.options.map((option, i) => {
        return (
          <>
            <Typography>{option.option}</Typography>
            <Button
              onClick={() => {
                publish({
                  optionId: option.id,
                  //   participantId: localParticipantId,
                });
              }}
            >
              Submit
            </Button>
          </>
        );
      })}
    </Box>
  );
};

const PollList = ({ panelHeight }) => {
  const { polls } = useMeetingAppContext();

  return polls.map((poll) => {
    return <Poll poll={poll} panelHeight={panelHeight} />;
  });
};

export default PollList;
