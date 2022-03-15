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

  const [onSaveClick, setOnSaveClick] = useState(false);
  const [streamKey, setStreamKey] = useState("");
  const [streamUrl, setStreamUrl] = useState("");
  const [streamKeyErr, setStreamKeyErr] = useState(false);
  const [streamUrlErr, setStreamUrlErr] = useState(false);

  const [liveStreamPlatform, setLiveStreamPlatform] = useState([
    // { id: 1, title: "Facebook", streamKey: "", streamUrl: "", isEdit: false },
    // { id: 2, title: "Youtube", streamKey: "", streamUrl: "", isEdit: false },
    { id: 1, title: "Custom", streamKey: "", streamUrl: "", isEdit: false },
  ]);

  const { liveStreamConfig, setLiveStreamConfig } = useMeetingAppContext();

  const liveStreamConfigRef = useRef();

  // todo :
  // add liveStreamConfigRef using useRef and useEffect
  useEffect(() => {
    liveStreamConfigRef.current = liveStreamConfig;
  }, [liveStreamConfig]);

  const { publish } = usePubSub("LIVE_STREAM_CONFIG");

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

    console.log("remove data", filtered);
    publish(filtered);
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
    //  liveStreamConfig .push({ id : generatenewid() ,  streamKey,streamUrl})
    liveStreamConfig.push({ id: uuid(), streamKey, streamUrl });

    publish({ config: liveStreamConfig });
    setStreamKey("");
    setStreamUrl("");

    // streamKey, streamUrl => clear this states
  };

  const rootDomain = extractRootDomain(streamUrl);
  const mainDomain = rootDomain?.split(".")[0];
  const domainName = mainDomain.charAt(0).toUpperCase() + mainDomain.slice(1);

  console.log("liveconfigtabpanel", liveStreamConfig);

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
        // style={{

        //   // height: panelHeight - 32,
        //   overflowY: "auto",
        //   overflowX: "hidden",
        // }}
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
                  {item.isEdit ? (
                    <>
                      <Button
                        variant="text"
                        onClick={() => {
                          updateLiveStreamingDetailsEmpty(item.id);
                          // setOptionAsEditFalse(item.id);
                        }}
                        className={classes.button}
                      >
                        CANCEL
                      </Button>
                      <Button
                        variant="text"
                        onClick={() => {
                          setOnSaveClick(true);
                          setOptionAsEditFalse(item.id);
                        }}
                        className={classes.button}
                      >
                        SAVE
                      </Button>
                    </>
                  ) : (
                    <>
                      {/* {onSaveClick && item.streamKey != "" && ( */}
                      <Button
                        variant="text"
                        onClick={() => {
                          // updateLiveStreamingDetailsEmpty(item.id);
                          _handleRemove({ id: item.id });
                        }}
                        className={classes.button}
                      >
                        REMOVE
                      </Button>
                      {/* )} */}
                      <Button
                        variant="text"
                        onClick={() => {
                          setOptionAsEdit(item.id);
                        }}
                        className={classes.button}
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
      </Box>
      <Box
        style={{
          // borderBottom: "3px solid #3A3F4B",
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
            {/* {item.isEdit ? (
              <>
                <Button
                  variant="text"
                  onClick={() => {
                    updateLiveStreamingDetailsEmpty(item.id);
                    // setOptionAsEditFalse(item.id);
                  }}
                  className={classes.button}
                >
                  CANCEL
                </Button>
                <Button
                  variant="text"
                  onClick={() => {
                    setOnSaveClick(true);
                    setOptionAsEditFalse(item.id);
                  }}
                  className={classes.button}
                >
                  SAVE
                </Button>
              </>
            ) : (
              <> */}
            {onSaveClick && streamKey != "" && (
              <Button
                variant="text"
                onClick={() => {
                  // updateLiveStreamingDetailsEmpty(item.id);
                }}
                className={classes.button}
              >
                REMOVE
              </Button>
            )}
            <Button
              variant="text"
              onClick={() => {
                const isValid = handleValidation();
                if (isValid) {
                  _handleSave({ streamKey: streamKey, streamUrl: streamUrl });
                  // setOptionAsEdit(item.id);
                }
              }}
              className={classes.button}
            >
              {/* EDIT */}
              ADD
            </Button>
            {/* </>
            )} */}
          </Box>
        </Box>
        <Box mt={1}>
          <TextField
            placeholder="Stream Key"
            fullWidth
            variant="filled"
            type="password"
            className={classes.root}
            // disabled={!item.isEdit}
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
            // disabled={!item.isEdit}
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

  return (
    <Box
      style={{
        height: panelHeight - 32,
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      {liveStreamPlatform.map((item, index) => {
        const rootDomain = extractRootDomain(item.streamUrl);
        const mainDomain = rootDomain?.split(".")[0];
        const domainName =
          mainDomain.charAt(0).toUpperCase() + mainDomain.slice(1);

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
                {item.isEdit ? (
                  <>
                    <Button
                      variant="text"
                      onClick={() => {
                        updateLiveStreamingDetailsEmpty(item.id);
                        // setOptionAsEditFalse(item.id);
                      }}
                      className={classes.button}
                    >
                      CANCEL
                    </Button>
                    <Button
                      variant="text"
                      onClick={() => {
                        setOnSaveClick(true);
                        setOptionAsEditFalse(item.id);
                      }}
                      className={classes.button}
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
                        className={classes.button}
                      >
                        REMOVE
                      </Button>
                    )}
                    <Button
                      variant="text"
                      onClick={() => {
                        setOptionAsEdit(item.id);
                      }}
                      className={classes.button}
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
