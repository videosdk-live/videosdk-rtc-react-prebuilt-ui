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

3. Copy .env.example as .env

4. Update the REACT_APP_BANUBA_TOKEN with your Banuba Token

5. Run the app

   ```sh
   npm run start
   ```

Now your app will be running on http://localhost:3000, to customize the default options pass url parameters where app is running.

Example Url with parameters: http://localhost:3000?token=replaceWithYourMeetingToken&meetingId=yourMeetingId&webcamEnabled=true&micEnabled=true

---

## URL Parameters

| Parameter Name                  | Default Value    | Description                                                                                 |
| ------------------------------- | ---------------- | ------------------------------------------------------------------------------------------- |
| token*`required`*               | -                | meeting token                                                                               |
| micEnabled                      | false            | mic enabled by default                                                                      |
| webcamEnabled                   | false            | webcam enabled by default                                                                   |
| name                            | -                | participant name                                                                            |
| meetingId _`required`_          | -                | meeting id                                                                                  |
| region                          | "sg001"          | meeting region                                                                              |
| redirectOnLeave                 | -                | URL where user will be redirected, after leaving the meeting                                |
| chatEnabled                     | false            | chat panel visible or not                                                                   |
| screenShareEnabled              | false            | can start screen sharing                                                                    |
| pollEnabled                     | false            | _`coming soon`_                                                                             |
| whiteboardEnabled               | false            | whiteboard button visible or not                                                            |
| raiseHandEnabled                | false            | raise hand button visible or not                                                            |
| participantCanToggleSelfWebcam  | false            | webcam toggle button visible or not                                                         |
| participantCanToggleSelfMic     | false            | mic toggle button visible or not                                                            |
| participantCanToggleRecording   | false            | can toggle recording                                                                        |
| participantCanLeave             | true             | meeting end button visible or not                                                           |
| participantCanToggleOtherWebcam | -                | participant can toggle webcam of other participant or not                                   |
| participantCanToggleOtherMic    | -                | participant can toggle mic of other participant or not                                      |
| participantCanToggleLivestream  | todo             | todo                                                                                        |
| participantCanEndMeeting        | false            | participant can end meeting                                                                 |
| recordingEnabled                | false            | recording button visible or not                                                             |
| recordingWebhookUrl             | -                | calls webhook after recording completed                                                     |
| recordingAWSDirPath             | -                | dir path of aws s3 bucket where recording will be saved                                     |
| autoStartRecording              | false            | by default start recording on meeting joined                                                |
| brandingEnabled                 | false            | branding box visible or not                                                                 |
| brandLogoURL                    | -                | branding logo url                                                                           |
| brandName                       | -                | branch name                                                                                 |
| poweredBy                       | false            | `powered by videosdk.live` text visible or not                                              |
| liveStreamEnabled               | false            | live stream enabled or not                                                                  |
| autoStartLiveStream             | false            | auto start live stream on meeting join                                                      |
| liveStreamOutputs               | -                | rtml outputs for live streaming the meeting                                                 |
| askJoin                         | false            | ask host to join before joining the meeting                                                 |
| joinScreenEnabled               | true             | join screen visible or not                                                                  |
| joinScreenMeetingUrl            | false            | url where that meeting will be hosted                                                       |
| joinScreenTitle                 | false            | title of join screen                                                                        |
| notificationSoundEnabled        | false            | whether notification sound audible or not                                                   |
| canPin                          | false            | pin other participants                                                                      |
| canRemoveOtherParticipant       | false            | participant can remove other participant                                                    |
| canDrawOnWhiteboard             | false            | participant can draw on whiteboard, if `false` then whiteboard drawing will be in view mode |
| canToggleWhiteboard             | false            | participant can toggle whiteboard                                                           |
| leftScreenActionButtonLabel     | -                | left screen custom action button label                                                      |
| leftScreenActionButtonHref      | -                | left screen custom action button href                                                       |
| leftScreenRejoinButtonEnabled   | -                | -                                                                                           |
| maxResolution                   | `sd`             | -                                                                                           |
| animationsEnabled               | true             | -                                                                                           |
| topbarEnabled                   | true             | -                                                                                           |
| notificationAlertsEnabled       | true             | -                                                                                           |
| debug                           | false            | enable precise error message                                                                |
| participantId                   | -                | if of the participant who will jooin the meeting, if not provided it will generate one      |
| layoutType                      | GRID             | `GRID` or `SPOTLIGHT` or `SIDEBAR`                                                          |
| layoutGridSize                  | -                | Maximum number of participants to be displayed on meeting layout                            |
| layoutPriority                  | `SPEAKER`        | `SPEAKER` or `PIN`                                                                          |
| meetingLayoutTopic              | `MEETING_LAYOUT` | `MEETING_LAYOUT` or `RECORDING_LAYOUT` or `LIVE_STREAM_LAYOUT` or `HLS_LAYOUT` or           |
| isRecorder                      | false            | -                                                                                           |
| hideLocalParticipant            | false            | will hide localParticipant from layout                                                      |
| alwaysShowOverlay               | false            | -                                                                                           |
| sideStackSize                   | -                | -                                                                                           |
| reduceEdgeSpacing               | false            | -                                                                                           |
| joinWithoutUserInteraction      | false            | do not require interaction before starting the meeting                                      |
| rawUserAgent                    | -                | -                                                                                           |
| canChangeLayout                 | `false`          | can change meeting layout                                                                   |
| preferredProtocol               | `UDP_ONLY`       | `UDP_ONLY` or `UDP_ONLY`                                                                    |

---

## For more information on the features, [follow this guide](https://docs.videosdk.live/docs/guide/prebuilt-video-and-audio-calling/getting-started).
