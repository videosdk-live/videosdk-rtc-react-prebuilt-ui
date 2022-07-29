import React from "react";
import {
  ButtonBase,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  useTheme,
} from "@material-ui/core";
import QAIcon from "../../icons/QAIcon";
import PollIcon from "../../icons/PollIcon";
import useResponsiveSize from "../../utils/useResponsiveSize";
import CreatePoll from "../../components/pollContainer/CreatePoll";
import {
  sideBarNestedModes,
  useMeetingAppContext,
} from "../../MeetingAppContextDef";
import PollList from "../../components/pollContainer/PollList";
import SubmitPollList from "../../components/pollContainer/SubmitPollList";

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
    setIsPollSelected,
    isPollSelected,
    polls,
    draftPolls,
    isCreateNewPollClicked,
    canCreatePoll,
    setSideBarNestedMode,
    sideBarNestedMode,
  } = useMeetingAppContext();

  return sideBarNestedMode === sideBarNestedModes.POLLS ? (
    canCreatePoll ? (
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
        {
          Icon: QAIcon,
          primary: "Q&A",
          secondary: "Participants can post questions.",
          disabled: true,
          onClick: () => {},
        },
      ].map(({ Icon, primary, secondary, disabled, onClick }, i) => (
        <ButtonBase
          disabled={disabled}
          onClick={onClick}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.palette.common.sidePanel,
            width: "100%",
            marginBottom: 12,
            borderRadius: 4,
          }}
        >
          <ListItem key={`activities_panel_item_${i}`}>
            <ListItemAvatar>
              <Icon />
            </ListItemAvatar>
            {/* <h1 style={{ fontSize: 16, fontWeight: 500, color: "white" }}>
              {primary}
            </h1>
            <h2 style={{ fontSize: 14, color: "#95959E", fontWeight: 400 }}>
              {secondary}
            </h2> */}
            <ListItemText primary={primary} secondary={secondary} />
          </ListItem>
        </ButtonBase>
      ))}
    </List>
  );

  return canCreatePoll &&
    sideBarNestedMode === sideBarNestedModes.CREATE_POLL ? (
    <CreatePoll {...{ panelHeight }} />
  ) : sideBarNestedMode === sideBarNestedModes.POLLS ? (
    canCreatePoll ? (
      (polls.length >= 1 || draftPolls.length >= 1) &&
      !isCreateNewPollClicked ? (
        <PollList {...{ panelHeight }} />
      ) : (
        <CreatePoll {...{ panelHeight }} />
      )
    ) : (
      <SubmitPollList {...{ panelHeight }} />
    )
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
        {
          Icon: QAIcon,
          primary: "Q&A",
          secondary: "Participants can post questions.",
          disabled: true,
          onClick: () => {},
        },
      ].map(({ Icon, primary, secondary, disabled, onClick }, i) => (
        <ButtonBase
          disabled={disabled}
          onClick={onClick}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.palette.common.sidePanel,
            width: "100%",
            marginBottom: 12,
            borderRadius: 4,
          }}
        >
          <ListItem key={`activities_panel_item_${i}`}>
            <ListItemAvatar>
              <Icon />
            </ListItemAvatar>
            {/* <h1 style={{ fontSize: 16, fontWeight: 500, color: "white" }}>
              {primary}
            </h1>
            <h2 style={{ fontSize: 14, color: "#95959E", fontWeight: 400 }}>
              {secondary}
            </h2> */}
            <ListItemText primary={primary} secondary={secondary} />
          </ListItem>
        </ButtonBase>
      ))}
    </List>
  );
};

export default ActivitiesTabPanel;
