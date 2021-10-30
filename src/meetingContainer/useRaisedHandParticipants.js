import { useEffect, useRef } from "react";
import { useMeetingAppContext } from "../MeetingAppContextDef";

const useRaisedHandParticipants = () => {
  const raisedHandsParticipantsRef = useRef();
  const { raisedHandsParticipants, setRaisedHandsParticipants } =
    useMeetingAppContext();

  const participantRaisedHand = (participantId) => {
    const raisedHandsParticipants = [...raisedHandsParticipantsRef.current];

    const newItem = { participantId, raisedHandOn: new Date().getTime() };

    const participantFound = raisedHandsParticipants.findIndex(
      ({ participantId: pID }) => pID === participantId
    );

    if (participantFound === -1) {
      raisedHandsParticipants.push(newItem);
    } else {
      raisedHandsParticipants[participantFound] = newItem;
    }

    setRaisedHandsParticipants(raisedHandsParticipants);
  };

  useEffect(() => {
    raisedHandsParticipantsRef.current = raisedHandsParticipants;
  }, [raisedHandsParticipants]);

  const _handleRemoveOld = () => {
    const raisedHandsParticipants = [...raisedHandsParticipantsRef.current];

    const now = new Date().getTime();

    const persisted = raisedHandsParticipants.filter(({ raisedHandOn }) => {
      return parseInt(raisedHandOn) + 15000 > parseInt(now);
    });

    if (raisedHandsParticipants.length !== persisted.length) {
      setRaisedHandsParticipants(persisted);
    }
  };

  useEffect(() => {
    const interval = setInterval(_handleRemoveOld, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return { participantRaisedHand };
};

export default useRaisedHandParticipants;
