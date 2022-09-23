import * as React from "react";

const ParticipantScreenShareIcon = (props) => (
  <svg
    width={18}
    height={18}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M17.02 1H.983A.983.983 0 0 0 0 1.979v12.078a.984.984 0 0 0 .983.98H17.02a.98.98 0 0 0 .979-.982V1.98A.982.982 0 0 0 17.02 1Zm-3.874 6.233-2.797 2.801a.364.364 0 0 1-.615-.259V8.8A4.604 4.604 0 0 0 5.7 11.975a.36.36 0 0 1-.685 0 5.345 5.345 0 0 1 4.718-6.973v-.82a.355.355 0 0 1 .223-.333.365.365 0 0 1 .392.073l2.8 2.804a.353.353 0 0 1 .108.252.365.365 0 0 1-.109.255Zm-.422 9.158a.36.36 0 1 0 0-.72H5.281a.36.36 0 0 0 0 .72h7.443Z"
      fill={props.fillColor}
    />
  </svg>
);

export default ParticipantScreenShareIcon;
