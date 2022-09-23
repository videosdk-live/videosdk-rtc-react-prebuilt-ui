import * as React from "react";

const Activities = (props) => (
  <svg
    width={24}
    height={24}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <mask
      id="a"
      style={{
        maskType: "alpha",
      }}
      maskUnits="userSpaceOnUse"
      x={0}
      y={0}
      width={24}
      height={24}
    >
      <path fill="#D9D9D9" d="M0 0h24v24H0z" />
    </mask>
    <g mask="url(#a)">
      <path
        d="M11.167 11.81 2 7.957v8.589a1.878 1.878 0 0 0 1.111 1.689L11.1 22h.067V11.81ZM12 10.334l9.456-3.967a1.8 1.8 0 0 0-.567-.422l-8-3.744a2.078 2.078 0 0 0-1.778 0l-8 3.744a1.8 1.8 0 0 0-.567.422L12 10.333Zm.833 1.478V22h.056l8-3.767A1.878 1.878 0 0 0 22 16.556v-8.6l-9.167 3.855Z"
        fill={props.fillColor}
      />
    </g>
  </svg>
);

export default Activities;
