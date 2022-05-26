import { createCameraVideoTrack, createMicrophoneAudioTrack, createScreenShareVideoTrack } from "@videosdk.live/react-sdk";
import { useMeetingAppContext } from "../MeetingAppContextDef";

const useCustomTrack = () => {
  const { cameraResolution,
    cameraOptimizationMode,
    micQuality,
    screenShareResolution,
    screenShareOptimizationMode } = useMeetingAppContext();

  const getCustomVideoTrack = async (deviceId = undefined) => {
    const track = await createCameraVideoTrack({
      cameraId: deviceId,
      encoderConfig: cameraResolution,
      optimizationMode: cameraOptimizationMode,
    }).catch((error) => {
      console.log("Unable to create custom video Track", error);
    })
    console.log("Settings", track.getSettings())
    return track;
  }

  const getCustomScreenShareTrack = async (deviceId = undefined) => {
    const track = await createScreenShareVideoTrack({
      encoderConfig: screenShareResolution,
      optimizationMode: screenShareOptimizationMode,
    }).catch((error) => {
      console.log("Unable to create custom video Track", error);
    })
    return track;
  }

  const getCustomAudioTrack = async (deviceId = undefined) => {
    const track = await createMicrophoneAudioTrack({
      microphoneId: deviceId,
      encoderConfig: micQuality,
    }).catch((error) => {
      console.log("Unable to create custom microphone Track", error);
    })
    return track;
  }

  return { getCustomVideoTrack, getCustomAudioTrack, getCustomScreenShareTrack };
}

export default useCustomTrack;