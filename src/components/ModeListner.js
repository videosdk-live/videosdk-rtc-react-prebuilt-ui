import { useMeeting, usePubSub } from "@videosdk.live/react-sdk";
import { useEffect, useRef } from "react";
import { useMeetingAppContext } from "../MeetingAppContextDef";

const ModeListner = () => {
  const { setMeetingMode, meetingMode } = useMeetingAppContext();

  const mMeeting = useMeeting();

  const publishRef = useRef();

  const { publish } = usePubSub(
    `CURRENT_MODE_${mMeeting.localParticipant.id}`,
    {
      onMessageReceived: (data) => {},
      onOldMessagesReceived: (messages) => {},
    }
  );

  useEffect(() => {
    publishRef.current = publish;
  }, [publish]);

  usePubSub(`CHANGE_MODE_${mMeeting?.localParticipant?.id}`, {
    onMessageReceived: (data) => {
      setMeetingMode(data.message.mode);

      publishRef.current(data.message.mode, { persist: true });
    },
  });

  useEffect(() => {
    setTimeout(() => {
      publishRef.current(meetingMode, { persist: true });
    }, 2000);
  }, []);

  return <></>;
};

export default ModeListner;
