import { useMeeting, usePubSub } from "@videosdk.live/react-sdk";
import React, { useEffect, useRef, useState } from "react";
import ConfirmBox from "./ConfirmBox";

const MediaRequested = () => {
  const reqInfoDefaultState = {
    enabled: false,
    participantName: null,
    accept: () => {},
    reject: () => {},
  };

  const [reqMicInfo, setReqMicInfo] = useState(reqInfoDefaultState);
  const [reqWebcamInfo, setReqWebcamInfo] = useState(reqInfoDefaultState);
  const [reqScreenShareInfo, setReqScreenShareInfo] =
    useState(reqInfoDefaultState);

  const mMeetingRef = useRef();

  const _handleOnWebcamRequested = ({ participantId, accept, reject }) => {
    setReqWebcamInfo({
      enabled: true,
      participantName: "Host",
      accept,
      reject,
    });
  };

  const _handleOnMicRequested = ({ participantId, accept, reject }) => {
    setReqMicInfo({
      enabled: true,
      participantName: "Host",
      accept,
      reject,
    });
  };

  const mMeeting = useMeeting({
    onWebcamRequested: _handleOnWebcamRequested,
    onMicRequested: _handleOnMicRequested,
  });

  useEffect(() => {
    mMeetingRef.current = mMeeting;
  }, [mMeeting]);

  usePubSub(`SCR_SHR_REQ_${mMeeting?.localParticipant.id}`, {
    onMessageReceived: (data) => {
      if (data.message.setScreenShareOn) {
        setReqScreenShareInfo({
          enabled: true,
          participantName: "Host",
          accept: () => {
            mMeeting?.toggleScreenShare();
          },
          reject: () => {},
        });
      } else {
        mMeeting?.toggleScreenShare();
      }
    },
  });

  return (
    <>
      {[
        { ...reqMicInfo, setter: setReqMicInfo, type: "mic" },
        { ...reqWebcamInfo, setter: setReqWebcamInfo, type: "webcam" },
        {
          ...reqScreenShareInfo,
          setter: setReqScreenShareInfo,
          type: "screenShare",
        },
      ].map(({ accept, enabled, participantName, setter, reject, type }, i) => {
        return (
          <ConfirmBox
            {...{
              successText: "Turn on",
              rejectText: "Cancel",
              open: enabled,
              onReject: () => {
                setter(reqInfoDefaultState);
                reject();
              },
              onSuccess: () => {
                setter(reqInfoDefaultState);
                accept();
              },
              title: `Turn on ${type}?`,
              subTitle:
                type === "screenShare"
                  ? `${participantName} is requesting you to share your screen`
                  : `${participantName} is requesting to turn on your ${type}`,
            }}
          />
        );
      })}
    </>
  );
};

export default MediaRequested;
