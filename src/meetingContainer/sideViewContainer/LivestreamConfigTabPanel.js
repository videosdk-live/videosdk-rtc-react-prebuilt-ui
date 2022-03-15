import {
  Box,
  TextField,
  Typography,
  useTheme,
  Button,
  makeStyles,
  Input,
} from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import useWindowSize from "../../utils/useWindowSize";
import useIsTab from "../../utils/useIsTab";
import useIsMobile from "../../utils/useIsMobile";
import { usePubSub } from "@videosdk.live/react-sdk";
import { useMeetingAppContext } from "../../MeetingAppContextDef";
import { v4 as uuid } from "uuid";

const useStyles = makeStyles(() => ({
  textField: {
    borderRadius: "4px",
    backgroundColor: "#3D3C4E",
    color: "white",
  },
  button: {
    color: "#95959E",
    "&:hover": {
      color: "#ffffff",
    },
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

export default function LiveStreamConfigTabPanel({ panelWidth, panelHeight }) {
  const { width } = useWindowSize();
  const isTab = useIsTab();
  const isMobile = useIsMobile();
  const theme = useTheme();

  const [onEditClick, setOnEditClick] = useState(false);
  const [streamKey, setStreamKey] = useState("");
  const [streamUrl, setStreamUrl] = useState("");
  const [streamKeyErr, setStreamKeyErr] = useState(false);
  const [streamUrlErr, setStreamUrlErr] = useState(false);

  const { liveStreamConfig, setLiveStreamConfig } = useMeetingAppContext();

  const liveStreamConfigRef = useRef();

  // add liveStreamConfigRef using useRef and useEffect
  useEffect(() => {
    liveStreamConfigRef.current = liveStreamConfig;
  }, [liveStreamConfig]);

  const { publish } = usePubSub("LIVE_STREAM_CONFIG");

  const setOptionAsEdit = (itemId) => {
    const newPlatforms = liveStreamConfig.map((item) => {
      if (item.id === itemId) {
        return { ...item, isEdit: true };
      } else {
        return { ...item, isEdit: false };
      }
    });

    setLiveStreamConfig(newPlatforms);
  };

  const setOptionAsEditFalse = (itemId) => {
    const newPlatforms = liveStreamConfig.map((item) => {
      if (item.id === itemId) {
        return { ...item, isEdit: false };
      } else {
        return { ...item, isEdit: false };
      }
    });

    setLiveStreamConfig(newPlatforms);
  };

  const updateLiveStreamingUrl = (itemId, url) => {
    const newPlatforms = liveStreamConfig.map((item) => {
      if (item.id === itemId) {
        return { ...item, streamUrl: url };
      } else {
        return item;
      }
    });
    setLiveStreamConfig(newPlatforms);
  };

  const updateLiveStreamingKey = (itemId, key) => {
    const newPlatforms = liveStreamConfig.map((item) => {
      if (item.id === itemId) {
        return { ...item, streamKey: key };
      } else {
        return item;
      }
    });
    setLiveStreamConfig(newPlatforms);
  };

  function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("//") > -1) {
      hostname = url.split("/")[2];
    } else {
      hostname = url.split("/")[0];
    }

    //find & remove port number
    hostname = hostname.split(":")[0];
    //find & remove "?"
    hostname = hostname.split("?")[0];

    return hostname;
  }

  function extractRootDomain(url) {
    var domain = extractHostname(url),
      splitArr = domain.split("."),
      arrLen = splitArr.length;

    //extracting the root domain here
    //if there is a subdomain
    if (arrLen > 2) {
      domain = splitArr[arrLen - 2] + "." + splitArr[arrLen - 1];
      //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
      if (
        splitArr[arrLen - 2].length == 2 &&
        splitArr[arrLen - 1].length == 2
      ) {
        //this is using a ccTLD
        domain = splitArr[arrLen - 3] + "." + domain;
      }
    }
    return domain;
  }

  const classes = useStyles();

  const _handleRemove = ({ id }) => {
    const liveStreamConfig = liveStreamConfigRef.current;

    const filtered = liveStreamConfig.filter(({ id: _id }) => {
      return id !== _id;
    });

    publish({ config: filtered });
  };

  const handleValidation = () => {
    let isValid = true;
    if (streamKey.length === 0) {
      isValid = false;
      setStreamKeyErr(true);
      return false;
    } else {
      setStreamKeyErr(false);
    }
    if (streamUrl.length === 0) {
      isValid = false;
      setStreamUrlErr(true);
      return false;
    } else {
      setStreamUrlErr(false);
    }
    return isValid;
  };

  const _handleSave = ({ streamKey, streamUrl }) => {
    const liveStreamConfig = liveStreamConfigRef.current;
    liveStreamConfig.push({ id: uuid(), streamKey, streamUrl });

    publish({ config: liveStreamConfig });
    setStreamKey("");
    setStreamUrl("");
  };

  const _handleSaveInsideArray = ({ Id, streamKey, streamUrl }) => {
    const liveStreamConfig = liveStreamConfigRef.current;

    const newPlatforms = liveStreamConfig.map((item) => {
      if (item.id === Id) {
        return {
          ...item,
          streamUrl: streamUrl,
          streamKey: streamKey,
          isEdit: false,
        };
      } else {
        return item;
      }
    });

    publish({ config: newPlatforms });
    setLiveStreamConfig(newPlatforms);
  };

  const rootDomain = extractRootDomain(streamUrl);
  const mainDomain = rootDomain?.split(".")[0];
  const domainName = mainDomain.charAt(0).toUpperCase() + mainDomain.slice(1);

  return (
    <Box
      style={{
        height: panelHeight - 32,
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <Box
        style={{
          overflowY: "auto",
          // height: panelHeight
        }}
      >
        {liveStreamConfig?.map((item, index) => {
          const rootDomain = extractRootDomain(item.streamUrl);
          const mainDomain = rootDomain?.split(".")[0];
          const domainName =
            mainDomain.charAt(0).toUpperCase() + mainDomain.slice(1);

          return (
            <Box
              style={{
                borderBottom: "3px solid #3A3F4B",
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
                    {item.streamUrl ? domainName : item.title}
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
                  <Button
                    variant="text"
                    onClick={() => {
                      _handleRemove({ id: item.id });
                    }}
                    className={classes.button}
                  >
                    REMOVE
                  </Button>

                  {item.isEdit ? (
                    <Button
                      variant="text"
                      onClick={() => {
                        setOptionAsEditFalse(item.id);
                        _handleSaveInsideArray({
                          Id: item.id,
                          streamKey: item.streamKey,
                          streamUrl: item.streamUrl,
                        });
                      }}
                      className={classes.button}
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      variant="text"
                      onClick={() => {
                        setOptionAsEdit(item.id);
                        setOnEditClick(true);
                      }}
                      className={classes.button}
                    >
                      EDIT
                    </Button>
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
      </Box>
      <Box
        style={{
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
              {streamUrl ? domainName : "Platform Name"}
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
            <Button
              variant="text"
              onClick={() => {
                const isValid = handleValidation();
                if (isValid) {
                  _handleSave({ streamKey: streamKey, streamUrl: streamUrl });
                }
              }}
              className={classes.button}
            >
              ADD
            </Button>
          </Box>
        </Box>
        <Box mt={1}>
          <TextField
            placeholder="Stream Key"
            fullWidth
            variant="filled"
            type="password"
            className={classes.root}
            value={streamKey}
            InputProps={{
              disableUnderline: true,
              classes: {
                root: classes.textField,
              },
            }}
            onChange={(e) => {
              setStreamKey(e.target.value);
            }}
          />
          {streamKeyErr && (
            <Typography variant="body2" style={{ color: "#D33730" }}>
              Please provide stream key
            </Typography>
          )}
          <TextField
            placeholder="Stream Url"
            fullWidth
            variant="filled"
            style={{ marginTop: "8px" }}
            className={classes.root}
            value={streamUrl}
            InputProps={{
              disableUnderline: true,
              classes: {
                root: classes.textField,
              },
            }}
            onChange={(e) => {
              setStreamUrl(e.target.value);
            }}
          />
          {streamUrlErr && (
            <Typography variant="body2" style={{ color: "#D33730" }}>
              Please provide stream url
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
