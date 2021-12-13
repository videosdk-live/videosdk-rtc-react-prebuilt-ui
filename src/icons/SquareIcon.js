import * as React from "react";

const SquareIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={24} width={24} {...props}>
    <path fill="none" d="M0 0h24v24H0z" />
    <path d="M3 3v18h18V3H3zm16 16H5V5h14v14z" />
  </svg>
);

export default SquareIcon;
