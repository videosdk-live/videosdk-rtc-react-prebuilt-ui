import React from "react";
import {
  ButtonBase,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "@material-ui/core";
import PollIcon from "@material-ui/icons/Poll";

const ActivitiesTabPanel = ({ panelHeight }) => {
  return (
    <List>
      {[
        {
          Icon: PollIcon,
          primary: "Create Poll",
          secondary:
            "Ask participants their opinion on a subject - Coming Soon.",
          disabled: true,
          onClick: () => {},
        },
      ].map(({ Icon, primary, secondary, disabled, onClick }, i) => (
        <ButtonBase
          disabled={disabled}
          onClick={onClick}
          style={{
            alignItems: undefined,
            justifyContent: undefined,
            width: "100%",
          }}
        >
          <ListItem key={`activities_panel_item_${i}`}>
            <ListItemAvatar>
              <Avatar>
                <Icon color={"primary"} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={primary} secondary={secondary} />
          </ListItem>
        </ButtonBase>
      ))}
    </List>
  );
};

export default ActivitiesTabPanel;
