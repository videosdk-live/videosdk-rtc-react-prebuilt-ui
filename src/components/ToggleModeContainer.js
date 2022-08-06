import { Box, IconButton, Tooltip } from "@material-ui/core";
import {
  useMeeting,
  useParticipant,
  usePubSub,
} from "@videosdk.live/react-sdk";
import React, { useEffect, useRef, useState } from "react";
import { meetingModes } from "../CONSTS";
import AddCohostIcon from "../icons/AddCohostIcon";
import { useMeetingAppContext } from "../MeetingAppContextDef";

const ToggleModeContainer = ({ participantId, participantMode }) => {
  const mMeetingRef = useRef();

  const [isHoverOnCohost, setIsHoverOnCohost] = useState(false);

  const mMeeting = useMeeting({});

  const { isLocal } = useParticipant(participantId);

  useEffect(() => {
    mMeetingRef.current = mMeeting;
  }, [mMeeting]);

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
            participantMode === meetingModes.CONFERENCE
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
                  participantMode === meetingModes.CONFERENCE
                    ? meetingModes.VIEWER
                    : meetingModes.CONFERENCE,
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
                  isHoverOnCohost || participantMode === meetingModes.CONFERENCE
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
