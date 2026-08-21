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
  accept: () => {},
  reject: () => {},
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

  const notificationAudioRef = useRef(null);
  const isPlayingRef = useRef(false);
  const playNotification = () => {
    if (isPlayingRef.current) return;
    if (!notificationAudioRef.current) {
      notificationAudioRef.current = new Audio(
        `https://static.videosdk.live/prebuilt/notification.mp3`
      );
    }
    isPlayingRef.current = true;
    notificationAudioRef.current.currentTime = 0;
    notificationAudioRef.current.play().catch(() => {
      isPlayingRef.current = false;
    });
    notificationAudioRef.current.onended = () => {
      isPlayingRef.current = false;
    };
  };
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
      const { mode } = data.payload;
      if (mode === meetingModes.SEND_AND_RECV) {
        setReqModeInfo({
          enabled: true,
          senderId: data.senderId,
          mode: mode,
          accept: () => {},
          reject: () => {},
        });
      } else {
        try {
          await mMeeting.changeMode(mode);
        } catch (e) {
          console.log("Error changing mode", e);
        }
        try {
          await publishRef.current(mode, { persist: true });
        } catch (error) {
          console.log("Error in Pubsub ", error);
        }

        setSideBarMode(null);
      }
    },
  });

  const { publish: invitationAcceptedPublish } = usePubSub(
    `INVITATION_ACCEPT_BY_COHOST`,
    {
      onMessageReceived: (data) => {
        if (notificationSoundEnabledRef.current) {
          // new Audio(
          //   `https://static.videosdk.live/prebuilt/notification.mp3`
          // ).play();
          playNotification();
        }
        if (notificationAlertsEnabledRef.current) {
          enqueueSnackbar(`${data.senderName} has been added as a Co-host`);
        }
      },
      onOldMessagesReceived: (messages) => {},
    }
  );

  const { publish: invitationRejectedPublish } = usePubSub(
    `INVITATION_REJECT_BY_COHOST`,
    {
      onMessageReceived: (data) => {
        const { senderId } = data.payload;
        if (senderId === participantRef.current.participant.id) {
          if (notificationSoundEnabledRef.current) {
            // new Audio(
            //   `https://static.videosdk.live/prebuilt/notification.mp3`,
            // ).play();
            playNotification();
          }

          if (notificationAlertsEnabledRef.current) {
            enqueueSnackbar(
              `${data.senderName} has rejected the request to become Co-host`
            );
          }
        }
      },
      onOldMessagesReceived: (messages) => {},
    }
  );

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        await publishRef.current(meetingMode, { persist: true });
      } catch (e) {
        console.log("Error in Pubsub ", e);
      }
    }, 2000);
    return () => clearTimeout(timer);
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
            await invitationRejectedPublish(
              "cohost-invitation-rejected",
              { persist: true },
              { senderId: reqModeInfo.senderId }
            );
          } catch (error) {
            console.log("Error in Pubsub ", error);
          }
        }}
        onSuccess={async () => {
          try {
            await mMeeting.changeMode(reqModeInfo.mode);
          } catch (e) {
            console.log("Error changing mode", e);
          }
          try {
            await publishRef.current(reqModeInfo.mode, { persist: true });
          } catch (e) {
            console.log("Error in Pubsub ", e);
          }
          setReqModeInfo(reqInfoDefaultState);
          try {
            await invitationAcceptedPublish("", {
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
