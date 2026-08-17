import LottieReact from "lottie-react";

// Compat shim: preserves the `react-lottie` API (options, height, width,
// eventListeners) while delegating to `lottie-react` under the hood.
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

  const onComplete = eventListeners?.find(
    (l) => l.eventName === "done"
  )?.callback;

  return (
    <LottieReact
      animationData={animationData}
      loop={loop}
      autoplay={autoplay}
      rendererSettings={rendererSettings}
      onComplete={onComplete}
      style={{ height, width, ...style }}
      {...rest}
    />
  );
};

export default Lottie;
