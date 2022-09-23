import * as React from "react";

const ParticipantCloseIcon = (props) => (
  <svg
    width={18}
    height={18}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17 8.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0ZM5.39 5.39a.944.944 0 0 1 1.336 0l1.67 1.67 1.67-1.67A.945.945 0 0 1 11.4 6.726l-1.67 1.67 1.67 1.669a.945.945 0 0 1-1.336 1.335l-1.67-1.67-1.669 1.67a.945.945 0 0 1-1.336-1.335l1.67-1.67-1.67-1.67a.944.944 0 0 1 0-1.335Z"
      fill={props.fillColor}
    />
  </svg>
);

export default ParticipantCloseIcon;
