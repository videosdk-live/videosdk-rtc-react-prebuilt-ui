import * as React from "react";

const SelectedIcon = (props) => (
  <svg
    width={16}
    height={16}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx={8.5} cy={8.5} r={4.5} fill="#fff" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8Zm9.592-1.302a.54.54 0 1 0-.876-.626L7.393 9.324 6.227 8.158a.538.538 0 0 0-.761.761l1.615 1.615a.539.539 0 0 0 .818-.067l2.693-3.77Z"
      fill="#3BA55D"
    />
  </svg>
);

export default SelectedIcon;
