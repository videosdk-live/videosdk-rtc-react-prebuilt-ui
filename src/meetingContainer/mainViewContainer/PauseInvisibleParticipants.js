import { useMeeting, useParticipant } from "@videosdk.live/react-sdk";
import { useEffect, useState } from "react";
import { appEvents, eventEmitter } from "../../utils/common";

const PauseInvisibleParticipant = ({ participantId, isVisible }) => {
  const {
    webcamStream,
    webcamOn,
    isLocal,
    consumeWebcamStreams,
    stopConsumingWebcamStreams,
  } = useParticipant(participantId);

  useEffect(() => {
    console.log("PauseInvisibleParticipant");
    if (!isLocal) {
      if (isVisible) {
        console.log("resuming participant stream", participantId);
        // typeof webcamStream?.resume === "function" && webcamStream?.resume();
        consumeWebcamStreams();
      } else {
        console.log("pausing participant stream", participantId);
        // typeof webcamStream?.pause === "function" && webcamStream?.pause();
        stopConsumingWebcamStreams();
      }
    }
  }, [isLocal, isVisible]);

  return <></>;
};

const PauseInvisibleParticipants = () => {
  const [visibleParticipantIds, setVisibleParticipantIds] = useState([]);

  const mMeeting = useMeeting();

  const _handleParticipantVisible = ({ participantId }) => {
    console.log("Participant Visible ", participantId);
    setVisibleParticipantIds((s) => [...new Set([...s, participantId])]);
  };

  const _handleParticipantInvisible = ({ participantId }) => {
    console.log("Participant NOT Visible ", participantId);
    setVisibleParticipantIds((s) => s.filter((s) => s !== participantId));
  };

  useEffect(() => {
    eventEmitter.on(appEvents["participant-visible"], ({ participantId }) => {
      console.log("Evevnt Participant Visible");
      _handleParticipantVisible({ participantId });
    });
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
