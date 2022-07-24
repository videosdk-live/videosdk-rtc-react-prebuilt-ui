import { Box, IconButton, Tooltip } from "@material-ui/core";
import {
  useMeeting,
  useParticipant,
  usePubSub,
} from "@videosdk.live/react-sdk";
import React, { useEffect, useRef, useState } from "react";
import { KickoutUserIcon } from "../icons";
import AddCohostIcon from "../icons/AddCohostIcon";

const ToggleModeContainer = ({ participantId }) => {
  const mMeetingRef = useRef();

  const [isHoverOnCohost, setIsHoverOnCohost] = useState(false);

  const mMeeting = useMeeting({});

  const [participantMode, setParticipantMode] = useState(null);
  const { isLocal } = useParticipant(participantId);

  useEffect(() => {
    mMeetingRef.current = mMeeting;
  }, [mMeeting]);

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

  const { publish } = usePubSub(`CHANGE_MODE_${participantId}`, {});

  return (
    !isLocal && (
      <Box
        ml={1}
        mr={0}
        onMouseEnter={() => setIsHoverOnCohost(true)}
        onMouseLeave={() => setIsHoverOnCohost(false)}
      >
        <Tooltip
          title={
            participantMode === "conference"
              ? "Remove from Co-host"
              : "Add as a Co-host"
          }
          style={{ backgroundColor: "#fff" }}
        >
          <IconButton
            style={{ padding: 0 }}
            onClick={() => {
              publish({
                mode:
                  participantMode === "conference" ? "viewer" : "conference",
              });
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
              <AddCohostIcon
                fill={
                  isHoverOnCohost || participantMode === "conference"
                    ? "#fff"
                    : "#9E9EA7"
                }
              />
            </Box>
          </IconButton>
        </Tooltip>
      </Box>
    )
  );
};

export default ToggleModeContainer;
