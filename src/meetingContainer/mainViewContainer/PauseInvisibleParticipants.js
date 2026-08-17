import {
  useMeeting,
  useParticipant,
  useAgentParticipant,
} from "@videosdk.live/react-sdk";
import { useEffect, useState } from "react";
import { appEvents, eventEmitter } from "../../utils/common";

const PauseInvisibleParticipant = ({ participantId, isVisible }) => {
  const mMeeting = useMeeting();

  const isAgent = mMeeting?.participants?.get(participantId)?.isAgent === true;

  if (isAgent) {
    return (
      <AgentPauseInvisibleParticipant
        participantId={participantId}
        isVisible={isVisible}
      />
    );
  }

  return (
    <HumanPauseInvisibleParticipant
      participantId={participantId}
      isVisible={isVisible}
    />
  );
};

const HumanPauseInvisibleParticipant = ({ participantId, isVisible }) => {
  const {
    webcamStream,
    webcamOn,
    isLocal,
    consumeWebcamStreams,
    stopConsumingWebcamStreams,
  } = useParticipant(participantId);

  useEffect(() => {
    if (typeof isVisible === "string") {
      if (!isLocal) {
        (async () => {
          try {
            if (isVisible) {
              await consumeWebcamStreams();
            } else {
              await stopConsumingWebcamStreams();
            }
          } catch (e) {
            console.log("Error toggling webcam stream consumption", e);
          }
        })();
      }
    }
  }, [isLocal, isVisible]);

  return <></>;
};

const AgentPauseInvisibleParticipant = ({ participantId, isVisible }) => {
  const { consumeWebcamStreams, stopConsumingWebcamStreams } =
    useAgentParticipant(participantId);

  useEffect(() => {
    if (typeof isVisible === "string") {
      (async () => {
        try {
          if (isVisible) {
            await consumeWebcamStreams?.();
          } else {
            await stopConsumingWebcamStreams?.();
          }
        } catch (e) {
          console.log("Error toggling agent webcam stream consumption", e);
        }
      })();
    }
  }, [isVisible]);

  return <></>;
};

const PauseInvisibleParticipants = () => {
  const [visibleParticipantIds, setVisibleParticipantIds] = useState([]);

  const mMeeting = useMeeting();

  const _handleParticipantVisible = ({ participantId }) => {
    // console.log("Participant Visible ", participantId);
    setVisibleParticipantIds((s) => [...new Set([...s, participantId])]);
  };

  const _handleParticipantInvisible = ({ participantId }) => {
    // console.log("Participant NOT Visible ", participantId);
    setVisibleParticipantIds((s) => s.filter((s) => s !== participantId));
  };

  useEffect(() => {
    eventEmitter.on(appEvents["participant-visible"], ({ participantId }) => {
      // console.log("Evevnt Participant Visible");
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

  const participantIds = mMeeting?.participants
    ? [...mMeeting.participants.keys()]
    : [];

  return (
    <>
      {participantIds.map((participantId) => (
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
