import { useTheme } from "@material-ui/core";
import * as React from "react";
import { appThemes, useMeetingAppContext } from "../MeetingAppContextDef";

const MicOffIcon = (props) => {
  const { appTheme } = useMeetingAppContext();
  const theme = useTheme();
  return (
    <svg
      width={24}
      height={24}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M19.832 11.505h-1.783c0 .792-.197 1.386-.395 2.178l1.386 1.386c.396-1.188.792-2.376.792-3.564Zm-4.357.198s0-.198 0 0V5.168C15.475 3.386 13.891 2 12.307 2s-2.97 1.386-3.168 3.168v.198l6.336 6.337ZM4.188 3.188 3 4.376l6.337 6.337v.792c0 1.782 1.386 3.168 3.168 3.168h.594l1.782 1.782c-.792.199-1.584.397-2.574.397-2.97 0-5.545-2.377-5.545-5.347H4.98c0 3.564 2.772 6.535 6.337 7.129V22h2.178v-3.366c.99-.198 1.782-.396 2.574-.99L20.426 22l1.386-1.386L4.188 3.188Z"
        fill={
          props.fillColor
            ? props.fillColor
            : appTheme === appThemes.LIGHT
            ? theme.palette.lightTheme.contrastText
            : "#fff"
        }
      />
    </svg>
  );
};

export default MicOffIcon;
