import {
  useMeeting,
  useParticipant,
  usePubSub,
} from "@videosdk.live/react-sdk";
import { MoreVert, SearchOutlined } from "@material-ui/icons";
import {
  Avatar,
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
  Fade,
  Tooltip,
  makeStyles,
  MenuList,
  MenuItem,
  Popover,
} from "@material-ui/core";
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

const useStyles = makeStyles(() => ({
  textField: {
    "&:hover": {
      border: "1px solid #70707033",
      borderRadius: "6px",
    },
    "& .MuiInputBase-input": {
      color: "#404B53",
    },
    border: "1px solid #70707033",
    borderRadius: "6px",
  },
  input: {
    "& .MuiOutlinedInput-input": {
      padding: "16px 12px",
    },
  },
  popover: { backgroundColor: "transparent" },
  popoverBorder: {
    borderRadius: "12px",
    backgroundColor: "#212032",
    marginTop: 8,
    width: 300,
  },
  popoverHover: {
    "&:hover": {
      backgroundColor: "#CCD2D899",
    },
  },
  popoverHoverDark: {
    "&:hover": {
      backgroundColor: "#2B303499",
    },
  },
}));

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

  const classes = useStyles();

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
                appTheme === appThemes.LIGHT &&
                theme.palette.lightTheme.contrastText,
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

              {meetingMode === meetingModes.CONFERENCE && (
                <Box ml={0.5} mr={0.5}>
                  <IconButton
                    disabled={
                      !participantCanToggleOtherMic ||
                      isLocal ||
                      meetingMode === meetingModes.VIEWER ||
                      participantMode === meetingModes.VIEWER
                    }
                    style={{ padding: 0 }}
                    onClick={() => {
                      if (micOn) {
                        disableMic();
                      } else {
                        enableMic();
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
              {meetingMode === meetingModes.CONFERENCE && (
                <Box ml={1} mr={0}>
                  <IconButton
                    disabled={
                      !participantCanToggleOtherWebcam ||
                      isLocal ||
                      meetingMode === meetingModes.VIEWER ||
                      participantMode === meetingModes.VIEWER
                    }
                    style={{ padding: 0 }}
                    onClick={() => {
                      if (webcamOn) {
                        disableWebcam();
                      } else {
                        enableWebcam();
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
                        meetingMode === meetingModes.VIEWER ||
                        participantMode === meetingModes.VIEWER
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

          {meetingMode === meetingModes.CONFERENCE && (
            <Box
              style={{
                transition: `all ${200 * (animationsEnabled ? 1 : 0.5)}ms`,
              }}
            >
              <IconButton
                style={{ padding: 0 }}
                disabled={meetingMode === meetingModes.VIEWER}
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
                        appTheme === appThemes.LIGHT &&
                        theme.palette.lightTheme.contrastText,
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
                        classes={{
                          root:
                            appTheme === appThemes.LIGHT
                              ? classes.popoverHover
                              : appTheme === appThemes.DARK
                              ? classes.popoverHoverDark
                              : "",
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
                  {/* {participantCanToggleOtherMode && isHls && (
                    <ToggleModeContainer
                      participantId={participantId}
                      participantMode={participantMode}
                      handleClose={handleClose}
                    />
                  )} */}
                  {meetingMode === meetingModes.CONFERENCE && (
                    <MenuItem
                      key={`screen-share`}
                      onClick={(e) => {
                        e.stopPropagation();
                        publish({
                          setScreenShareOn: !isParticipantPresenting,
                        });
                        handleClose();
                      }}
                      classes={{
                        root:
                          appTheme === appThemes.LIGHT
                            ? classes.popoverHover
                            : appTheme === appThemes.DARK
                            ? classes.popoverHoverDark
                            : "",
                      }}
                      disabled={
                        !(
                          !isLocal &&
                          partcipantCanToogleOtherScreenShare &&
                          (presenterId ? isParticipantPresenting : true)
                        ) ||
                        meetingMode === meetingModes.VIEWER ||
                        participantMode === meetingModes.VIEWER
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
                                    meetingMode === meetingModes.VIEWER ||
                                    participantMode === meetingModes.VIEWER
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
                                meetingMode === meetingModes.VIEWER ||
                                participantMode === meetingModes.VIEWER
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
    filterQuery?.length > 3
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
  const classes = useStyles();

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
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Search Participants"
          classes={{
            root: appTheme === appThemes.LIGHT && classes.textField,
          }}
          style={{
            color:
              appTheme === appThemes.LIGHT &&
              theme.palette.lightTheme.contrastText,
            borderRadius: "6px",
          }}
          onChange={(e) => setFilterQuery(e.target.value)}
          InputProps={{
            classes: { root: classes.input },
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined
                  style={{
                    color:
                      appTheme === appThemes.LIGHT &&
                      theme.palette.lightTheme.contrastText,
                  }}
                />
              </InputAdornment>
            ),
          }}
        />
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
