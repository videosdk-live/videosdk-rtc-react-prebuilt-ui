import React from "react";
import {
  ButtonBase,
  List,
  ListItem,
  ListItemAvatar,
  useTheme,
} from "@material-ui/core";
import QAIcon from "../../icons/QAIcon";
import PollIcon from "../../icons/PollIcon";
import useResponsiveSize from "../../utils/useResponsiveSize";
import CreatePoll from "../../components/pollContainer/CreatePoll";
import {
  sideBarNestedModes,
  themeColorType,
  useMeetingAppContext,
} from "../../MeetingAppContextDef";
import PollList from "../../components/pollContainer/PollList";
import SubmitPollList from "../../components/pollContainer/SubmitPollList";
import { meetingModes } from "../../CONSTS";

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
    meetingMode,
    themeColor,
  } = useMeetingAppContext();

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
  ) : (
    <List style={{ padding: listPadding }}>
      {[
        {
          Icon: PollIcon,
          primary: "Polls",
          secondary: "Find out participant’s opinion.",
          disabled: false,
          onClick: () => {
            setSideBarNestedMode(sideBarNestedModes.POLLS);
          },
        },
        // {
        //   Icon: QAIcon,
        //   primary: "Q&A",
        //   secondary: "Participants can post questions.",
        //   disabled: true,
        //   onClick: () => {},
        // },
      ].map(({ Icon, primary, secondary, disabled, onClick }, i) => (
        <ButtonBase
          disabled={disabled}
          onClick={onClick}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor:
              themeColor === themeColorType.DARK
                ? theme.palette.darkTheme.seven
                : themeColor === themeColorType.LIGHT
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
                    themeColor === themeColorType.LIGHT
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
                    themeColor === themeColorType.DARK
                      ? theme.palette.darkTheme.four
                      : themeColor === themeColorType.LIGHT
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
            {/* <ListItemText
              style={{ fontWeight: primary && 500 }}
              primary={primary}
              secondary={secondary}
            /> */}
          </ListItem>
        </ButtonBase>
      ))}
    </List>
  );
};

export default ActivitiesTabPanel;
