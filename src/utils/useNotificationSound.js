import { useCallback, useRef } from "react";

export function useNotificationSound(url) {
  const audioRef = useRef(null);
  const isPlayingRef = useRef(false);

  return useCallback(() => {
    if (isPlayingRef.current) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(url);
    }
    isPlayingRef.current = true;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {
      isPlayingRef.current = false;
    });
    audioRef.current.onended = () => {
      isPlayingRef.current = false;
    };
  }, [url]);
}
