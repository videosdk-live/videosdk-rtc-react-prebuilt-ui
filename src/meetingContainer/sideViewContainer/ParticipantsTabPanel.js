import { useMeeting, useParticipant } from "@videosdk.live/react-sdk";
import {
  Close,
  MoreVert,
  SearchOutlined,
  MicOff as MicOffIcon,
  Mic as MicIcon,
  VideocamOff as VideocamOffIcon,
  Videocam as VideocamIcon,
} from "@material-ui/icons";
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
} from "@material-ui/core";
import React, { useEffect, useRef, useMemo, useState } from "react";
import { useMeetingAppContext } from "../../MeetingAppContextDef";
import { Pin, RaiseHand, KickoutUserIcon } from "../../icons";
import { List } from "react-virtualized";
import useWindowSize from "../../utils/useWindowSize";
import useIsTab from "../../utils/useIsTab";
import useIsMobile from "../../utils/useIsMobile";
import ConfirmBox from "../../components/ConfirmBox";
import { nameTructed } from "../../utils/common";

function ParticipantListItem({
  raisedHand,
  participantId,
  participantExpandedId,
  setParticipantExpandedId,
}) {
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
    canRemoveOtherParticipant,
    canPin,
    animationsEnabled,
  } = useMeetingAppContext();

  const [isParticipantKickoutVisible, setIsParticipantKickoutVisible] =
    useState(false);

  const [morePanelWidth, setMorePanelWidth] = useState(0);

  const theme = useTheme();

  const expanded = participantExpandedId === participantId;

  const morePanelRef = useRef();

  useEffect(() => {
    morePanelRef.current?.offsetWidth &&
      setMorePanelWidth(morePanelRef.current.offsetWidth);
  }, []);

  return (
    <Box
      mt={1}
      p={1}
      style={{
        backgroundColor: theme.palette.common.sidePanel,
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
        <Avatar variant={"rounded"}>{displayName?.charAt(0)}</Avatar>
        <Fade in={!expanded}>
          <Box ml={1} mr={0.5} style={{ flex: 1, display: "flex" }}>
            <Typography
              style={{
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "pre-wrap",
              }}
              variant="body1"
              noWrap
            >
              {isLocal ? "You" : nameTructed(displayName, 15)}
            </Typography>
          </Box>
        </Fade>
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
              position: "relative",
            }}
          >
            <Box
              style={{
                display: "flex",
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                transition: animationsEnabled ? "all 200ms" : undefined,
                right: expanded ? morePanelWidth : 0,
                position: "absolute",
              }}
            >
              {raisedHand && (
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  mr={0.5}
                  p={0.5}
                >
                  <RaiseHand />
                </Box>
              )}

              <Box ml={0.5} mr={0.5}>
                <IconButton
                  disabled={!participantCanToggleOtherMic || isLocal}
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
                      backgroundColor: micOn ? null : theme.palette.error.main,
                    }}
                    p={0.5}
                  >
                    {micOn ? (
                      <MicIcon
                        fontSize="small"
                        style={{ color: theme.palette.common.white }}
                      />
                    ) : (
                      <MicOffIcon
                        fontSize="small"
                        style={{ color: theme.palette.common.white }}
                      />
                    )}
                  </Box>
                </IconButton>
              </Box>
              <Box ml={1} mr={0}>
                <IconButton
                  disabled={!participantCanToggleOtherWebcam || isLocal}
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
                      backgroundColor: webcamOn
                        ? null
                        : theme.palette.error.main,
                    }}
                    p={0.5}
                  >
                    {webcamOn ? (
                      <VideocamIcon
                        fontSize="small"
                        style={{ color: theme.palette.common.white }}
                      />
                    ) : (
                      <VideocamOffIcon
                        fontSize="small"
                        style={{ color: theme.palette.common.white }}
                      />
                    )}
                  </Box>
                </IconButton>
              </Box>
            </Box>
            <Box
              ref={morePanelRef}
              style={{
                display: "flex",
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                transition: animationsEnabled ? "all 200ms" : undefined,
                right: expanded ? 0 : -morePanelWidth,
                position: "absolute",
                opacity: expanded ? 1 : 0,
              }}
            >
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
                      disabled={!expanded}
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
                      <Pin
                        fill={
                          pinState?.share || pinState?.cam
                            ? "white"
                            : "#ffffff80"
                        }
                        style={{
                          width: 20,
                          height: 20,
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
              {!isLocal && canRemoveOtherParticipant && (
                <Box ml={1} mr={0}>
                  <Tooltip title={`Remove`}>
                    <IconButton
                      disabled={!expanded}
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsParticipantKickoutVisible(true);
                        // participant.remove();
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <KickoutUserIcon height={18} width={18} />
                    </IconButton>
                  </Tooltip>
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
                    }}
                    onReject={() => {
                      setIsParticipantKickoutVisible(false);
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>
          <Box
            style={{ transition: animationsEnabled ? "all 200ms" : undefined }}
            ml={expanded ? 1.5 : 1}
          >
            <IconButton
              style={{ padding: 0 }}
              onClick={(e) => {
                if (participantId === participantExpandedId) {
                  setParticipantExpandedId(null);
                } else {
                  setParticipantExpandedId(participantId);
                }
              }}
            >
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 100,
                  border: `${expanded ? "0" : "0"}px solid ${
                    expanded
                      ? theme.palette.error.main
                      : theme.palette.common.secondaryContrastTextLight
                  }`,
                  backgroundColor: expanded ? theme.palette.error.main : null,
                }}
                p={0.5}
              >
                {expanded ? (
                  <Close fontSize="small" />
                ) : (
                  <MoreVert fontSize="small" />
                )}
              </Box>
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default function ParticipantsTabPanel({ panelWidth, panelHeight }) {
  const [filterQuery, setFilterQuery] = useState("");
  const [participantExpandedId, setParticipantExpandedId] = useState(null);

  const { participants } = useMeeting();
  const { raisedHandsParticipants } = useMeetingAppContext();

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
            participantExpandedId={participantExpandedId}
            setParticipantExpandedId={setParticipantExpandedId}
          />
        ) : (
          <Box
            mt={1}
            style={{
              height: 56,
              backgroundColor: theme.palette.common.sidePanel,
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
          onChange={(e) => setFilterQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined />
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
