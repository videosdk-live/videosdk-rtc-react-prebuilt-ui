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
  Input,
  makeStyles,
} from "@material-ui/core";
import React, { useState } from "react";
import useWindowSize from "../../utils/useWindowSize";
import useIsTab from "../../utils/useIsTab";
import useIsMobile from "../../utils/useIsMobile";

const useStyles = makeStyles(() => ({
  noBorder: {
    border: "none",
    backgroundColor: "#3D3C4E",
    color: "#fff",
  },
}));

export default function LiveStreamConfigTabPanel({ panelWidth, panelHeight }) {
  const { width } = useWindowSize();
  const isTab = useIsTab();
  const isMobile = useIsMobile();
  const theme = useTheme();

  const [onEditClick, setOnEditClick] = useState(false);
  const [onCancelClick, setOnCancelClick] = useState(false);
  const [onSaveClick, setOnSaveClick] = useState(false);
  const [streamKey, setStreamKey] = useState("");
  const [streamUrl, setStreamUrl] = useState("");
  const [liveStreamDetails, setLiveStreamDetails] = [
    {
      streamKey: streamKey,
      streamUrl: streamUrl,
    },
  ];

  const [liveStreamPlatform, setLiveStreamPlatform] = useState([
    { id: 1, title: "Facebook", streamKey: "", streamUrl: "", isEdit: false },
    { id: 2, title: "Youtube", streamKey: "", streamUrl: "", isEdit: false },
    { id: 3, title: "Custom", streamKey: "", streamUrl: "", isEdit: false },
  ]);

  const _createNewPlatform = (e) => {
    setLiveStreamPlatform((items) => [
      ...items,
      {
        id: 4,
        title: "Custom",
        streamKey: "",
        streamUrl: "",
        isEdit: false,
      },
    ]);
  };

  const setOptionAsEdit = (itemId) => {
    const newPlatforms = liveStreamPlatform.map((item) => {
      if (item.id === itemId) {
        return { ...item, isEdit: true };
      } else {
        return { ...item, isEdit: false };
      }
    });

    setLiveStreamPlatform(newPlatforms);
  };

  const setOptionAsEditFalse = (itemId) => {
    const newPlatforms = liveStreamPlatform.map((item) => {
      if (item.id === itemId) {
        return { ...item, isEdit: false };
      } else {
        return { ...item, isEdit: false };
      }
    });

    setLiveStreamPlatform(newPlatforms);
  };

  // const updateLiveStreamingDetails = (itemId, key, url) => {
  //   const newPlatforms = liveStreamPlatform.map((option) => {
  //     if (option.optionId === itemId) {
  //       return { ...option, option: text };
  //     } else {
  //       return option;
  //     }
  //   });
  //   setLiveStreamPlatform(newPlatforms);
  // };

  const classes = useStyles();

  const LiveStreamPlatformArray = [
    { title: "Facebook" },
    { title: "Youtube" },
    { title: "Custom" },
  ];

  return (
    <Box
      style={{
        height: panelHeight - 32,
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      {liveStreamPlatform.map((item, index) => {
        return (
          <Box
            style={{
              borderBottom:
                liveStreamPlatform.length - 1 === index
                  ? ""
                  : "3px solid #3A3F4B",
              paddingRight: "12px",
              paddingLeft: "12px",
              paddingTop: "12px",
              paddingBottom: "12px",
            }}
          >
            <Box
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box style={{ display: "flex", flex: 1 }}>
                <Typography variant={"body1"} style={{ fontWeight: "bold" }}>
                  {item.title}
                </Typography>
              </Box>

              <Box
                style={{
                  display: "flex",
                  flex: 1,
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                }}
              >
                {item.isEdit ? (
                  <>
                    <Button
                      variant="text"
                      onClick={() => {
                        // setOnEditClick(false);
                        setOptionAsEditFalse(item.id);
                        setStreamUrl("");
                        setStreamKey("");
                      }}
                    >
                      CANCEL
                    </Button>
                    <Button
                      variant="text"
                      onClick={() => {
                        setOnSaveClick(true);
                        setOnEditClick(false);
                      }}
                    >
                      SAVE
                    </Button>
                  </>
                ) : (
                  <>
                    {onSaveClick && streamKey != "" && (
                      <Button
                        variant="text"
                        onClick={() => {
                          // setOnEditClick(true);
                          setStreamKey("");
                          setStreamUrl("");
                        }}
                      >
                        REMOVE
                      </Button>
                    )}
                    <Button
                      variant="text"
                      onClick={() => {
                        // setOnEditClick(true);
                        setOptionAsEdit(item.id);
                      }}
                    >
                      EDIT
                    </Button>
                  </>
                )}
              </Box>
            </Box>
            <Box mt={1}>
              <TextField
                placeholder="Stream Key"
                fullWidth
                variant="outlined"
                disabled={!item.isEdit}
                value={streamKey}
                onChange={(e) => {
                  setStreamKey(e.target.value);
                }}
              />
              <TextField
                placeholder="Stream Url"
                fullWidth
                variant="outlined"
                style={{ marginTop: "8px" }}
                disabled={!item.isEdit}
                value={streamUrl}
                onChange={(e) => {
                  setStreamUrl(e.target.value);
                }}
              />
            </Box>
          </Box>
        );
      })}

      <Box style={{ paddingRight: "12px", paddingLeft: "12px" }} mt={3}>
        <Button
          style={{
            backgroundColor: theme.palette.primary.main,
            padding: "10px",
          }}
          fullWidth
          onClick={(e) => {
            _createNewPlatform(e);
          }}
        >
          Add New Platform
        </Button>
      </Box>
    </Box>
  );
}
