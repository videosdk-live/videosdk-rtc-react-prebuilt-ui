import { createCameraVideoTrack, createMicrophoneAudioTrack, createScreenShareVideoTrack } from "@videosdk.live/react-sdk";
import { useMeetingAppContext } from "../MeetingAppContextDef";
import { Player, Effect, MediaStream, MediaStreamCapture } from "../BanubaSDK"

const useCustomTrack = () => {

  const publicFolderUrl = `${process.env.PUBLIC_URL}/`;
  const { cameraResolution,
    cameraOptimizationMode,
    micQuality,
    screenShareResolution,
    screenShareOptimizationMode } = useMeetingAppContext();
  const getCustomVideoTrack = async (deviceId = undefined, banubaEffectName = undefined) => {
    let track;
    if (!banubaEffectName) {
      track = await createCameraVideoTrack({
        cameraId: deviceId,
        encoderConfig: cameraResolution,
        optimizationMode: cameraOptimizationMode,
      }).catch((error) => {
        console.log("Unable to create custom video Track", error);
      })
    }
    if (banubaEffectName) {
      let videoTrack = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      const banubaTrack = await Player
        .create({
          clientToken: process.env.REACT_APP_BANUBA_TOKEN,
          /**
           * By default BanubaSDK.js tries to loads BanubaSDK.wasm and BanubaSDK.data files relative to itself.
           * Since the BanubaSDK.js will be bundled to something like `static/js/[name].[hash].js` during a build
           * and the BanubaSDK.wasm and BanubaSDK.data files may not lay next to the bundle file
           * we have to tell the BanubaSDK where it can find these BanubaSDK.wasm and BanubaSDK.data files.
           * @see {@link https://docs.banuba.com/generated/typedoc/globals.html#sdkoptions} further information}
           */
          locateFile: {
            "BanubaSDK.wasm": publicFolderUrl + "webar/BanubaSDK.wasm",
            "BanubaSDK.smid.wasm": publicFolderUrl + "webar/BanubaSDK.smid.wasm",
            "BanubaSDK.data": publicFolderUrl + "webar/BanubaSDK.data",
          },
        })
        .then(async (player) => {

          const webar = new MediaStreamCapture(player)
          player.use(new MediaStream(videoTrack))
          player.applyEffect(new Effect(publicFolderUrl + `webar/${banubaEffectName}.zip`))
          player.play()
          return webar;
        })
      track = banubaTrack.getVideoTrack();
      track.encoderConfig = cameraResolution;
    }
    return track;
  }

  const getCustomScreenShareTrack = async (deviceId = undefined) => {
    const track = await createScreenShareVideoTrack({
      encoderConfig: screenShareResolution,
      optimizationMode: screenShareOptimizationMode,
    }).catch((error) => {
      console.log("Unable to create custom screen share Track", error);
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