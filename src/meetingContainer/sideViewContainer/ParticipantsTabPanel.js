import {
  useMeeting,
  useParticipant,
  usePubSub,
} from "@videosdk.live/react-sdk";
import { MoreVert, SearchOutlined } from "@mui/icons-material";
import {
  Avatar,
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
  Tooltip,
  MenuList,
  MenuItem,
  Popover,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import { appThemes, useMeetingAppContext } from "../../MeetingAppContextDef";
import { RaiseHand } from "../../icons";
import { List } from "react-virtualized";
import useWindowSize from "../../utils/useWindowSize";
import useIsTab from "../../utils/useIsTab";
import useIsMobile from "../../utils/useIsMobile";
import ConfirmBox from "../../components/ConfirmBox";
import { nameTructed } from "../../utils/common";
import ToggleModeContainer from "../../components/ToggleModeContainer";
import { meetingModes } from "../../CONSTS";
import ParticipantScreenShareIcon from "../../icons/ParticipantScreenShareIcon";
import ParticipantMicOnIcon from "../../icons/ParticipantMicOnIcon";
import ParticipantMicOffIcon from "../../icons/ParticipantMicOffIcon";
import ParticipantVideoOnIcon from "../../icons/ParticipantVideoOnIcon";
import ParticipantVideoOffIcon from "../../icons/ParticipantVideoOffIcon";
import ParticipantPinIcon from "../../icons/ParticipantPinIcon";
import ParticipantRemoveIcon from "../../icons/ParticipantRemoveIcon";
import useIsHls from "../useIsHls";
import useCustomTrack from "../../utils/useCustomTrack";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";

function ParticipantListItem({ raisedHand, participantId }) {
  const { presenterId } = useMeeting();
  const {
    participant,
    micOn,
    webcamOn,
    displayName,
    isLocal,
    pinState,
    pin,
    unpin,
    enableMic,
    disableMic,
    enableWebcam,
    disableWebcam,
  } = useParticipant(participantId);

  const {
    participantCanToggleOtherMic,
    participantCanToggleOtherWebcam,
    partcipantCanToogleOtherScreenShare,
    participantCanToggleOtherMode,
    canRemoveOtherParticipant,
    canPin,
    animationsEnabled,
    meetingMode,
    appTheme,
  } = useMeetingAppContext();

  const { getCustomVideoTrack, getCustomAudioTrack } = useCustomTrack();

  const isParticipantPresenting = useMemo(() => {
    return presenterId === participantId;
  }, [presenterId, participantId]);

  const { publish } = usePubSub(`SCR_SHR_REQ_${participantId}`);

  const [isParticipantKickoutVisible, setIsParticipantKickoutVisible] =
    useState(false);

  const [participantMode, setParticipantMode] = useState(null);
  const [moreIconClicked, setMoreIconClicked] = useState(null);

  const handleClick = (event) => {
    setMoreIconClicked(event.currentTarget);
  };

  const handleClose = () => {
    setMoreIconClicked(null);
  };

  const isHls = useIsHls();

  // const classes = useStyles();

  const theme = useTheme();

  usePubSub(`CURRENT_MODE_${participantId}`, {
    onMessageReceived: (data) => {
      setParticipantMode(data.message);
    },
    onOldMessagesReceived: (messages) => {
      const latestMessage = messages.sort((a, b) => {
        if (a.timestamp > b.timestamp) {
          return -1;
        }
        if (a.timestamp < b.timestamp) {
          return 1;
        }
        return 0;
      })[0];

      if (latestMessage) {
        setParticipantMode(latestMessage.message);
      }
    },
  });

  return (
    <Box
      mt={1}
      p={1}
      style={{
        backgroundColor:
          appTheme === appThemes.DARK
            ? theme.palette.darkTheme.seven
            : appTheme === appThemes.LIGHT
              ? theme.palette.lightTheme.three
              : theme.palette.common.sidePanel,
        borderRadius: 6,
      }}
    >
      <Box
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Avatar
          variant={"rounded"}
          style={{
            color: appTheme === appThemes.LIGHT && "white",
            backgroundColor:
              appTheme === appThemes.DARK
                ? theme.palette.darkTheme.five
                : appTheme === appThemes.LIGHT
                  ? theme.palette.lightTheme.five
                  : "",
          }}
        >
          {displayName?.charAt(0)}
        </Avatar>

        <Box ml={1} mr={0.5} style={{ flex: 1, display: "flex" }}>
          <Typography
            style={{
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "pre-wrap",
              color:
                appTheme === appThemes.LIGHT
                  ? theme.palette.lightTheme.contrastText
                  : "white",
            }}
            variant="body1"
            noWrap
          >
            {isLocal ? "You" : nameTructed(displayName, 10)}
          </Typography>
        </Box>

        <Box
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <Box
            style={{
              display: "flex",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              // position: "relative",
            }}
          >
            <Box
              style={{
                display: "flex",
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {raisedHand && (
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  mr={0}
                  p={0}
                  ml={0.5}
                >
                  <RaiseHand
                    fillColor={
                      appTheme === appThemes.LIGHT
                        ? theme.palette.lightTheme.contrastText
                        : theme.palette.common.white
                    }
                  />
                </Box>
              )}

              {meetingMode === meetingModes.SEND_AND_RECV && (
                <Box ml={0.5} mr={0.5}>
                  <IconButton
                    disabled={
                      !participantCanToggleOtherMic ||
                      isLocal ||
                      meetingMode === meetingModes.SIGNALLING_ONLY ||
                      participantMode === meetingModes.SIGNALLING_ONLY
                    }
                    style={{ padding: 0 }}
                    onClick={async () => {
                      if (micOn) {
                        disableMic();
                      } else {
                        const track = await getCustomAudioTrack();
                        enableMic(track);
                      }
                    }}
                  >
                    <Box
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 100,
                      }}
                      p={0.5}
                    >
                      {micOn ? (
                        <ParticipantMicOnIcon
                          fillColor={
                            appTheme === appThemes.LIGHT
                              ? theme.palette.lightTheme.contrastText
                              : "white"
                          }
                        />
                      ) : (
                        <ParticipantMicOffIcon />
                      )}
                    </Box>
                  </IconButton>
                </Box>
              )}
              {meetingMode === meetingModes.SEND_AND_RECV && (
                <Box ml={1} mr={0}>
                  <IconButton
                    disabled={
                      !participantCanToggleOtherWebcam ||
                      isLocal ||
                      meetingMode === meetingModes.SIGNALLING_ONLY ||
                      participantMode === meetingModes.SIGNALLING_ONLY
                    }
                    style={{ padding: 0 }}
                    onClick={async () => {
                      if (webcamOn) {
                        disableWebcam();
                      } else {
                        const track = await getCustomVideoTrack();
                        enableWebcam(track);
                      }
                    }}
                  >
                    <Box
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 100,
                      }}
                      p={0.5}
                    >
                      {webcamOn ? (
                        <ParticipantVideoOnIcon
                          fillColor={
                            appTheme === appThemes.LIGHT
                              ? theme.palette.lightTheme.contrastText
                              : "white"
                          }
                        />
                      ) : (
                        <ParticipantVideoOffIcon />
                      )}
                    </Box>
                  </IconButton>
                </Box>
              )}
              {canPin && (
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  ml={1}
                  mr={0}
                  p={0.5}
                >
                  <Tooltip
                    title={pinState?.share || pinState?.cam ? "Unpin" : `Pin`}
                  >
                    <IconButton
                      disabled={
                        // !expanded ||
                        meetingMode === meetingModes.SIGNALLING_ONLY ||
                        participantMode === meetingModes.SIGNALLING_ONLY
                      }
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        pinState?.share || pinState?.cam ? unpin() : pin();
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ParticipantPinIcon
                        fill={
                          pinState?.share || pinState?.cam
                            ? appTheme === appThemes.LIGHT
                              ? theme.palette.lightTheme.contrastText
                              : "white"
                            : appTheme === appThemes.LIGHT
                              ? theme.palette.lightTheme.four
                              : "#ffffff80"
                        }
                      />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>
          </Box>

          {meetingMode === meetingModes.SEND_AND_RECV && (
            <Box
              style={{
                transition: `all ${200 * (animationsEnabled ? 1 : 0.5)}ms`,
              }}
            >
              <IconButton
                style={{ padding: 0 }}
                disabled={meetingMode === meetingModes.SIGNALLING_ONLY}
                onClick={(e) => {
                  handleClick(e);
                }}
              >
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 100,
                  }}
                  p={0.5}
                >
                  <MoreVert
                    fontSize="small"
                    style={{
                      height: 18,
                      width: 18,
                      color:
                        appTheme === appThemes.LIGHT
                          ? theme.palette.lightTheme.contrastText
                          : "white",
                    }}
                  />
                </Box>
              </IconButton>
              <Popover
                open={Boolean(moreIconClicked)}
                anchorEl={moreIconClicked}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                style={{ marginTop: 4, marginRight: 16 }}
              >
                <MenuList
                  style={{
                    backgroundColor:
                      appTheme === appThemes.DARK
                        ? theme.palette.darkTheme.slightLighter
                        : appTheme === appThemes.LIGHT
                          ? theme.palette.lightTheme.two
                          : "",
                    color:
                      appTheme === appThemes.DARK
                        ? theme.palette.common.white
                        : appTheme === appThemes.LIGHT
                          ? theme.palette.lightTheme.contrastText
                          : "",
                  }}
                >
                  {!isLocal && canRemoveOtherParticipant && (
                    <>
                      <MenuItem
                        key={`remove`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsParticipantKickoutVisible(true);
                          handleClose();
                        }}
                      >
                        <Box style={{ display: "flex", flexDirection: "row" }}>
                          <Box
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <ParticipantRemoveIcon
                              fillColor={
                                appTheme === appThemes.LIGHT
                                  ? theme.palette.lightTheme.contrastText
                                  : theme.palette.common.white
                              }
                            />
                          </Box>
                          <Box
                            style={{
                              display: "flex",
                              flex: 1,
                              flexDirection: "column",
                              marginLeft: 12,
                              justifyContent: "center",
                            }}
                          >
                            <Typography
                              style={{
                                fontSize: 14,
                                color:
                                  appTheme === appThemes.LIGHT &&
                                  theme.palette.lightTheme.contrastText,
                              }}
                            >
                              Remove Participant
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    </>
                  )}
                  {participantCanToggleOtherMode && isHls && (
                    <ToggleModeContainer
                      participantId={participantId}
                      participantMode={participantMode}
                      handleClose={handleClose}
                    />
                  )}
                  {meetingMode === meetingModes.SEND_AND_RECV && (
                    <MenuItem
                      key={`screen-share`}
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          await publish({
                            setScreenShareOn: !isParticipantPresenting,
                          });
                        } catch (error) {

                        }

                        handleClose();
                      }}
                      disabled={
                        !(
                          !isLocal &&
                          partcipantCanToogleOtherScreenShare &&
                          (presenterId ? isParticipantPresenting : true)
                        ) ||
                        meetingMode === meetingModes.SIGNALLING_ONLY ||
                        participantMode === meetingModes.SIGNALLING_ONLY
                      }
                    >
                      <Box style={{ display: "flex", flexDirection: "row" }}>
                        <Box
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {isParticipantPresenting ? (
                            <ParticipantScreenShareIcon
                              fillColor={
                                appTheme === appThemes.LIGHT
                                  ? theme.palette.lightTheme.contrastText
                                  : theme.palette.common.white
                              }
                            />
                          ) : (
                            <ParticipantScreenShareIcon
                              fillColor={
                                appTheme === appThemes.LIGHT
                                  ? theme.palette.lightTheme.contrastText
                                  : !(
                                    !isLocal &&
                                    partcipantCanToogleOtherScreenShare &&
                                    (presenterId
                                      ? isParticipantPresenting
                                      : true)
                                  ) ||
                                    meetingMode === meetingModes.SIGNALLING_ONLY ||
                                    participantMode === meetingModes.SIGNALLING_ONLY
                                    ? appTheme === appThemes.LIGHT
                                      ? theme.palette.lightTheme.contrastText
                                      : "#ffffff80"
                                    : appTheme === appThemes.LIGHT
                                      ? theme.palette.lightTheme.contrastText
                                      : "#ffffff"
                              }
                            />
                          )}
                        </Box>
                        <Box
                          style={{
                            display: "flex",
                            flex: 1,
                            flexDirection: "column",
                            marginLeft: 12,
                            justifyContent: "center",
                          }}
                        >
                          <Typography
                            style={{
                              fontSize: 14,
                              color:
                                !(
                                  !isLocal &&
                                  partcipantCanToogleOtherScreenShare &&
                                  (presenterId ? isParticipantPresenting : true)
                                ) ||
                                  meetingMode === meetingModes.SIGNALLING_ONLY ||
                                  participantMode === meetingModes.SIGNALLING_ONLY
                                  ? theme.palette.text.secondary
                                  : appTheme === appThemes.LIGHT
                                    ? theme.palette.lightTheme.contrastText
                                    : theme.palette.common.white,
                            }}
                          >
                            {isParticipantPresenting
                              ? "Stop Screenshare"
                              : "Request Screenshare"}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  )}
                </MenuList>
              </Popover>
            </Box>
          )}
        </Box>
      </Box>
      <ConfirmBox
        open={isParticipantKickoutVisible}
        title={`Remove ${nameTructed(displayName, 15)} `}
        subTitle={`Are you sure want to remove ${nameTructed(
          displayName,
          15
        )} from the call?`}
        successText={"Remove"}
        rejectText={"Cancel"}
        onSuccess={() => {
          participant.remove();
          setIsParticipantKickoutVisible(false);
        }}
        onReject={() => {
          setIsParticipantKickoutVisible(false);
        }}
      />
    </Box>
  );
}

