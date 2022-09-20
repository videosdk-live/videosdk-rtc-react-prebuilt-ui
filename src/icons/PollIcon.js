import { useTheme } from "@material-ui/core";
import React from "react";
import { appThemes, useMeetingAppContext } from "../MeetingAppContextDef";

function PollIcon() {
  const { appTheme } = useMeetingAppContext();
  const theme = useTheme();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="33"
      fill="none"
      viewBox="0 0 32 33"
    >
      <path
        fill={
          appTheme === appThemes.LIGHT
            ? theme.palette.lightTheme.contrastText
            : "#fff"
        }
        d="M28.444.5H3.556A3.566 3.566 0 000 4.056v24.888C0 30.9 1.6 32.5 3.556 32.5h24.888C30.4 32.5 32 30.9 32 28.944V4.056C32 2.1 30.4.5 28.444.5zM8.89 25.389c-.978 0-1.778-.8-1.778-1.778v-8.889c0-.978.8-1.778 1.778-1.778s1.778.8 1.778 1.778v8.89c0 .977-.8 1.777-1.778 1.777zm7.111 0c-.978 0-1.778-.8-1.778-1.778V9.39c0-.978.8-1.778 1.778-1.778s1.778.8 1.778 1.778V23.61c0 .978-.8 1.778-1.778 1.778zm7.111 0c-.978 0-1.778-.8-1.778-1.778v-3.555c0-.978.8-1.778 1.778-1.778s1.778.8 1.778 1.778v3.555c0 .978-.8 1.778-1.778 1.778z"
      ></path>
    </svg>
  );
}

export default PollIcon;
