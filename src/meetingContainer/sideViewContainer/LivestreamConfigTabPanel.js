import {
  Avatar,
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
  Fade,
  Tooltip,
  Button,
} from "@material-ui/core";
import React from "react";
import useWindowSize from "../../utils/useWindowSize";
import useIsTab from "../../utils/useIsTab";
import useIsMobile from "../../utils/useIsMobile";

export default function LiveStreamConfigTabPanel({ panelWidth, panelHeight }) {
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
      <Box mt={1}>
        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            // backgroundColor: "pink",
          }}
        >
          <Typography variant={"body1"} style={{ fontWeight: "bold" }}>
            Facebook
          </Typography>
          <Button variant="text">EDIT</Button>
        </Box>
        <Box mt={1}>
          <TextField placeholder="Stream Key" fullWidth variant="filled" />
          <TextField
            placeholder="Stream Url"
            fullWidth
            style={{ marginTop: "8px" }}
          />
        </Box>
      </Box>
    </Box>
  );
}
