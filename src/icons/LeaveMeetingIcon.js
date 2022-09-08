import * as React from "react";

const LeaveMeetingIcon = (props) => (
  <svg
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    x={0}
    y={0}
    viewBox="0 0 24 24"
    style={{
      enableBackground: "new 0 0 24 24",
    }}
    xmlSpace="preserve"
    {...props}
  >
    <style>{`.st0{fill:${props.fill ? props.fill : "#fff"}}`}</style>
    <path
      className="st0"
      d="M3 0h11c1.7 0 3 1.3 3 3v6H8c-1.7 0-3 1.3-3 3s1.3 3 3 3h9v6c0 1.7-1.3 3-3 3H3c-1.7 0-3-1.3-3-3V3c0-1.7 1.4-3 3-3z"
    />
    <path
      className="st0"
      d="M20.6 13H8c-.6 0-1-.4-1-1s.4-1 1-1h12.6l-1.3-1.3c-.4-.4-.4-1 0-1.4s1-.4 1.4 0l3 3c.4.4.4 1 0 1.4l-3 3c-.4.4-1 .4-1.4 0-.4-.4-.4-1 0-1.4l1.3-1.3z"
    />
  </svg>
);

export default LeaveMeetingIcon;
