import { useMeeting, useParticipant } from "@videosdk.live/react-sdk";
import MicOffIcon from "@material-ui/icons/MicOff";
import MicIcon from "@material-ui/icons/Mic";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import VideocamIcon from "@material-ui/icons/Videocam";
import {
  Avatar,
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from "@material-ui/core";
import { SearchOutlined } from "@material-ui/icons";
import { useMemo, useState } from "react";
import { useMeetingAppContext } from "../../MeetingAppContextDef";
import RaiseHand from "../../icons/RaiseHand";
import { List } from "react-virtualized";
import { Pin } from "../../icons";
import useWindowSize from "../../utils/useWindowSize";
import useIsTab from "../../utils/useIsTab";
import useIsMobile from "../../utils/useIsMobile";

export function duplicateArray(aaaarr = []) {
  const limit = 3000;
  let arr = [];
  for (var i = 0; i < limit; i++) {
    arr = [...arr, ...aaaarr];
  }
  return arr;
}

function ParticipantListItem({ raisedHand, participantId }) {
  const {
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
    canPin,
  } = useMeetingAppContext();

  const theme = useTheme();

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
        }}
      >
        <Avatar variant={"rounded"}>{displayName?.charAt(0)}</Avatar>

        <Box ml={1} mr={1} style={{ flex: 1, display: "flex" }}>
          <Typography
            style={{
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "pre-wrap",
            }}
            variant="body1"
            noWrap
          >
            {isLocal ? "You" : displayName}
          </Typography>
        </Box>
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
        {canPin && (
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            mr={0.5}
            p={0.5}
          >
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                pinState?.share || pinState?.cam ? unpin() : pin();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                // padding: isMobile ? 2 : isTab ? 3 : 4,
                // backgroundColor: "#00000066",
              }}
            >
              <Pin
                fill={pinState?.share || pinState?.cam ? "white" : "#ffffff80"}
                style={{
                  width: 20,
                  height: 20,
                }}
              />
            </IconButton>
          </Box>
        )}

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
              // border: `${micOn ? "0" : "1"}px solid ${
              //   micOn
              //     ? theme.palette.common.secondaryContrastTextLight
              //     : theme.palette.error.main
              // }`,
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
        <Box ml={1}>
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
                // border: `${webcamOn ? "0" : "1"}px solid ${
                //   webcamOn
                //     ? theme.palette.common.secondaryContrastTextLight
                //     : theme.palette.error.main
                // }`,
                backgroundColor: webcamOn ? null : theme.palette.error.main,
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
      {/* <Divider /> */}
    </Box>
  );
}

export default function ParticipantsTabPanel({ panelWidth, panelHeight }) {
  const [filterQuery, setFilterQuery] = useState("");

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
