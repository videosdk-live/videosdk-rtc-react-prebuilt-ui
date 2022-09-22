import {
  Box,
  IconButton,
  makeStyles,
  MenuItem,
  Tooltip,
  Typography,
  useTheme,
} from "@material-ui/core";
import {
  useMeeting,
  useParticipant,
  usePubSub,
} from "@videosdk.live/react-sdk";
import React, { useEffect, useRef, useState } from "react";
import { meetingModes } from "../CONSTS";
import AddCohostIcon from "../icons/AddCohostIcon";
import ParticipantAddHostIcon from "../icons/ParticipantAddHostIcon";
import { appThemes, useMeetingAppContext } from "../MeetingAppContextDef";

const useStyles = makeStyles(() => ({
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
const ToggleModeContainer = ({ participantId, participantMode }) => {
  const mMeetingRef = useRef();
  const classes = useStyles();

  const [isHoverOnCohost, setIsHoverOnCohost] = useState(false);

  const mMeeting = useMeeting({});

  const { isLocal } = useParticipant(participantId);

  useEffect(() => {
    mMeetingRef.current = mMeeting;
  }, [mMeeting]);

  const { publish } = usePubSub(`CHANGE_MODE_${participantId}`, {});
  const { appTheme } = useMeetingAppContext();
  const theme = useTheme();

  return (
    !isLocal && (
      <MenuItem
        key={`mode_${participantId}`}
        onClick={(e) => {
          e.stopPropagation();
          publish({
            mode:
              participantMode === meetingModes.CONFERENCE
                ? meetingModes.VIEWER
                : meetingModes.CONFERENCE,
          });
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
            <ParticipantAddHostIcon
              fill={
                isHoverOnCohost || participantMode === meetingModes.CONFERENCE
                  ? appTheme === appThemes.LIGHT
                    ? theme.palette.lightTheme.contrastText
                    : theme.palette.common.white
                  : "#9E9EA7"
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
              alignItems: "center",
            }}
          >
            <Typography
              style={{
                fontSize: 14,

                color:
                  isHoverOnCohost || participantMode === meetingModes.CONFERENCE
                    ? appTheme === appThemes.LIGHT
                      ? theme.palette.lightTheme.contrastText
                      : "#fff"
                    : theme.palette.text.secondary,
              }}
            >
              {participantMode === meetingModes.CONFERENCE
                ? "Remove from Co-host"
                : "Add as a Co-host"}
            </Typography>
          </Box>
        </Box>
      </MenuItem>
    )
  );
};

export default ToggleModeContainer;
