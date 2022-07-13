import * as React from "react";

const ParticipantScreenShareIcon = (props) => (
  <svg
    width={20}
    height={20}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M18.317 2.02H1.686a1.02 1.02 0 0 0-1.02 1.015V15.56a1.02 1.02 0 0 0 1.02 1.017h16.632a1.016 1.016 0 0 0 1.015-1.02V3.038a1.017 1.017 0 0 0-1.016-1.018ZM14.3 8.482l-2.902 2.905a.378.378 0 0 1-.574-.06.368.368 0 0 1-.063-.208v-1.012a4.775 4.775 0 0 0-4.184 3.293.373.373 0 0 1-.71 0A5.543 5.543 0 0 1 10.76 6.17v-.852a.368.368 0 0 1 .23-.345.378.378 0 0 1 .407.077L14.3 7.958a.365.365 0 0 1 .112.26.378.378 0 0 1-.112.265Zm-.438 9.498a.373.373 0 1 0 0-.747H6.144a.374.374 0 0 0 0 .747h7.718Z"
      fill={props.fillColor}
    />
  </svg>
);

export default ParticipantScreenShareIcon;
