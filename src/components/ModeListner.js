import {
  useMeeting,
  useParticipant,
  usePubSub,
} from "@videosdk.live/react-sdk";
import { useEffect, useRef, useState } from "react";
import { useMeetingAppContext } from "../MeetingAppContextDef";
import ConfirmBox from "./ConfirmBox";
import { meetingModes } from "../CONSTS";

const reqInfoDefaultState = {
  enabled: false,
  mode: null,
  accept: () => {},
  reject: () => {},
};

const ModeListner = () => {
  const mMeetingRef = useRef();
  const { setMeetingMode, meetingMode, setSideBarMode } =
    useMeetingAppContext();

  const [reqModeInfo, setReqModeInfo] = useState(reqInfoDefaultState);

  const mMeeting = useMeeting();
  const localParticipantId = mMeeting?.localParticipant?.id;
  const participant = useParticipant(localParticipantId);
  const { publish } = usePubSub(`CURRENT_MODE_${mMeeting.localParticipant.id}`);

  const participantRef = useRef();
  const publishRef = useRef();

  useEffect(() => {
    publishRef.current = publish;
  }, [publish]);

  useEffect(() => {
    mMeetingRef.current = mMeeting;
  }, [mMeeting]);

  useEffect(() => {
    participantRef.current = participant;
  }, [participant]);

  usePubSub(`CHANGE_MODE_${mMeeting?.localParticipant?.id}`, {
    onMessageReceived: (data) => {
      if (data.message.mode === meetingModes.CONFERENCE) {
        setReqModeInfo({
          enabled: true,
          mode: data.message.mode,
          accept: () => {},
          reject: () => {},
        });
      } else {
        setMeetingMode(data.message.mode);
        publishRef.current(data.message.mode, { persist: true });

        const muteMic = mMeetingRef.current?.muteMic;
        const disableWebcam = mMeetingRef.current?.disableWebcam;
        const disableScreenShare = mMeetingRef.current?.disableScreenShare;

        muteMic();
        disableWebcam();
        disableScreenShare();

        (participantRef.current?.pinState?.share ||
          participantRef.current?.pinState?.cam) &&
          participantRef.current?.unpin();

        setSideBarMode(null);
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
