import {
  createCameraVideoTrack,
  createMicrophoneAudioTrack,
  createScreenShareVideoTrack,
} from "@videosdk.live/react-sdk";
import { useMeetingAppContext } from "../MeetingAppContextDef";

// Unified track factory.
// - Explicit call-site params win.
// - Falls back to values held in MeetingAppContext (set from query params in App.js).
// - Falls back again to hardcoded SDK-safe defaults when neither is available (e.g. JoinScreen renders outside MeetingAppProvider).
const useMediaStream = () => {
  const ctx = useMeetingAppContext() || {};
  const {
    cameraResolution,
    cameraOptimizationMode,
    cameraMultiStream,
    cameraBitrateMode,
    cameraMaxLayer,
    cameraCodec,
    micQuality,
    micNoiseConfig,
    screenShareResolution,
    screenShareOptimizationMode,
    screenShareWithAudio,
    screenShareMultiStream,
  } = ctx;

  const getVideoTrack = async ({
    webcamId,
    encoderConfig,
    optimizationMode,
    multiStream,
    bitrateMode,
    maxLayer,
    codec,
  } = {}) => {
    try {
      const resolvedMultiStream =
        typeof multiStream === "boolean"
          ? multiStream
          : typeof cameraMultiStream === "boolean"
            ? cameraMultiStream
            : false;
      const resolvedMaxLayer =
        maxLayer === 2 || maxLayer === 3
          ? maxLayer
          : cameraMaxLayer === 2 || cameraMaxLayer === 3
            ? cameraMaxLayer
            : 3;

      return await createCameraVideoTrack({
        cameraId: webcamId,
        encoderConfig: encoderConfig || cameraResolution || "h540p_w960p",
        optimizationMode:
          optimizationMode || cameraOptimizationMode || "motion",
        multiStream: resolvedMultiStream,
        bitrateMode: bitrateMode || cameraBitrateMode || "balanced",
        maxLayer: resolvedMaxLayer,
        codec: codec || cameraCodec || "VP8",
      });
    } catch (error) {
      console.log("Unable to create camera video track", error);
      return null;
    }
  };

  const getAudioTrack = async ({ micId, encoderConfig, noiseConfig } = {}) => {
    try {
      const resolvedNoiseConfig = noiseConfig || micNoiseConfig;
      return await createMicrophoneAudioTrack({
        microphoneId: micId,
        encoderConfig: encoderConfig || micQuality || "speech_standard",
        noiseConfig: {
          echoCancellation:
            typeof resolvedNoiseConfig?.echoCancellation === "boolean"
              ? resolvedNoiseConfig.echoCancellation
              : true,
          autoGainControl:
            typeof resolvedNoiseConfig?.autoGainControl === "boolean"
              ? resolvedNoiseConfig.autoGainControl
              : true,
          noiseSuppression:
            typeof resolvedNoiseConfig?.noiseSuppression === "boolean"
              ? resolvedNoiseConfig.noiseSuppression
              : true,
        },
      });
    } catch (error) {
      console.log("Unable to create microphone audio track", error);
      return null;
    }
  };

  const getScreenShareTrack = async ({
    encoderConfig,
    optimizationMode,
    withAudio,
    multiStream,
  } = {}) => {
    try {
      const resolvedMultiStream =
        typeof multiStream === "boolean"
          ? multiStream
          : typeof screenShareMultiStream === "boolean"
            ? screenShareMultiStream
            : false;
      return await createScreenShareVideoTrack({
        encoderConfig: encoderConfig || screenShareResolution,
        optimizationMode: optimizationMode || screenShareOptimizationMode,
        withAudio: withAudio || screenShareWithAudio || "disable",
        multiStream: resolvedMultiStream,
      });
    } catch (error) {
      console.log("Unable to create screen share track", error);
      return null;
    }
  };

  return { getVideoTrack, getAudioTrack, getScreenShareTrack };
};

export default useMediaStream;
