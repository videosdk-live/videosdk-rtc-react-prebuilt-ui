import * as React from "react";

const VirtualBackgroundIcon = (props) => (
  <svg
    width={32}
    height={32}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#a)">
      <g clipPath="url(#b)">
        <path
          d="M15.844 2 2 15.844V20.2L20.2 2h-4.356ZM2 5.111v3.111L8.222 2h-3.11A3.12 3.12 0 0 0 2 5.111Zm25.667-2.955L2.156 27.666c.155.467.466.934.777 1.4.467.312.934.623 1.4.778l25.511-25.51c-.31-1.09-1.088-1.867-2.177-2.178ZM30 11.8 11.8 30h4.356L30 16.156V11.8Zm-.933 17.267c.622-.623.933-1.4.933-2.178v-3.111L23.778 30h3.11c.779 0 1.556-.311 2.179-.933Z"
          fill={props.fillColor}
        />
      </g>
    </g>
    <defs>
      <clipPath id="a">
        <path fill={props.fillColor} d="M0 0h32v32H0z" />
      </clipPath>
      <clipPath id="b">
        <path fill={props.fillColor} d="M0 0h32v32H0z" />
      </clipPath>
    </defs>
  </svg>
);

export default VirtualBackgroundIcon;
