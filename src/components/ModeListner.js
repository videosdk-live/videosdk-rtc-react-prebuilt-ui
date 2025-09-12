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
      if (data.message.mode === meetingModes.SEND_AND_RECV) {
        setReqModeInfo({
          enabled: true,
          senderId: data.senderId,
          mode: data.message.mode,
          accept: () => { },
          reject: () => { },
        });
      } else {
        mMeeting.changeMode(data.message.mode);
        try {
          await publishRef.current(data.message.mode, { persist: true });
        } catch (e) {
        }

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
        if (data.message.senderId === participantRef.current.participant.id) {
          if (notificationSoundEnabledRef.current) {
            new Audio(
              `https://static.videosdk.live/prebuilt/notification.mp3`
            ).play();
          }

          if (notificationAlertsEnabledRef.current) {
            enqueueSnackbar(
              `${data.senderName} has rejected the request to become Co-host`
            );
          }
        }
      },
      onOldMessagesReceived: (messages) => { },
    }
  );

  useEffect(() => {
    setTimeout(() => {
      publishRef.current(meetingMode, { persist: true });
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
              { senderId: reqModeInfo.senderId },
              { persist: true }
            );
          } catch (e) {

          }
        }}
        onSuccess={async () => {
          mMeeting.changeMode(reqModeInfo.mode);
          publishRef.current(reqModeInfo.mode, { persist: true });
          setReqModeInfo(reqInfoDefaultState);
          try {
            await invitatioAcceptedPublish({}, { persist: true });
          } catch (error) {
          }
        }}
        title={`Request to become a Co-host`}
        subTitle={`Host has requested you to become a Co-host`}
      />
    </>
  );
};

export default ModeListner;
