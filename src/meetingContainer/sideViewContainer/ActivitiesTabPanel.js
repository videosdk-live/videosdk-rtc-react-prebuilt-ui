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

const ActivitiesTabPanel = ({ panelHeight }) => {
  const theme = useTheme();

  const [isPollSelected, setIsPollSelected] = React.useState(false);
  const [isQASelected, setIsQASelected] = React.useState(false);

  const listPadding = useResponsiveSize({
    xl: 12,
    lg: 10,
    md: 8,
    sm: 6,
    xs: 4,
  });

  return (
    <List style={{ padding: listPadding }}>
      {[
        {
          Icon: PollIcon,
          primary: "Polls",
          secondary: "Find out participant’s opinion.",
          disabled: false,
          onClick: () => {
            setIsPollSelected(true);
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
