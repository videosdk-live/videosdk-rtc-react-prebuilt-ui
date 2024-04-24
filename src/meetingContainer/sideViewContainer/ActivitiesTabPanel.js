import React from "react";
import {
  ButtonBase,
  List,
  ListItem,
  ListItemAvatar,
  useTheme,
} from "@mui/material";
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
import VirtualBackgroundIcon from "../../icons/VirtualBackgroundIcon";
import VirtualBackgroundContainer from "./VirtualBackgroundTabPanel/VirtualBackgroundContainer";

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
    canToggleVirtualBackground,
    participantCanToggleLivestream,
    pollEnabled,
    liveStreamEnabled,
  } = useMeetingAppContext();

  const mMeeting = useMeeting({});

  const presenterId = mMeeting?.presenterId;

  const moreOptionArr = [
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
      Icon: PollIcon,
      primary: "Polls",
      displayed: pollEnabled,
      secondary: "Find out participant’s opinion.",
      disabled: false,
      onClick: () => {
        setSideBarNestedMode(sideBarNestedModes.POLLS);
      },
    },
  ];

  if (canToggleVirtualBackground) {
    moreOptionArr.unshift({
      Icon: VirtualBackgroundIcon,
      primary: "Virtual Background (BETA)",
      secondary: "Add custom background to meetings",
      disabled: false,
      displayed: true,
      onClick: () => {
        setSideBarNestedMode(sideBarNestedModes.VIRTUAL_BACKGROUND);
      },
    });
  }

  if (liveStreamEnabled && meetingMode === meetingModes.CONFERENCE) {
    moreOptionArr.push({
      Icon: AddLiveStreamsIcon,
      primary: "Add Live Streams",
      secondary: "Broadcast live stream to other platforms",
      disabled: !participantCanToggleLivestream,
      displayed: true,
      onClick: () => {
        setSideBarNestedMode(sideBarNestedModes.ADD_LIVE_STREAM);
      },
    });
  }

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
  ) : sideBarNestedMode === sideBarNestedModes.VIRTUAL_BACKGROUND ? (
    <VirtualBackgroundContainer {...{ panelHeight }} />
  ) : (
    <List style={{ padding: listPadding }}>
      {moreOptionArr.map(
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
                  <Icon
                    fillColor={
                      disabled
                        ? appTheme === appThemes.DARK
                          ? theme.palette.darkTheme.four
                          : appTheme === appThemes.LIGHT
                          ? theme.palette.lightTheme.five
                          : theme.palette.text.secondary
                        : appTheme === appThemes.LIGHT
                        ? theme.palette.lightTheme.contrastText
                        : theme.palette.common.white
                    }
                  />
                </ListItemAvatar>
                <div>
                  <h1
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: disabled
                        ? appTheme === appThemes.DARK
                          ? theme.palette.darkTheme.four
                          : appTheme === appThemes.LIGHT
                          ? theme.palette.lightTheme.five
                          : theme.palette.text.secondary
                        : appTheme === appThemes.LIGHT
                        ? theme.palette.lightTheme.contrastText
                        : theme.palette.common.white,
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
                          : theme.palette.text.secondary,
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
