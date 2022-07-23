import { useMeeting, usePubSub } from "@videosdk.live/react-sdk";
import { useEffect, useRef, useState } from "react";
import { useMeetingAppContext } from "../MeetingAppContextDef";
import ConfirmBox from "./ConfirmBox";

const reqInfoDefaultState = {
  enabled: false,
  mode: null,
  accept: () => {},
  reject: () => {},
};

const ModeListner = () => {
  const { setMeetingMode, meetingMode } = useMeetingAppContext();

  const [reqModeInfo, setReqModeInfo] = useState(reqInfoDefaultState);

  const mMeeting = useMeeting();

  const publishRef = useRef();

  const { publish } = usePubSub(`CURRENT_MODE_${mMeeting.localParticipant.id}`);

  useEffect(() => {
    publishRef.current = publish;
  }, [publish]);

  usePubSub(`CHANGE_MODE_${mMeeting?.localParticipant?.id}`, {
    onMessageReceived: (data) => {
      if (data.message.mode === "conference") {
        setReqModeInfo({
          enabled: true,
          mode: data.message.mode,
          accept: () => {
            console.log("data", data.message);
          },
          reject: () => {},
        });
      } else {
        setMeetingMode(data.message.mode);
        publishRef.current(data.message.mode, { persist: true });
        mMeeting.disableWebcam();
        mMeeting.diableMic();
        mMeeting.disableScreenShare();
      }
    },
  });

  useEffect(() => {
    setTimeout(() => {
      publishRef.current(meetingMode, { persist: true });
    }, 2000);
  }, []);

  return (
    <>
      <ConfirmBox
        open={reqModeInfo.enabled}
        successText={"Accept"}
        rejectText={"Deny"}
        onReject={() => {
          setReqModeInfo(reqInfoDefaultState);
        }}
        onSuccess={() => {
          setMeetingMode(reqModeInfo.mode);
          publishRef.current(reqModeInfo.mode, { persist: true });
          setReqModeInfo(reqInfoDefaultState);
        }}
        title={`Toogle your Mode`}
        subTitle={`Host is requesting to toggle your mode`}
      />
    </>
  );
};

export default ModeListner;
