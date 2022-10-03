import React from "react";

function NoFilterIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <g clipPath="url(#clip0_5_256)">
        <path
          fill={props.fillColor}
          d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 3c4.962 0 9 4.038 9 9a8.942 8.942 0 01-1.672 5.206L6.793 4.672A8.941 8.941 0 0112 3zm-9 9c0-1.941.624-3.735 1.673-5.207l12.534 12.535A8.945 8.945 0 0112 21c-4.962 0-9-4.038-9-9z"
        ></path>
      </g>
      <defs>
        <clipPath id="clip0_5_256">
          <path fill={props.fillColor} d="M0 0H24V24H0z"></path>
        </clipPath>
      </defs>
    </svg>
  );
}

export default NoFilterIcon;
