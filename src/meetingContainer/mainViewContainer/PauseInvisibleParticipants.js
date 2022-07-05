import { useMeeting, useParticipant } from "@videosdk.live/react-sdk";
import { useEffect, useState } from "react";
import { appEvents, eventEmitter } from "../../utils/common";

const PauseInvisibleParticipant = ({ participantId, isVisible }) => {
  const { webcamStream, webcamOn, isLocal } = useParticipant(participantId);

  useEffect(() => {
    if (!isLocal && webcamStream && webcamOn) {
      if (isVisible) {
        console.log("resuming participant stream", participantId);
        typeof webcamStream?.resume === "function" && webcamStream?.resume();
      } else {
        console.log("pausing participant stream", participantId);
        typeof webcamStream?.pause === "function" && webcamStream?.pause();
      }
    }
  }, [webcamStream, isLocal, webcamOn, isVisible]);

  return <></>;
};

const PauseInvisibleParticipants = () => {
  const [visibleParticipantIds, setVisibleParticipantIds] = useState([]);

  const mMeeting = useMeeting();

  const _handleParticipantVisible = ({ participantId }) => {
    setVisibleParticipantIds((s) => [...new Set([...s, participantId])]);
  };

  const _handleParticipantInvisible = ({ participantId }) => {
    setVisibleParticipantIds((s) => s.filter((s) => s !== participantId));
  };

  useEffect(() => {
    eventEmitter.on(
      appEvents["participant-visible"],
      _handleParticipantVisible
    );
    eventEmitter.on(
      appEvents["participant-invisible"],
      _handleParticipantInvisible
    );

    return () => {
      eventEmitter.off(
        appEvents["participant-visible"],
        _handleParticipantVisible
      );
      eventEmitter.off(
        appEvents["participant-invisible"],
        _handleParticipantInvisible
      );
    };
  }, []);

  return (
    <>
      {[...mMeeting.participants.keys()].map((participantId) => (
        <PauseInvisibleParticipant
          key={`PauseInvisibleParticipant_${participantId}`}
          participantId={participantId}
          isVisible={visibleParticipantIds.find((pId) => pId === participantId)}
        />
      ))}
    </>
  );
};

export default PauseInvisibleParticipants;
