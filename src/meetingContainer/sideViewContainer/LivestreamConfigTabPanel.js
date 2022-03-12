import {
  Box,
  TextField,
  Typography,
  useTheme,
  Button,
  makeStyles,
  Input,
} from "@material-ui/core";
import React, { useState } from "react";
import useWindowSize from "../../utils/useWindowSize";
import useIsTab from "../../utils/useIsTab";
import useIsMobile from "../../utils/useIsMobile";

const useStyles = makeStyles(() => ({
  textField: {
    borderRadius: "4px",
    backgroundColor: "#3D3C4E",
    color: "white",
  },
  input: {
    color: "white",
  },
  root: {
    "& .MuiFilledInput-input": {
      padding: "12px 12px 12px",
    },
  },
}));

const styles = (theme) => ({
  textField: {
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
    paddingBottom: 0,
    marginTop: 0,
    fontWeight: 500,
  },
  input: {
    color: "white",
  },
});

export default function LiveStreamConfigTabPanel({ panelWidth, panelHeight }) {
  const { width } = useWindowSize();
  const isTab = useIsTab();
  const isMobile = useIsMobile();
  const theme = useTheme();

  const [onSaveClick, setOnSaveClick] = useState(false);
  // const [streamKey, setStreamKey] = useState("");
  // const [streamUrl, setStreamUrl] = useState("");
  // const [liveStreamDetails, setLiveStreamDetails] = [
  //   {
  //     streamKey: streamKey,
  //     streamUrl: streamUrl,
  //   },
  // ];

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

  const updateLiveStreamingUrl = (itemId, url) => {
    const newPlatforms = liveStreamPlatform.map((item) => {
      if (item.id === itemId) {
        return { ...item, streamUrl: url };
      } else {
        return item;
      }
    });
    setLiveStreamPlatform(newPlatforms);
  };

  const updateLiveStreamingKey = (itemId, key) => {
    const newPlatforms = liveStreamPlatform.map((item) => {
      if (item.id === itemId) {
        return { ...item, streamKey: key };
      } else {
        return item;
      }
    });
    setLiveStreamPlatform(newPlatforms);
  };

  const updateLiveStreamingDetailsEmpty = (itemId) => {
    const newPlatforms = liveStreamPlatform.map((item) => {
      if (item.id === itemId) {
        return { ...item, streamKey: "", streamUrl: "", isEdit: false };
      } else {
        return item;
      }
    });

    setLiveStreamPlatform(newPlatforms);
  };

  const classes = useStyles();

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
                        updateLiveStreamingDetailsEmpty(item.id);
                        // setOptionAsEditFalse(item.id);
                      }}
                    >
                      CANCEL
                    </Button>
                    <Button
                      variant="text"
                      onClick={() => {
                        setOnSaveClick(true);
                        setOptionAsEditFalse(item.id);
                      }}
                    >
                      SAVE
                    </Button>
                  </>
                ) : (
                  <>
                    {onSaveClick && item.streamKey != "" && (
                      <Button
                        variant="text"
                        onClick={() => {
                          updateLiveStreamingDetailsEmpty(item.id);
                        }}
                      >
                        REMOVE
                      </Button>
                    )}
                    <Button
                      variant="text"
                      onClick={() => {
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
                variant="filled"
                type="password"
                className={classes.root}
                disabled={!item.isEdit}
                value={item.streamKey}
                InputProps={{
                  disableUnderline: true,
                  classes: {
                    root: classes.textField,
                  },
                }}
                onChange={(e) => {
                  updateLiveStreamingKey(item.id, e.target.value);
                }}
              />
              <TextField
                placeholder="Stream Url"
                fullWidth
                variant="filled"
                style={{ marginTop: "8px" }}
                className={classes.root}
                disabled={!item.isEdit}
                value={item.streamUrl}
                InputProps={{
                  disableUnderline: true,
                  classes: {
                    root: classes.textField,
                  },
                }}
                onChange={(e) => {
                  updateLiveStreamingUrl(item.id, e.target.value);
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
