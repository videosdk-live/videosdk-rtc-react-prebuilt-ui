import {
  Box,
  TextField,
  Typography,
  Button,
  makeStyles,
} from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import { usePubSub } from "@videosdk.live/react-sdk";
import { useMeetingAppContext } from "../../MeetingAppContextDef";
import { v4 as uuid } from "uuid";
import ConfirmBox from "../../components/ConfirmBox";
import { extractRootDomain } from "../../utils/common";

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

const SingleLiveStreamItem = ({
  item,
  liveStreamConfig,
  setLiveStreamConfig,
  setOnRemoveClick,
  setOnCancleClick,
  liveStreamConfigRef,
  publish,
}) => {
  const rootDomain = extractRootDomain(item.url);
  const mainDomain = rootDomain?.split(".")[0];
  const domainName = mainDomain.charAt(0).toUpperCase() + mainDomain.slice(1);

  const classes = useStyles();

  const setOptionAsEdit = (itemId) => {
    const liveStreamConfig = liveStreamConfigRef.current;

    const newPlatforms = liveStreamConfig.map((item) => {
      if (item.id === itemId) {
        return { ...item, isEdit: true };
      } else {
        return { ...item, isEdit: false };
      }
    });

    setLiveStreamConfig(newPlatforms);
  };

  const _handleSaveInsideArray = ({ Id, streamKey, url }) => {
    const liveStreamConfig = liveStreamConfigRef.current;

    const newPlatforms = liveStreamConfig.map((item) => {
      if (item.id === Id) {
        return {
          ...item,
          url,
          streamKey: streamKey,
          isEdit: false,
        };
      } else {
        return item;
      }
    });

    publish({ config: newPlatforms }, { persist: true });
    setLiveStreamConfig(newPlatforms);
  };

  const updateLiveStreamingUrl = (itemId, url) => {
    const liveStreamConfig = liveStreamConfigRef.current;
    const newPlatforms = liveStreamConfig.map((item) => {
      if (item.id === itemId) {
        return { ...item, url };
      } else {
        return item;
      }
    });
    setLiveStreamConfig(newPlatforms);
  };

  const updateLiveStreamingKey = (itemId, key) => {
    const liveStreamConfig = liveStreamConfigRef.current;
    const newPlatforms = liveStreamConfig.map((item) => {
      if (item.id === itemId) {
        return { ...item, streamKey: key };
      } else {
        return item;
      }
    });
    setLiveStreamConfig(newPlatforms);
  };
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
            {item.url ? domainName : item.title}
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
                  _handleSaveInsideArray({
                    Id: item.id,
                    streamKey: item.streamKey,
                    url: item.url,
                  });
                }}
                className={classes.button}
              >
                Save
              </Button>
              <Button
                variant="text"
                onClick={() => {
                  setOnCancleClick({ id: item.id, visible: true });
                }}
                className={classes.button}
              >
                Cancle
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="text"
                onClick={() => {
                  setOptionAsEdit(item.id);
                }}
                className={classes.button}
              >
                EDIT
              </Button>

              <Button
                variant="text"
                onClick={() => {
                  setOnRemoveClick({
                    id: item.id,
                    visible: true,
                    domainName: domainName,
                  });
                }}
                className={classes.button}
              >
                REMOVE
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
          value={item.url}
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
};

const LiveStreamConfigTabPanel = ({ panelWidth, panelHeight }) => {
  const [onCancleClick, setOnCancleClick] = useState({
    id: null,
    visible: false,
  });
  const [onRemoveClick, setOnRemoveClick] = useState({
    id: null,
    domainName: "",
    visible: false,
  });

  const [streamKey, setStreamKey] = useState("");
  const [url, setStreamUrl] = useState("");
  const [streamKeyErr, setStreamKeyErr] = useState(false);
  const [streamUrlErr, setStreamUrlErr] = useState(false);

  const { liveStreamConfig, setLiveStreamConfig } = useMeetingAppContext();

  const liveStreamConfigRef = useRef();

  // add liveStreamConfigRef using useRef and useEffect
  useEffect(() => {
    liveStreamConfigRef.current = liveStreamConfig;
  }, [liveStreamConfig]);

  const { publish } = usePubSub("LIVE_STREAM_CONFIG");

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

  const classes = useStyles();

  const _handleRemove = ({ id }) => {
    const liveStreamConfig = liveStreamConfigRef.current;

    const filtered = liveStreamConfig.filter(({ id: _id }) => {
      return id !== _id;
    });

    publish({ config: filtered }, { persist: true });
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
    if (url.length === 0) {
      isValid = false;
      setStreamUrlErr(true);
      return false;
    } else {
      setStreamUrlErr(false);
    }
    return isValid;
  };

  const _handleSave = ({ streamKey, url }) => {
    const liveStreamConfig = liveStreamConfigRef.current;
    liveStreamConfig.push({ id: uuid(), streamKey, url });

    publish({ config: liveStreamConfig }, { persist: true });
    setStreamKey("");
    setStreamUrl("");
  };

  const rootDomain = extractRootDomain(url);
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
        {liveStreamConfig?.map((item) => {
          return (
            <>
              <SingleLiveStreamItem
                item={item}
                liveStreamConfig={liveStreamConfig}
                setLiveStreamConfig={setLiveStreamConfig}
                liveStreamConfigRef={liveStreamConfigRef}
                setOnRemoveClick={setOnRemoveClick}
                setOnCancleClick={setOnCancleClick}
                publish={publish}
              />
              <ConfirmBox
                open={onRemoveClick.visible}
                title={`${onRemoveClick.domainName} `}
                subTitle={
                  "Are you sure want to remove this live stream configuration?"
                }
                successText={"OKAY"}
                onSuccess={() => {
                  _handleRemove({ id: onRemoveClick.id });
                  setOnRemoveClick({ visible: false });
                }}
                rejectText={"Cancel"}
                onReject={() => {
                  setOptionAsEditFalse(item.id);
                  setOnRemoveClick({
                    visible: false,
                    domainName: onRemoveClick.domainName,
                  });
                }}
              />
              <ConfirmBox
                open={onCancleClick.visible}
                title={"Are you sure want to cancle your changes?"}
                successText={"OKAY"}
                onSuccess={() => {
                  setOptionAsEditFalse(onCancleClick.id);
                  setOnCancleClick({ visible: false });
                }}
                rejectText={"Cancel"}
                onReject={() => {
                  setOnCancleClick({ visible: false });
                }}
              />
            </>
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
              {url ? domainName : "Platform Name"}
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
                  _handleSave({ streamKey: streamKey, url });
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
            value={url}
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
};

export default LiveStreamConfigTabPanel;
