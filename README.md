# VideoSDK RTC React Prebuilt UI

## Features

- Join Screen
- Camera Controls
- Mic Controls
- Host Controls
- Redirect on Leave
- Share Your Screen
- Send Messages
- Record Meeting
- Go Live On Social Media
- Customize Branding
- Customize Permissions
- Pin Participants
- Layouts
- Whiteboard

---

## Getting Started

1. Clone the repo

   ```sh
   git clone https://github.com/videosdk-live/videosdk-rtc-react-prebuilt-ui.git
   cd videosdk-rtc-react-prebuilt-ui
   ```

2. Install NPM packages

   ```sh
   npm install
   ```

3. Run the app

   ```sh
   npm run start
   ```

Now your app will be running on http://localhost:3000, to customize the default options pass url parameters where app is running.

Example Url with parameters: http://localhost:3000?token=replaceWithYourMeetingToken&meetingId=yourMeetingId&webcamEnabled=true&micEnabled=true

---

## URL Parameters

| Parameter Name                            | Default Value    | Description                                                                                 |
| ----------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------- |
| token*`required`*                         | -                | meeting token                                                                               |
| micEnabled                                | false            | mic enabled by default                                                                      |
| webcamEnabled                             | false            | webcam enabled by default                                                                   |
| name                                      | -                | participant name                                                                            |
| meetingId _`required`_                    | -                | meeting id                                                                                  |
| region                                    | "sg001"          | meeting region                                                                              |
| redirectOnLeave                           | -                | URL where user will be redirected, after leaving the meeting                                |
| chatEnabled                               | false            | chat panel visible or not                                                                   |
| screenShareEnabled                        | false            | can start screen sharing                                                                    |
| pollEnabled                               | false            | _`coming soon`_                                                                             |
| whiteboardEnabled                         | false            | whiteboard button visible or not                                                            |
| raiseHandEnabled                          | false            | raise hand button visible or not                                                            |
| participantCanToggleSelfWebcam            | false            | webcam toggle button visible or not                                                         |
| participantCanToggleSelfMic               | false            | mic toggle button visible or not                                                            |
| participantCanToggleRecording             | false            | can toggle recording                                                                        |
| participantCanLeave                       | true             | meeting end button visible or not                                                           |
| participantCanToggleOtherWebcam           | -                | participant can toggle webcam of other participant or not                                   |
| participantCanToggleOtherMic              | -                | participant can toggle mic of other participant or not                                      |
| participantCanToggleLivestream            | todo             | todo                                                                                        |
| participantCanEndMeeting                  | false            | participant can end meeting                                                                 |
| participantCanToggleRealtimeTranscription | false            | participant can toggle realtime transcription button or not                                 |
| realtimeTranscriptionEnabled              | false            | realtime transcription button visible or not                                                |
| realtimeTranscriptionVisible              | false            | realtime transcription visble or not                                                        |
| recordingEnabled                          | false            | recording button visible or not                                                             |
| recordingWebhookUrl                       | -                | calls webhook after recording completed                                                     |
| recordingAWSDirPath                       | -                | dir path of aws s3 bucket where recording will be saved                                     |
| autoStartRecording                        | false            | by default start recording on meeting joined                                                |
| brandingEnabled                           | false            | branding box visible or not                                                                 |
| brandLogoURL                              | -                | branding logo url                                                                           |
| brandName                                 | -                | branch name                                                                                 |
| poweredBy                                 | false            | `powered by videosdk.live` text visible or not                                              |
| liveStreamEnabled                         | false            | live stream enabled or not                                                                  |
| autoStartLiveStream                       | false            | auto start live stream on meeting join                                                      |
| liveStreamOutputs                         | -                | rtml outputs for live streaming the meeting                                                 |
| askJoin                                   | false            | ask host to join before joining the meeting                                                 |
| joinScreenEnabled                         | true             | join screen visible or not                                                                  |
| joinScreenMeetingUrl                      | false            | url where that meeting will be hosted                                                       |
| joinScreenTitle                           | false            | title of join screen                                                                        |
| notificationSoundEnabled                  | false            | whether notification sound audible or not                                                   |
| canPin                                    | false            | pin other participants                                                                      |
| canRemoveOtherParticipant                 | false            | participant can remove other participant                                                    |
| canDrawOnWhiteboard                       | false            | participant can draw on whiteboard, if `false` then whiteboard drawing will be in view mode |
| canToggleWhiteboard                       | false            | participant can toggle whiteboard                                                           |
| leftScreenActionButtonLabel               | -                | left screen custom action button label                                                      |
| leftScreenActionButtonHref                | -                | left screen custom action button href                                                       |
| leftScreenRejoinButtonEnabled             | -                | -                                                                                           |
| maxResolution                             | `sd`             | -                                                                                           |
| animationsEnabled                         | true             | -                                                                                           |
| topbarEnabled                             | true             | -                                                                                           |
| notificationAlertsEnabled                 | true             | -                                                                                           |
| debug                                     | false            | enable precise error message                                                                |
| participantId                             | -                | if of the participant who will jooin the meeting, if not provided it will generate one      |
| layoutType                                | GRID             | `GRID` or `SPOTLIGHT` or `SIDEBAR`                                                          |
| layoutGridSize                            | -                | Maximum number of participants to be displayed on meeting layout                            |
| layoutPriority                            | `SPEAKER`        | `SPEAKER` or `PIN`                                                                          |
| meetingLayoutTopic                        | `MEETING_LAYOUT` | `MEETING_LAYOUT` or `RECORDING_LAYOUT` or `LIVE_STREAM_LAYOUT` or `HLS_LAYOUT` or           |
| isRecorder                                | false            | -                                                                                           |
| hideLocalParticipant                      | false            | will hide localParticipant from layout                                                      |
| alwaysShowOverlay                         | false            | -                                                                                           |
| sideStackSize                             | -                | -                                                                                           |
| reduceEdgeSpacing                         | false            | -                                                                                           |
| joinWithoutUserInteraction                | false            | do not require interaction before starting the meeting                                      |
| rawUserAgent                              | -                | -                                                                                           |
| canChangeLayout                           | `false`          | can change meeting layout                                                                   |
| preferredProtocol                         | `UDP_ONLY`       | `UDP_ONLY` or `UDP_ONLY`                                                                    |
| theme                                     | `DEFAULT`        | meeting UI theme — `DEFAULT`, `DARK`, or `LIGHT`                                            |
| language                                  | `en`             | UI language code (i18n locale)                                                              |
| mode                                      | `SEND_AND_RECV`  | participant mode — `SEND_AND_RECV`, `SIGNALLING_ONLY`, or `RECV_ONLY`                       |
| participantTabPanelEnabled                | `true`           | show the participant tab panel                                                              |
| moreOptionsEnabled                        | `true`           | show the More Options button                                                                |
| participantCanToggleOtherMode             | `false`          | can toggle another participant's mode                                                       |
| partcipantCanToogleOtherScreenShare       | `false`          | can toggle another participant's screen share (kept spelling for backward compat)           |
| participantCanToggleHls                   | `false`          | can start/stop HLS                                                                          |
| participantNotificationAlertsEnabled      | `true`           | show participant join/leave notification alerts                                             |
| canToggleVirtualBackground                | `false`          | show the virtual background toggle                                                          |
| canCreatePoll                             | `false`          | can create polls                                                                            |
| canToggleParticipantTab                   | `true`           | can toggle the participant tab                                                              |
| hlsEnabled                                | `false`          | expose HLS controls in the UI                                                               |
| autoStartHls                              | `false`          | automatically start HLS on meeting join                                                     |
| hlsPlayerControlsVisible                  | `false`          | show player controls on the HLS viewer                                                      |
| hlsTheme                                  | `DEFAULT`        | HLS layout theme — `DEFAULT`, `DARK`, or `LIGHT`                                            |
| recordingTheme                            | `DEFAULT`        | recording layout theme — `DEFAULT`, `DARK`, or `LIGHT`                                      |
| liveStreamTheme                           | `DEFAULT`        | live stream layout theme — `DEFAULT`, `DARK`, or `LIGHT`                                    |
| waitingScreenImageUrl                     | -                | image / Lottie URL shown on the waiting screen                                              |
| waitingScreenText                         | -                | text shown on the waiting screen                                                            |
| maintainVideoAspectRatio                  | `false`          | keep aspect ratio of portrait webcam streams                                                |
| maintainLandscapeVideoAspectRatio         | `false`          | keep aspect ratio of landscape webcam streams                                               |
| networkBarEnabled                         | `true`           | show the network-quality bar on participant tiles                                           |
| cameraId                                  | -                | device id of the camera to use when joining                                                 |
| cameraResolution                          | `h360p_w640p`    | camera capture resolution                                                                   |
| cameraMultiStream                         | `true`           | publish multiple simulcast layers for the camera stream                                     |
| cameraOptimizationMode                    | `motion`         | camera stream optimization — `motion`, `text`, or `detail`                                  |
| screenShareResolution                     | `h720p_15fps`    | screen share capture resolution                                                             |
| screenShareOptimizationMode               | `motion`         | screen share optimization — `motion`, `text`, or `detail`                                   |
| micQuality                                | `speech_standard`| mic audio quality — `speech_low_quality`, `speech_standard`, or `high_quality`              |
| cameraBitrateMode                         | `balanced`       | camera bitrate strategy — `balanced`, `high_quality`, or `bandwidth_optimized`              |
| cameraMaxLayer                            | `3`              | max simulcast layers for the camera stream — `2` or `3`                                     |
| cameraCodec                               | `VP8`            | video codec for the camera stream — `VP8`, `VP9`, `AV1`, or `H264`                          |
| screenShareWithAudio                      | `disable`        | capture system/tab audio during screen share — `enable` or `disable`                        |
| screenShareMultiStream                    | `false`          | publish multi-layer screen share stream                                                     |
| micEchoCancellation                       | `true`           | enable browser echo cancellation on the mic                                                 |
| micAutoGainControl                        | `true`           | enable browser auto gain control on the mic                                                 |
| micNoiseSuppression                       | `true`           | enable browser noise suppression on the mic                                                 |
| verbose                                   | `NONE`           | SDK log level — `DEBUG`, `INFO`, `WARN`, `ERROR`, `ALL`, or `NONE`                          |

---

## For more information on the features, [follow this guide](https://docs.videosdk.live/docs/guide/prebuilt-video-and-audio-calling/getting-started).
