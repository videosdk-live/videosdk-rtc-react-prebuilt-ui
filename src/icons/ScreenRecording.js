import { SvgIcon, useTheme } from "@material-ui/core";
import React from "react";
import { appThemes, useMeetingAppContext } from "../MeetingAppContextDef";

const ScreenRecording = (props) => {
  const { themeColor } = useMeetingAppContext();
  const theme = useTheme();
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={
          themeColor === appThemes.LIGHT
            ? theme.palette.lightTheme.contrastText
            : "#fff"
        }
      >
        <g id="screen-recording" transform="translate(-2 -2)">
          <path
            id="Path_6017"
            data-name="Path 6017"
            fill={
              themeColor === appThemes.LIGHT
                ? theme.palette.lightTheme.contrastText
                : "#fff"
            }
            d="M14,2A12,12,0,1,0,26,14,12.013,12.013,0,0,0,14,2Zm0,22.08A10.08,10.08,0,1,1,24.08,14,10.091,10.091,0,0,1,14,24.08Z"
          />
          <circle
            id="Ellipse_259"
            data-name="Ellipse 259"
            cx="6"
            cy="6"
            r="6"
            transform="translate(8 8)"
            fill={
              themeColor === appThemes.LIGHT
                ? theme.palette.lightTheme.contrastText
                : "#fff"
            }
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default ScreenRecording;
