import { useMeeting, useParticipant } from "@videosdk.live/react-sdk";
import React, { useEffect, useRef } from "react";
import { useMeetingAppContext } from "../../MeetingAppContextDef";

const ParticipantAudioPlayer = ({ participantId }) => {
  const {
    micOn,
    micStream,
    isLocal,
    consumeMicStreams,
    stopConsumingMicStreams,
  } = useParticipant(participantId);

  const { selectedOutputDeviceId } = useMeetingAppContext();
  const audioPlayer = useRef();

  useEffect(() => {
    if (!isLocal) {
      consumeMicStreams();
      return () => {
        stopConsumingMicStreams();
      };
    }
  }, []);

  useEffect(() => {
    if (!isLocal && audioPlayer.current && micOn && micStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(micStream.track);

      audioPlayer.current.srcObject = mediaStream;
      try {
        audioPlayer.current.setSinkId(selectedOutputDeviceId);
      } catch (error) {
        console.log("error", error);
      }
      audioPlayer.current.play().catch((err) => {
        if (
          err.message ===
          "play() failed because the user didn't interact with the document first. https://goo.gl/xX8pDD"
        ) {
          console.error("audio" + err.message);
        }
      });
    } else {
      audioPlayer.current.srcObject = null;
    }
  }, [micStream, micOn, isLocal, participantId, selectedOutputDeviceId]);

  return <audio autoPlay playsInline controls={false} ref={audioPlayer} />;
};

const ParticipantsAudioPlayer = () => {
  const mMeeting = useMeeting();

  const participants = mMeeting?.participants;

  return participants ? (
    [...participants.keys()].map((participantId) => (
      <ParticipantAudioPlayer
        key={`participant_audio_${participantId}`}
        participantId={participantId}
      />
    ))
  ) : (
    <></>
  );
};

export default ParticipantsAudioPlayer;
