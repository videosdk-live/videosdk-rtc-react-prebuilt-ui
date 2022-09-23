import React from "react";
import {
  ButtonBase,
  List,
  ListItem,
  ListItemAvatar,
  useTheme,
} from "@material-ui/core";
import PollIcon from "../../icons/PollIcon";
import useResponsiveSize from "../../utils/useResponsiveSize";
import CreatePoll from "../../components/pollContainer/CreatePoll";
import {
  sideBarNestedModes,
  appThemes,
  useMeetingAppContext,
  sideBarModes,
} from "../../MeetingAppContextDef";
import PollList from "../../components/pollContainer/PollList";
import SubmitPollList from "../../components/pollContainer/SubmitPollList";
import { meetingModes } from "../../CONSTS";
import { useMeeting } from "@videosdk.live/react-sdk";
import WhiteboardIcon from "../../icons/WhiteboardIcon";
import AddLiveStreamsIcon from "../../icons/AddLiveStreamsIcon";
import LiveStreamConfigTabPanel from "./LivestreamConfigTabPanel";

const ActivitiesTabPanel = ({ panelHeight }) => {
  const theme = useTheme();

  const listPadding = useResponsiveSize({
    xl: 12,
    lg: 10,
    md: 8,
    sm: 6,
    xs: 4,
  });

  const {
    polls,
    draftPolls,
    canCreatePoll,
    setSideBarNestedMode,
    sideBarNestedMode,
    setSideBarMode,
    meetingMode,
    appTheme,
    whiteboardEnabled,
    canToggleWhiteboard,
    whiteboardStarted,
  } = useMeetingAppContext();

  const mMeeting = useMeeting({});

  const presenterId = mMeeting?.presenterId;

  return sideBarNestedMode === sideBarNestedModes.POLLS ? (
    canCreatePoll && meetingMode !== meetingModes.VIEWER ? (
      polls.length === 0 && draftPolls.length === 0 ? (
        <CreatePoll {...{ panelHeight }} />
      ) : (
        <PollList {...{ panelHeight }} />
      )
    ) : (
      <SubmitPollList {...{ panelHeight }} />
    )
  ) : sideBarNestedMode === sideBarNestedModes.CREATE_POLL ? (
    <CreatePoll {...{ panelHeight }} />
  ) : sideBarNestedMode === sideBarNestedModes.ADD_LIVE_STREAM ? (
    <LiveStreamConfigTabPanel {...{ panelHeight }} />
  ) : (
    <List style={{ padding: listPadding }}>
      {[
        {
          Icon: PollIcon,
          primary: "Polls",
          displayed: true,
          secondary: "Find out participant’s opinion.",
          disabled: false,
          onClick: () => {
            setSideBarNestedMode(sideBarNestedModes.POLLS);
          },
        },
        {
          Icon: WhiteboardIcon,
          primary: "Whiteboard",
          secondary: "Brainstorm, share idea & collaborate ",
          disabled: presenterId || !canToggleWhiteboard,
          displayed:
            whiteboardEnabled && meetingMode === meetingModes.CONFERENCE
              ? true
              : false,
          onClick: () => {
            mMeeting.meeting.startWhiteboard();
            setSideBarMode((s) => s === sideBarModes.ACTIVITIES && null);
            setSideBarNestedMode(null);
          },
        },
        {
          Icon: AddLiveStreamsIcon,
          primary: "Add Live Streams",
          secondary: "Broadcast live stream to other platforms",
          disabled: false,
          displayed: true,
          onClick: () => {
            setSideBarNestedMode(sideBarNestedModes.ADD_LIVE_STREAM);
          },
        },
      ].map(
        ({ Icon, primary, secondary, disabled, displayed, onClick }, i) =>
          displayed && (
            <ButtonBase
              disabled={disabled}
              onClick={onClick}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor:
                  appTheme === appThemes.DARK
                    ? theme.palette.darkTheme.seven
                    : appTheme === appThemes.LIGHT
                    ? theme.palette.lightTheme.three
                    : theme.palette.common.sidePanel,
                width: "100%",
                marginBottom: 12,
                borderRadius: 4,
              }}
            >
              <ListItem key={`activities_panel_item_${i}`}>
                <ListItemAvatar>
                  <Icon />
                </ListItemAvatar>
                <div>
                  <h1
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color:
                        appTheme === appThemes.LIGHT
                          ? theme.palette.lightTheme.contrastText
                          : "white",
                      lineHeight: 1.5,
                      marginTop: 6,
                      marginBottom: 0,
                    }}
                  >
                    {primary}
                  </h1>
                  <h2
                    style={{
                      fontSize: 14,
                      color:
                        appTheme === appThemes.DARK
                          ? theme.palette.darkTheme.four
                          : appTheme === appThemes.LIGHT
                          ? theme.palette.lightTheme.five
                          : "#9fa0a7",
                      fontWeight: 500,
                      lineHeight: 1.43,
                      marginTop: 0,
                      marginBottom: 6,
                    }}
                  >
                    {secondary}
                  </h2>
                </div>
              </ListItem>
            </ButtonBase>
          )
      )}
    </List>
  );
};

export default ActivitiesTabPanel;
