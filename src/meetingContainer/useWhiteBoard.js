import { useMeeting } from "@videosdk.live/react-sdk";
import { useEffect, useRef } from "react";
import { useMeetingAppContext } from "../MeetingAppContextDef";

const useWhiteBoard = () => {
  const mMmeeting = useMeeting();

  const { setWhiteboardState } = useMeetingAppContext();

  const setWhiteboardStateRef = useRef();

  useEffect(() => {
    setWhiteboardStateRef.current = setWhiteboardState;
  }, [setWhiteboardState]);

  const _handleWhiteboardStarted = (state) => {
    if (setWhiteboardStateRef.current.started !== true) {
      const newState = { started: true, state };

      setWhiteboardStateRef.current = newState;
      setWhiteboardState(newState);
    }
  };

  const _handleWhiteboardStopped = () => {
    if (setWhiteboardStateRef.current.started === true) {
      const newState = { started: false, state: null };

      setWhiteboardStateRef.current = newState;
      setWhiteboardState(newState);
    }
  };

  useEffect(() => {
    if (mMmeeting?.meeting) {
      mMmeeting?.meeting?.on("whiteboard-started", _handleWhiteboardStarted);
      mMmeeting?.meeting?.on("whiteboard-stopped", _handleWhiteboardStopped);

      // return () => {
      //   mMmeeting?.meeting?.off("whiteboard-started", _handleWhiteboardStarted);
      //   mMmeeting?.meeting?.off("whiteboard-stopped", _handleWhiteboardStopped);
      // };
    }
  }, [mMmeeting]);
};

export default useWhiteBoard;