export default function ParticipantsTabPanel({ panelWidth, panelHeight }) {
  const [filterQuery, setFilterQuery] = useState("");

  const { participants } = useMeeting();
  const { raisedHandsParticipants, appTheme } = useMeetingAppContext();

  const sortedRaisedHandsParticipants = useMemo(() => {
    const participantIds = [...participants.keys()];

    const notRaised = participantIds.filter(
      (pID) =>
        raisedHandsParticipants.findIndex(
          ({ participantId: rPID }) => rPID === pID
        ) === -1
    );

    const raisedSorted = raisedHandsParticipants.sort((a, b) => {
      if (a.raisedHandOn > b.raisedHandOn) {
        return -1;
      }
      if (a.raisedHandOn < b.raisedHandOn) {
        return 1;
      }
      return 0;
    });

    const combined = [
      ...raisedSorted.map(({ participantId: p }) => ({
        raisedHand: true,
        participantId: p,
      })),
      ...notRaised.map((p) => ({ raisedHand: false, participantId: p })),
    ];

    return combined;
  }, [raisedHandsParticipants, participants]);

  const theme = useTheme();

  const filterParticipants = (
    sortedRaisedHandsParticipants,
    participants,
    filterQuery
  ) =>
    filterQuery?.length > 2
      ? sortedRaisedHandsParticipants.filter(({ participantId }) => {
        const { displayName } = participants.get(participantId);

        const hide = !displayName
          ?.toLowerCase()
          .includes(filterQuery.toLowerCase());

        return !hide;
      })
      : sortedRaisedHandsParticipants;

  const part = useMemo(
    () =>
      filterParticipants(
        sortedRaisedHandsParticipants,
        participants,
        filterQuery
      ),

    [sortedRaisedHandsParticipants, participants, filterQuery]
  );

  function rowRenderer({ key, index, isScrolling, isVisible, style }) {
    const { participantId, raisedHand } = part[index];

    return (
      <div {...{ key, style }}>
        {isVisible ? (
          <ParticipantListItem
            key={participantId}
            participantId={participantId}
            raisedHand={raisedHand}
          />
        ) : (
          <Box
            mt={1}
            style={{
              height: 56,
              backgroundColor:
                appTheme === appThemes.DARK
                  ? theme.palette.darkTheme.seven
                  : appTheme === appThemes.LIGHT
                    ? theme.palette.lightTheme.three
                    : theme.palette.common.sidePanel,
              borderRadius: 6,
            }}
          ></Box>
        )}
      </div>
    );
  }
  const { width } = useWindowSize();
  const isTab = useIsTab();
  const isMobile = useIsMobile();
  const outerTheme = useTheme();

  const customTheme = (outerTheme) =>
    createTheme({
      palette: {
        mode: outerTheme.palette.mode,
      },
      components: {
        MuiTextField: {
          styleOverrides: {
            root: {
              "--TextField-brandBorderColor": "#70707033",
              "--TextField-brandBorderHoverColor": "#70707033",
              "--TextField-brandBorderFocusedColor": "#70707033",
              "& label.Mui-focused": {
                color: "var(--TextField-brandBorderFocusedColor)",
              },
            },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            notchedOutline: {
              borderColor: appTheme !== appThemes.LIGHT && "#404B53",
            },
            root: {
              [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
                borderColor:
                  appTheme === appThemes.LIGHT
                    ? "var(--TextField-brandBorderHoverColor)"
                    : "white",
              },
              [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
                borderColor:
                  appTheme === appThemes.LIGHT
                    ? "var(--TextField-brandBorderFocusedColor)"
                    : "white",
                borderWidth: "1px",
              },
              color: appTheme === appThemes.LIGHT ? "#404B53" : "white",
            },
          },
        },
      },
    });

  return (
    <Box
      p={1}
      style={{
        height: panelHeight - 32,
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <Box>
        <ThemeProvider theme={customTheme(outerTheme)}>
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Search Participants"
            style={{
              color:
                appTheme === appThemes.LIGHT &&
                theme.palette.lightTheme.contrastText,
              borderRadius: "6px",
            }}
            onChange={(e) => setFilterQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined
                    style={{
                      color:
                        appTheme === appThemes.LIGHT
                          ? theme.palette.lightTheme.contrastText
                          : "white",
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </ThemeProvider>
      </Box>

      <Box style={{ overflowY: "auto" }}>
        <List
          width={isTab || isMobile ? width - 32 : panelWidth - 36}
          height={panelHeight - 90}
          rowCount={part.length}
          rowHeight={64}
          rowRenderer={rowRenderer}
        />
      </Box>
    </Box>
  );
}
