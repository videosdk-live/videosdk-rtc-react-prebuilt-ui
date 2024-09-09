import {
  useMediaDevice,
  useMeeting,
  useParticipant,
} from "@videosdk.live/react-sdk";
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
  const { getPlaybackDevices } = useMediaDevice({
    onDeviceChanged: () => {
      updateAudioOutput();
    },
  });
  const { selectedSpeaker, setSelectedSpeaker } = useMeetingAppContext();
  const audioPlayer = useRef();

  async function updateAudioOutput() {
    if (audioPlayer.current && micOn && micStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(micStream.track);

      audioPlayer.current.srcObject = mediaStream;

      try {
        await audioPlayer.current.setSinkId(selectedSpeaker.id);
        audioPlayer.current.play().catch((err) => {
          if (
            err.message.includes("user didn't interact with the document first")
          ) {
            console.error("audio error: " + err.message);
          }
        });
      } catch (error) {
        console.log("Error setting sink ID:", error);

        // Fallback: Find and set another available device if the current one is disconnected
        const availableDevices = await getPlaybackDevices();
        const newSpeaker = availableDevices.find(
          (device) => device.deviceId !== selectedSpeaker.id
        );

        if (newSpeaker) {
          setSelectedSpeaker({
            id: newSpeaker.deviceId,
            // label: newSpeaker.label,
          });
        }
      }
    } else {
      audioPlayer.current.srcObject = null;
    }
  }

  useEffect(() => {
    if (!isLocal) {
      consumeMicStreams();
      return () => {
        stopConsumingMicStreams();
      };
    }
  }, []);

  useEffect(() => {
    updateAudioOutput();
  }, [micStream, micOn, isLocal, participantId, selectedSpeaker]);

  useEffect(() => {
    const handleDeviceChange = async () => {
      const availableDevices = await getPlaybackDevices();
      const currentDeviceExists = availableDevices.some(
        (device) => device.deviceId === selectedSpeaker.id
      );

      if (!currentDeviceExists) {
        const newSpeaker = availableDevices;

        if (newSpeaker) {
          setSelectedSpeaker({
            id: newSpeaker.deviceId,
            // label: newSpeaker.label,
          });
        }
      }
    };
    // handleDeviceChange();


    // return () => {
    //   // navigator.mediaDevices.ondevicechange = null;
    // };
  }, []);

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
