import { useMeeting } from "@videosdk.live/react-sdk";
import { useEffect, useRef } from "react";
import { useMeetingAppContext } from "../MeetingAppContextDef";

const useWhiteBoard = () => {
  const meetingRef = useRef(null);
  const { setWhiteboardState } = useMeetingAppContext();

  const _handleWhiteboardStarted = (state) => {
    const newState = { started: true, state };

    setWhiteboardState(newState);
  };

  const _handleWhiteboardStopped = () => {
    const newState = { started: false, state: null };

    setWhiteboardState(newState);
  };

  const _handleOnMeetingJoined = () => {
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
    meetingRef.current?.meeting?.off(
      "whiteboard-started",
      _handleWhiteboardStarted
    );

    meetingRef.current?.meeting?.off(
      "whiteboard-stopped",
      _handleWhiteboardStopped
    );
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
