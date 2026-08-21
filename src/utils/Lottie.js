import LottieReact from "lottie-react";

// Compat shim: preserves the `react-lottie` API (options, height, width,
// eventListeners) while delegating to `lottie-react` under the hood.
const REACT_LOTTIE_EVENT_MAP = {
  complete: "onComplete",
  done: "onComplete",
  loopComplete: "onLoopComplete",
  enterFrame: "onEnterFrame",
  segmentStart: "onSegmentStart",
  DOMLoaded: "onDOMLoaded",
  dataReady: "onDataReady",
  dataFailed: "onDataFailed",
  loadedImages: "onLoadedImages",
  destroy: "onDestroy",
};

const Lottie = ({
  options = {},
  height,
  width,
  style,
  eventListeners,
  isClickToPauseDisabled,
  ...rest
}) => {
  const {
    animationData,
    loop = true,
    autoplay = true,
    rendererSettings,
  } = options;

  const eventProps = {};
  if (Array.isArray(eventListeners)) {
    for (const { eventName, callback } of eventListeners) {
      const prop = REACT_LOTTIE_EVENT_MAP[eventName];
      if (prop && callback) {
        eventProps[prop] = callback;
      }
    }
  }

  return (
    <LottieReact
      animationData={animationData}
      loop={loop}
      autoplay={autoplay}
      rendererSettings={rendererSettings}
      style={{ height, width, ...style }}
      {...eventProps}
      {...rest}
    />
  );
};

export default Lottie;
