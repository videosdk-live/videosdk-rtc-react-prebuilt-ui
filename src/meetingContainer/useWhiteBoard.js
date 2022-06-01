import { useMeeting } from "@videosdk.live/react-sdk";
import { useEffect, useRef } from "react";
import { useMeetingAppContext } from "../MeetingAppContextDef";

const useWhiteBoard = () => {
  const meetingRef = useRef(null);
  const { setWhiteboardState, whiteboardEnabled, whiteboardState } =
    useMeetingAppContext();

  const _handleWhiteboardStarted = (state) => {
    const newState = {
      started: true,
      state: state === undefined ? null : state,
    };
    setWhiteboardState(newState);
    console.log("- from _handleWhiteboardStarted : ", whiteboardState);
  };

  const _handleWhiteboardStopped = () => {
    const newState = { started: false, state: null };
    setWhiteboardState(newState);
  };

  const _handleOnMeetingJoined = () => {
    if (whiteboardEnabled) {
      _handleWhiteboardStarted();
    }

    meetingRef.current?.meeting?.on(
      "whiteboard-started",
      _handleWhiteboardStarted
    );

    meetingRef.current?.meeting?.on(
      "whiteboard-stopped",
      _handleWhiteboardStopped
    );
  };
  const _handleOnMeetingLeft = () => {
    // meetingRef.current?.meeting?.off(
    //   "whiteboard-started",
    //   _handleWhiteboardStarted
    // );
    // meetingRef.current?.meeting?.off(
    //   "whiteboard-stopped",
    //   _handleWhiteboardStopped
    // );
  };
  const mMmeeting = useMeeting({
    onMeetingJoined: _handleOnMeetingJoined,
    onMeetingLeft: _handleOnMeetingLeft,
  });

  useEffect(() => {
    meetingRef.current = mMmeeting;
  }, [mMmeeting]);
};

export default useWhiteBoard;
