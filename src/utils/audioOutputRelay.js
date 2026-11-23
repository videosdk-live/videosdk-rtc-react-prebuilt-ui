// On iOS/iPadOS, HTMLMediaElement.setSinkId() is silently ignored for elements
// playing remote WebRTC tracks: WebKit renders that audio through the WebRTC
// engine's pipeline, which setSinkId does not control. Mixing all remote tracks
// into a MediaStreamAudioDestinationNode and playing the mix through a single
// relay <audio> element moves playback onto the media-element pipeline, where
// setSinkId works.
//
// iOS Safari also starts a MediaStream <audio> without a recent tap only while
// the page is capturing (mic/camera on) or already playing audio. The relay
// plays silence for the whole meeting and is first played inside the
// Join/Rejoin tap, which unlocks it, so remote audio keeps starting with the
// local mic and camera off (same approach as LiveKit's silent audio element).
// On iOS without setSinkId the relay carries only that silence.

const isIOSDevice =
  typeof navigator !== "undefined" &&
  (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (/Mac/.test(navigator.userAgent) && navigator.maxTouchPoints > 1));

export function shouldUseAudioRelay() {
  return (
    isIOSDevice && typeof HTMLMediaElement.prototype.setSinkId === "function"
  );
}

let audioContext = null;
let destinationNode = null;
let relayElement = null;
const connectedTracks = new Map();

// Elements whose play() the browser refused for lack of a user gesture.
const blockedElements = new Set();
const statusListeners = new Set();
let canPlaybackAudio = true;

function refreshPlaybackStatus() {
  const next = blockedElements.size === 0;
  if (next === canPlaybackAudio) return;
  canPlaybackAudio = next;
  statusListeners.forEach((listener) => listener());
}

export function getCanPlaybackAudio() {
  return canPlaybackAudio;
}

// Matches React's useSyncExternalStore(subscribe, getSnapshot).
export function subscribeAudioPlaybackStatus(listener) {
  statusListeners.add(listener);
  return () => {
    statusListeners.delete(listener);
  };
}

// play() that remembers refused elements so the next tap can retry them.
export function playAudioElement(el) {
  return el.play().then(
    () => {
      if (blockedElements.delete(el)) refreshPlaybackStatus();
    },
    (err) => {
      // Other errors (e.g. AbortError) mean a newer srcObject replaced it.
      if (err?.name !== "NotAllowedError" || !el.srcObject || !el.isConnected) {
        return;
      }
      blockedElements.add(el);
      refreshPlaybackStatus();
    }
  );
}

export function forgetAudioElement(el) {
  if (el && blockedElements.delete(el)) refreshPlaybackStatus();
}

function resumeAudio() {
  if (audioContext && audioContext.state !== "running") {
    audioContext.resume().catch(() => {});
  }
  if (relayElement?.paused) playAudioElement(relayElement);
  [...blockedElements].forEach((el) => {
    if (el !== relayElement) playAudioElement(el);
  });
}

function handleVisibilityChange() {
  if (document.visibilityState === "visible") resumeAudio();
}

function ensureRelay() {
  if (audioContext) return;
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  destinationNode = audioContext.createMediaStreamDestination();
  relayElement = document.createElement("audio");
  relayElement.autoplay = true;
  relayElement.playsInline = true;
  relayElement.style.display = "none";
  relayElement.srcObject = destinationNode.stream;
  document.body.appendChild(relayElement);

  // Always-running silent input: keeps the relay "playing audio" between remote
  // tracks, and without it iOS plays stale audio after the last remote leaves.
  const silence = audioContext.createConstantSource();
  silence.offset.value = 0;
  silence.connect(destinationNode);
  silence.start();

  // iOS suspends the context and pauses media after interruptions (calls,
  // route changes, backgrounding); revive both on any tap and on return.
  document.addEventListener("touchend", resumeAudio, {
    capture: true,
    passive: true,
  });
  document.addEventListener("click", resumeAudio, {
    capture: true,
    passive: true,
  });
  document.addEventListener("visibilitychange", handleVisibilityChange);
}

// Call synchronously inside a tap (Join, Rejoin, "Enable audio") so iOS unlocks
// the relay, or while capturing; also retries refused elements.
export function startAudio() {
  if (isIOSDevice) ensureRelay();
  resumeAudio();
}

export function connectTrackToRelay(track) {
  if (!shouldUseAudioRelay() || !track) return () => {};
  ensureRelay();
  let entry = connectedTracks.get(track);
  if (!entry) {
    const sourceNode = audioContext.createMediaStreamSource(
      new MediaStream([track])
    );
    sourceNode.connect(destinationNode);
    entry = { sourceNode, refCount: 0 };
    connectedTracks.set(track, entry);
  }
  entry.refCount += 1;
  resumeAudio();
  return () => {
    const current = connectedTracks.get(track);
    if (!current) return;
    current.refCount -= 1;
    if (current.refCount <= 0) {
      current.sourceNode.disconnect();
      connectedTracks.delete(track);
    }
  };
}

export function setRelaySinkId(deviceId) {
  if (!shouldUseAudioRelay() || deviceId == null) return;
  ensureRelay();
  resumeAudio();
  relayElement.setSinkId(deviceId).catch((err) => {
    console.error("Setting relay speaker device failed", err);
  });
}

export function teardownAudio() {
  if (!audioContext) return;
  forgetAudioElement(relayElement);
  document.removeEventListener("touchend", resumeAudio, { capture: true });
  document.removeEventListener("click", resumeAudio, { capture: true });
  document.removeEventListener("visibilitychange", handleVisibilityChange);
  connectedTracks.forEach(({ sourceNode }) => sourceNode.disconnect());
  connectedTracks.clear();
  relayElement.pause();
  relayElement.srcObject = null;
  relayElement.remove();
  relayElement = null;
  destinationNode = null;
  audioContext.close().catch(() => {});
  audioContext = null;
}
