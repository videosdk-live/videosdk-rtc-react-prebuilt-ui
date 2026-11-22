import {
  useMeeting,
  useParticipant,
  useAgentParticipant,
} from "@videosdk.live/react-sdk";
import React, { useEffect, useRef } from "react";
import { useMeetingAppContext } from "../../MeetingAppContextDef";
import {
  connectTrackToRelay,
  resumeRelay,
  setRelaySinkId,
  shouldUseAudioRelay,
  teardownRelay,
} from "../../utils/audioOutputRelay";

const HumanParticipantAudioPlayer = ({ participantId }) => {
  const { micOn, micStream, isLocal } = useParticipant(participantId);

  const { selectedOutputDeviceId } = useMeetingAppContext();
  const audioPlayer = useRef();

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
      return connectTrackToRelay(micStream.track);
    } else if (audioPlayer.current) {
      audioPlayer.current.srcObject = null;
    }
  }, [micStream, micOn, isLocal, participantId, selectedOutputDeviceId]);

  return (
    <audio
      autoPlay
      playsInline
      controls={false}
      muted={shouldUseAudioRelay()}
      ref={audioPlayer}
    />
  );
};

const AgentParticipantAudioPlayer = ({ participantId }) => {
  const { micOn, micStream } = useAgentParticipant(participantId);

  const { selectedOutputDeviceId } = useMeetingAppContext();
  const audioPlayer = useRef();

  useEffect(() => {
    if (audioPlayer.current && micOn && micStream) {
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
      return connectTrackToRelay(micStream.track);
    } else if (audioPlayer.current) {
      audioPlayer.current.srcObject = null;
    }
  }, [micStream, micOn, participantId, selectedOutputDeviceId]);

  return (
    <audio
      autoPlay
      playsInline
      controls={false}
      muted={shouldUseAudioRelay()}
      ref={audioPlayer}
    />
  );
};

const ParticipantAudioPlayer = ({ participantId }) => {
  const { participants } = useMeeting();

  const participant = participants.get(participantId);

  return participant?.isAgent ? (
    <AgentParticipantAudioPlayer participantId={participantId} />
  ) : (
    <HumanParticipantAudioPlayer participantId={participantId} />
  );
};

const ParticipantsAudioPlayer = () => {
  const mMeeting = useMeeting();
  const { selectedOutputDeviceId } = useMeetingAppContext();

  const participants = mMeeting?.participants;
  const localMicOn = mMeeting?.localMicOn;
  const localWebcamOn = mMeeting?.localWebcamOn;

  useEffect(() => teardownRelay, []);

  useEffect(() => {
    setRelaySinkId(selectedOutputDeviceId);
  }, [selectedOutputDeviceId]);

  useEffect(() => {
    if (localMicOn || localWebcamOn) resumeRelay();
  }, [localMicOn, localWebcamOn]);

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
