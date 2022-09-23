import * as React from "react";

const Chat = (props) => (
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
        d="M19 3H5a2.946 2.946 0 0 0-3 3v10a2.946 2.946 0 0 0 3 3h11.6l3.7 3.7a.969.969 0 0 0 1.4 0 .908.908 0 0 0 .3-.7V6a2.946 2.946 0 0 0-3-3ZM7 14a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm0-4a.945.945 0 0 1-1-1 .945.945 0 0 1 1-1 .945.945 0 0 1 1 1 .945.945 0 0 1-1 1Zm10 4h-6a1 1 0 1 1 0-2h6a1 1 0 1 1 0 2Zm0-4h-6a.945.945 0 0 1-1-1 .945.945 0 0 1 1-1h6a.945.945 0 0 1 1 1 .946.946 0 0 1-1 1Z"
        fill={props.fillColor}
      />
    </g>
  </svg>
);

export default Chat;
