import {
  Constants,
  useMeeting,
  useParticipant,
  usePubSub,
} from "@videosdk.live/react-sdk";
import { useEffect, useRef, useState } from "react";
import { useMeetingAppContext } from "../MeetingAppContextDef";
import ConfirmBox from "./ConfirmBox";
import { meetingModes } from "../CONSTS";
import { useSnackbar } from "notistack";

const reqInfoDefaultState = {
  enabled: false,
  mode: null,
  senderId: null,
  accept: () => { },
  reject: () => { },
};

const ModeListner = () => {
  const { enqueueSnackbar } = useSnackbar();
  const mMeetingRef = useRef();
  const {
    setMeetingMode,
    meetingMode,
    setSideBarMode,
    notificationSoundEnabled,
    notificationAlertsEnabled,
    mainViewParticipants,
    setMainViewParticipants,
  } = useMeetingAppContext();

  const [reqModeInfo, setReqModeInfo] = useState(reqInfoDefaultState);

  const mMeeting = useMeeting();
  const localParticipantId = mMeeting?.localParticipant?.id;
  const participant = useParticipant(localParticipantId);
  const { publish } = usePubSub(
    `CURRENT_MODE_${mMeeting?.localParticipant?.id}`
  );

  const participantRef = useRef();
  const mainViewParticipantsRef = useRef();
  const publishRef = useRef();
  const notificationSoundEnabledRef = useRef();
  const notificationAlertsEnabledRef = useRef();

  useEffect(() => {
    publishRef.current = publish;
  }, [publish]);

  useEffect(() => {
    mMeetingRef.current = mMeeting;
  }, [mMeeting]);

  useEffect(() => {
    participantRef.current = participant;
  }, [participant]);

  useEffect(() => {
    mainViewParticipantsRef.current = [...mainViewParticipants];
  }, [mainViewParticipants]);

  useEffect(() => {
    notificationSoundEnabledRef.current = notificationSoundEnabled;
  }, [notificationSoundEnabled]);
  useEffect(() => {
    notificationAlertsEnabledRef.current = notificationAlertsEnabled;
  }, [notificationAlertsEnabled]);

  usePubSub(`CHANGE_MODE_${mMeeting?.localParticipant?.id}`, {
    onMessageReceived: async (data) => {

      const { mode } = JSON.parse(data.message);
      if (mode === meetingModes.SEND_AND_RECV) {
        setReqModeInfo({
          enabled: true,
          senderId: data.senderId,
          mode: mode,
          accept: () => { },
          reject: () => { },
        });
      } else {
        try {
          await mMeeting.changeMode(mode);
        } catch (err) {
          console.error('changeMode failed', err);
        }
        try {
          await publishRef.current(mode, { persist: true });
        } catch (error) {
          console.log("Error in Pubsub ", error);
        }

        const muteMic = mMeetingRef.current?.muteMic;
        const disableWebcam = mMeetingRef.current?.disableWebcam;
        const disableScreenShare = mMeetingRef.current?.disableScreenShare;

        try {
          await muteMic();
        } catch (err) {
          console.error('muteMic failed', err);
        }
        try {
          await disableWebcam();
        } catch (err) {
          console.error('disableWebcam failed', err);
        }
        try {
          await disableScreenShare();
        } catch (err) {
          console.error('disableScreenShare failed', err);
        }

        if (participantRef.current?.pinState?.share ||
          participantRef.current?.pinState?.cam) {
          try {
            await participantRef.current?.unpin();
          } catch (err) {
            console.error('unpin failed', err);
          }
        }

        setSideBarMode(null);
      }
    },
  });

  const { publish: invitatioAcceptedPublish } = usePubSub(
    `INVITATION_ACCEPT_BY_COHOST`,
    {
      onMessageReceived: (data) => {
        if (notificationSoundEnabledRef.current) {
          new Audio(
            `https://static.videosdk.live/prebuilt/notification.mp3`
          ).play();
        }
        if (notificationAlertsEnabledRef.current) {
          enqueueSnackbar(`${data.senderName} has been added as a Co-host`);
        }
      },
      onOldMessagesReceived: (messages) => { },
    }
  );

  const { publish: invitatioRejectedPublish } = usePubSub(
    `INVITATION_REJECT_BY_COHOST`,
    {
      onMessageReceived: (data) => {
        const { senderId } = JSON.parse(data.message);
        if (senderId === participantRef.current.participant.id) {
          if (notificationSoundEnabledRef.current) {
            new Audio(
              `https://static.videosdk.live/prebuilt/notification.mp3`,
            ).play();
          }

          if (notificationAlertsEnabledRef.current) {
            enqueueSnackbar(
              `${data.senderName} has rejected the request to become Co-host`,
            );
          }
        }
      },
      onOldMessagesReceived: (messages) => {},
    },
  );

  useEffect(() => {
    setTimeout(async () => {
      try {
        await publishRef.current(meetingMode, { persist: true });
      } catch (err) {
        console.error('publish failed', err);
      }
    }, 2000);
  }, []);

  useMeeting({
    onParticipantModeChanged: ({ mode, participantId }) => {
      if (participantId === localParticipantId) {
        setMeetingMode(mode);
      }
      const mainViewParticipants = mainViewParticipantsRef.current;

      if (mode == Constants.modes.SEND_AND_RECV) {
        if (!mainViewParticipants.includes(participantId)) {
          setMainViewParticipants([...mainViewParticipants, participantId]);
        }
      } else {
        setMainViewParticipants(
          mainViewParticipants.filter((pID) => pID !== participantId)
        );
      }
    },
  });

  return (
    <>
      <ConfirmBox
        open={reqModeInfo.enabled}
        successText={"Accept"}
        rejectText={"Deny"}
        onReject={async () => {
          setReqModeInfo(reqInfoDefaultState);
          try {
            await invitatioRejectedPublish(
              JSON.stringify({ senderId: reqModeInfo.senderId }),
              { persist: true },
            );
          } catch (error) {
            console.log("Error in Pubsub ", error);
          }
        }}
        onSuccess={async () => {
          try {
            await mMeeting.changeMode(reqModeInfo.mode);
          } catch (err) {
            console.error('changeMode failed', err);
          }
          try {
            await publishRef.current(reqModeInfo.mode, { persist: true });
          } catch (err) {
            console.error('publish failed', err);
          }
          setReqModeInfo(reqInfoDefaultState);
          try {
            await invitatioAcceptedPublish("", {
              persist: true,
            });
          } catch (error) {
            console.log("Error in Pubsub ", error);
          }
        }}
        title={`Request to become a Co-host`}
        subTitle={`Host has requested you to become a Co-host`}
      />
    </>
  );
};

export default ModeListner;
