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

| Parameter Name                  | Default Value | description                                                                                 |
| ------------------------------- | ------------- | ------------------------------------------------------------------------------------------- |
| token _`required`_              | -             | meeting token                                                                               |
| micEnabled                      | false         | mic enabled by default                                                                      |
| webcamEnabled                   | false         | webcam enabled by default                                                                   |
| name                            | -             | participant name                                                                            |
| meetingId _`required`_          | -             | meeting id                                                                                  |
| redirectOnLeave                 | -             | URL where user will be redirected, after leaving the meeting                                |
| chatEnabled                     | false         | chat panel visible or not                                                                   |
| screenShareEnabled              | false         | can start screen sharing                                                                    |
| pollEnabled                     | false         | _`coming soon`_                                                                             |
| whiteboardEnabled               | false         | whiteboard button visible or not                                                            |
| participantCanToggleSelfWebcam  | false         | webcam toggle button visible or not                                                         |
| participantCanToggleSelfMic     | false         | mic toggle button visible or not                                                            |
| raiseHandEnabled                | false         | raise hand button visible or not                                                            |
| recordingEnabled                | false         | recording button visible or not                                                             |
| recordingWebhookUrl             | -             | calls webhook after recording completed                                                     |
| recordingAWSDirPath             | -             | dir path of aws s3 bucket where recording will be saved                                     |
| autoStartRecording              | false         | by default start recording on meeting joined                                                |
| participantCanToggleRecording   | false         | can toggle recording                                                                        |
| brandingEnabled                 | false         | branding box visible or not                                                                 |
| brandLogoURL                    | -             | branding logo url                                                                           |
| brandName                       | -             | branch name                                                                                 |
| poweredBy                       | false         | `powered by videosdk.live` text visible or not                                              |
| participantCanLeave             | true          | meeting end button visible or not                                                           |
| liveStreamEnabled               | false         | live stream enabled or not                                                                  |
| autoStartLiveStream             | false         | auto start live stream on meeting join                                                      |
| liveStreamOutputs               | -             | rtml outputs for live streaming the meeting                                                 |
| askJoin                         | false         | ask host to join before joining the meeting                                                 |
| participantCanToggleOtherWebcam | -             | participant can toggle webcam of other participant or not                                   |
| participantCanToggleOtherMic    | -             | participant can toggle mic of other participant or not                                      |
| joinScreenEnabled               | true          | join screen visible or not                                                                  |
| joinScreenMeetingUrl            | false         | url where that meeting will be hosted                                                       |
| joinScreenTitle                 | false         | title of join screen                                                                        |
| notificationSoundEnabled        | false         | whether notification sound audible or not                                                   |
| layout                          | GRID          | `GRID` or `SPOTLIGHT` or `SIDEBAR`                                                          |
| canPin                          | false         | pin other participants                                                                      |
| canEndMeeting                   | false         | participant can end meeting                                                                 |
| canRemoveOtherParticipant       | false         | participant can remove other participant                                                    |
| canDrawOnWhiteboard             | false         | participant can draw on whiteboard, if `false` then whiteboard drawing will be in view mode |
| canToggleWhiteboard             | false         | participant can toggle whiteboard                                                           |
| leftScreenActionButtonLabel     | -             | left screen custom action button label                                                      |
| leftScreenActionButtonHref      | -             | left screen custom action button href                                                       |
| debug                           | false         | enable precise error message                                                                |
| interactionOptional             | false         | do not require interaction before starting the meeting                                      |

---

## For more information on the features, [follow this guide](https://docs.videosdk.live/docs/guide/prebuilt-video-and-audio-calling/getting-started).
