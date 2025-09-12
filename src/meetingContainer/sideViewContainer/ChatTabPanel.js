import {
  Box,
  IconButton,
  Typography,
  useTheme,
  OutlinedInput as Input,
  InputAdornment,
  Popover,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import Linkify from "react-linkify";
import { useMeeting, usePubSub } from "@videosdk.live/react-sdk";
import SendIcon from "@mui/icons-material/Send";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import Picker from "@emoji-mart/react";
import { formatAMPM, json_verify, nameTructed } from "../../utils/common";
import { toArray } from "react-emoji-render";
import { appThemes, useMeetingAppContext } from "../../MeetingAppContextDef";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";

const ChatMessage = ({ senderId, senderName, text, timestamp }) => {
  const mMeeting = useMeeting();

  const localParticipantId = mMeeting?.localParticipant?.id;

  const localSender = localParticipantId === senderId;

  const theme = useTheme();
  const { appTheme } = useMeetingAppContext();

  return (
    <Box
      style={{
        display: "flex",
        justifyContent: localSender ? "flex-end" : "flex-start",
        maxWidth: "100%",
      }}
      mt={2}
    >
      <Box
        style={{
          paddingTop: theme.spacing(0.5),
          paddingBottom: theme.spacing(0.5),
          paddingLeft: theme.spacing(1),
          paddingRight: theme.spacing(1),
          borderRadius: 6,
          backgroundColor:
            appTheme === appThemes.DARK
              ? theme.palette.darkTheme.seven
              : appTheme === appThemes.LIGHT
                ? theme.palette.lightTheme.three
                : theme.palette.common.sidePanel,
          display: "flex",
          flexDirection: "column",
          // alignItems: localSender ? "flex-end" : "flex-start",
        }}
      >
        <Typography
          style={{
            color:
              appTheme === appThemes.LIGHT
                ? theme.palette.lightTheme.five
                : appTheme === appThemes.DARK
                  ? theme.palette.lightTheme.four
                  : "#ffffff80",
            textAlign: "left",
          }}
        >
          {localSender ? "You" : nameTructed(senderName, 15)}
        </Typography>
        <Box
          mt={0.5}
          style={{
            display: "flex",
            alignItems: localSender ? "flex-end" : "flex-start",
          }}
        >
          <Typography
            style={{
              display: "inline-block",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              textAlign: "right",
              color:
                appTheme === appThemes.LIGHT
                  ? theme.palette.lightTheme.contrastText
                  : "white",
            }}
          >
            {toArray(text).map((t, i) => (
              <React.Fragment key={`chat_item_text_${i}`}>
                {typeof t === "string" ? (
                  <Linkify
                    properties={{
                      target: "_blank",
                      style: {
                        color:
                          appTheme === appThemes.LIGHT ||
                            appTheme === appThemes.DARK
                            ? theme.palette.lightTheme.primaryMain
                            : theme.palette.primary.main,
                      },
                    }}
                  >
                    {t}
                  </Linkify>
                ) : (
                  t
                )}
              </React.Fragment>
            ))}
          </Typography>
        </Box>
        <Box mt={0.5} style={{ textAlign: "right" }}>
          <Typography
            variant={"caption"}
            style={{
              color:
                appTheme === appThemes.LIGHT
                  ? theme.palette.lightTheme.four
                  : appTheme === appThemes.DARK
                    ? theme.palette.lightTheme.five
                    : "#ffffff80",
              fontStyle: "italic",
              textAlign: "right",
            }}
          >
            {formatAMPM(new Date(timestamp))}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const ChatMessages = ({ listHeight }) => {
  const listRef = useRef();

  const scrollToBottom = (data) => {
    if (!data) {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }
    } else {
      const { text } = data;

      if (json_verify(text)) {
        const { type } = JSON.parse(text);
        if (type === "CHAT") {
          if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
          }
        }
      }
    }
  };

  const { messages } = usePubSub("CHAT");

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return messages ? (
    <Box ref={listRef} style={{ overflowY: "scroll", height: listHeight }}>
      <Box p={2}>
        {messages.map((msg, i) => {
          const { senderId, senderName, message, timestamp } = msg;
          return (
            <ChatMessage
              key={`chat_item_${i}`}
              {...{ senderId, senderName, text: message, timestamp }}
            />
          );
        })}
      </Box>
    </Box>
  ) : (
    <p>No messages</p>
  );
};

const ChatMessageInput = ({ inputHeight }) => {
  const [messageText, setMessageText] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);

  const input = useRef();
  const inputContainer = useRef();

  const { publish } = usePubSub("CHAT");
  const theme = useTheme();
  const outerTheme = useTheme();

  const { appTheme } = useMeetingAppContext();

  const customTheme = (outerTheme) =>
    createTheme({
      palette: {
        mode: outerTheme.palette.mode,
      },
      components: {
        MuiTextField: {
          styleOverrides: {
            root: {
              "--TextField-brandBorderColor": "#70707033",
              "--TextField-brandBorderHoverColor": "#70707033",
              "--TextField-brandBorderFocusedColor": "#70707033",
              "& label.Mui-focused": {
                color: "var(--TextField-brandBorderFocusedColor)",
              },
            },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            notchedOutline: {
              borderColor: appTheme !== appThemes.LIGHT && "#404B53",
            },
            root: {
              [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
                borderColor:
                  appTheme === appThemes.LIGHT
                    ? "var(--TextField-brandBorderHoverColor)"
                    : "white",
              },
              [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
                borderColor:
                  appTheme === appThemes.LIGHT
                    ? "var(--TextField-brandBorderFocusedColor)"
                    : "white",
                borderWidth: "1px",
              },
              color: appTheme === appThemes.LIGHT ? "#404B53" : "white",
            },
          },
        },
      },
    });

  return (
    <Box
      ref={inputContainer}
      style={{
        height: inputHeight - 1 - theme.spacing(2),
        display: "flex",
        borderTop: "1px solid #70707033",
        alignItems: "center",
        paddingRight: theme.spacing(1),
        paddingLeft: theme.spacing(1),
      }}
    >
      <Popover
        open={emojiOpen}
        onClose={() => {
          setEmojiOpen(false);
        }}
        anchorEl={inputContainer.current}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Picker
          emojiSize={28}
          set={"google"}
          showPreview={false}
          showSkinTones={false}
          theme={appTheme === appThemes.LIGHT ? "light" : "dark"}
          style={{
            backgroundColor:
              appTheme === appThemes.DARK
                ? theme.palette.darkTheme.main
                : appTheme === appThemes.LIGHT
                  ? theme.palette.lightTheme.main
                  : theme.palette.background.default,
          }}
          color={
            appTheme === appThemes.LIGHT || appTheme === appThemes.DARK
              ? theme.palette.lightTheme.primaryMain
              : theme.palette.primary.main
          }
          onEmojiSelect={(e) => {
            setMessageText((s) => `${s}${e.native}`);
          }}
        />
      </Popover>

      <ThemeProvider theme={customTheme(outerTheme)}>
        <Input
          sx={{ marginTop: 1 }}
          rows={1}
          rowsMax={2}
          multiline
          ref={input}
          placeholder="Write your message"
          fullWidth
          value={messageText}
          onKeyPress={async (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              const message = messageText.trim();

              if (message.length > 0) {
                try {
                  await publish(message, { persist: true });
                } catch (error) {
                }
                setTimeout(() => {
                  setMessageText("");
                }, 100);
                input.current?.focus();
              }
            }
          }}
          onChange={(e) => {
            const v = e.target.value;
            setMessageText(v);
          }}
          endAdornment={
            <InputAdornment>
              <Box style={{ display: "flex" }}>
                <Box>
                  <IconButton
                    onClick={() => {
                      setEmojiOpen(true);
                    }}
                  >
                    <InsertEmoticonIcon
                      fontSize={"small"}
                      sx={{
                        color:
                          appTheme === appThemes.LIGHT
                            ? theme.palette.lightTheme.contrastText
                            : "white",
                      }}
                    />
                  </IconButton>
                </Box>
                <Box>
                  <IconButton
                    disabled={!messageText.trim().length}
                    onClick={async() => {
                      const message = messageText.trim();
                      if (message.length > 0) {
                        try {
                          await publish(message, { persist: true });
                        } catch (error) {
                        }
                        setTimeout(() => {
                          setMessageText("");
                        }, 100);
                        input.current?.focus();
                      }
                    }}
                  >
                    <SendIcon
                      fontSize={"small"}
                      style={{
                        color: theme.palette.lightTheme.contrastText,
                      }}
                    />
                  </IconButton>
                </Box>
              </Box>
            </InputAdornment>
          }
        ></Input>
      </ThemeProvider>
    </Box>
  );
};

const ChatTabPanel = ({ panelHeight }) => {
  const inputHeight = 92;
  const listHeight = panelHeight - inputHeight;
  return (
    <div>
      <ChatMessages listHeight={listHeight} />
      <ChatMessageInput inputHeight={inputHeight} />
    </div>
  );
};

export default ChatTabPanel;
