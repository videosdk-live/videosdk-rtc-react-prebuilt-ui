import {
  Box,
  IconButton,
  Typography,
  useTheme,
  OutlinedInput as Input,
  InputAdornment,
  Popover,
} from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import Linkify from "react-linkify";
import { useMeeting } from "@videosdk.live/react-sdk";
import SendIcon from "@material-ui/icons/Send";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import { formatAMPM, json_verify } from "../../utils/common";
import { toArray } from "react-emoji-render";

const ChatMessage = ({ senderId, senderName, text, timestamp }) => {
  const mMeeting = useMeeting();

  const localParticipantId = mMeeting?.localParticipant?.id;

  const localSender = localParticipantId === senderId;

  const theme = useTheme();

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
          backgroundColor: theme.palette.common.sidePanel,
          display: "flex",
          flexDirection: "column",
          alignItems: localSender ? "flex-end" : "flex-start",
        }}
      >
        <Typography style={{ color: "#ffffff80" }}>
          {localSender ? "You" : senderName}
        </Typography>
        <Box mt={0.5}>
          <Typography
            style={{
              display: "inline-block",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
            }}
          >
            {toArray(text).map((t, i) => (
              <React.Fragment key={`chat_item_text_${i}`}>
                {typeof t === "string" ? (
                  <Linkify
                    properties={{
                      target: "_blank",
                      style: {
                        color: theme.palette.primary.main,
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
        <Box mt={0.5}>
          <Typography
            variant={"caption"}
            style={{ color: "#ffffff80", fontStyle: "italic" }}
          >
            {formatAMPM(new Date(parseInt(timestamp)))}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const ChatMessages = ({ listHeight }) => {
  const listRef = useRef();

  const scrollToBottom = (data, t) => {
    if (!data) {
      const scrollTo = listRef.current?.offsetHeight + 1000;

      setTimeout(() => {
        if (listRef.current) {
          listRef.current.scrollTop = scrollTo;
        }
      }, t || 100);
    } else {
      const { text } = data;

      if (json_verify(text)) {
        const { type } = JSON.parse(text);
        if (type === "CHAT") {
          const scrollTo = listRef.current?.offsetHeight + 1000;

          setTimeout(() => {
            if (listRef.current) {
              listRef.current.scrollTop = scrollTo;
            }
          }, t || 100);
        }
      }
    }
  };

  const mMeeting = useMeeting({
    onChatMessage: scrollToBottom,
  });

  const messages = mMeeting?.messages;

  useEffect(() => {
    scrollToBottom(null, 1000);
  }, []);

  return messages ? (
    <Box ref={listRef} style={{ overflowY: "scroll", height: listHeight }}>
      <Box p={2}>
        {messages.map((message, i) => {
          const { senderId, senderName, text, timestamp } = message;
          if (json_verify(text)) {
            const { type, data } = JSON.parse(text);
            if (type === "CHAT") {
              return (
                <ChatMessage
                  key={`chat_item_${i}`}
                  {...{ senderId, senderName, text: data.message, timestamp }}
                />
              );
            }
            return <></>;
          }
          return <></>;
        })}
      </Box>
    </Box>
  ) : (
    <p>no messages</p>
  );
};

const ChatMessageInput = ({ inputHeight }) => {
  const [messageText, setMessageText] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);

  const input = useRef();
  const inputContainer = useRef();

  const mMeeting = useMeeting();

  const sendChatMessage = mMeeting?.sendChatMessage;
  const theme = useTheme();

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
          theme={"dark"}
          style={{
            backgroundColor: theme.palette.background.default,
          }}
          color={theme.palette.primary.main}
          onSelect={(e) => {
            setMessageText((s) => `${s}${e.native}`);
          }}
        />
      </Popover>

      <Input
        style={{ paddingRight: 0 }}
        rows={1}
        rowsMax={2}
        multiline
        ref={input}
        placeholder="Write your message"
        fullWidth
        value={messageText}
        onKeyPress={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            const message = messageText.trim();

            if (message.length > 0) {
              sendChatMessage(
                JSON.stringify({
                  type: "CHAT",
                  data: { message },
                })
              );
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
                  <InsertEmoticonIcon fontSize={"small"} />
                </IconButton>
              </Box>
              <Box>
                <IconButton
                  disabled={!messageText.trim().length}
                  onClick={() => {
                    const message = messageText.trim();
                    if (message.length > 0) {
                      sendChatMessage(
                        JSON.stringify({
                          type: "CHAT",
                          data: { message },
                        })
                      );

                      setTimeout(() => {
                        setMessageText("");
                      }, 100);
                      input.current?.focus();
                    }
                  }}
                >
                  <SendIcon fontSize={"small"} />
                </IconButton>
              </Box>
            </Box>
          </InputAdornment>
        }
      ></Input>
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
