import { useTheme } from "@material-ui/core";
import * as React from "react";
import { appThemes, useMeetingAppContext } from "../MeetingAppContextDef";

const AddLiveStreamsIcon = (props) => {
  const { appTheme } = useMeetingAppContext();
  const theme = useTheme();
  return (
    <svg
      width={32}
      height={32}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M16 20.8a4.8 4.8 0 1 1 4.8-4.8 4.809 4.809 0 0 1-4.8 4.8Zm6.857 1.883a1.143 1.143 0 0 1-.804-1.947 6.71 6.71 0 0 0 0-9.472 1.142 1.142 0 0 1 .799-1.992 1.143 1.143 0 0 1 .819.383 8.987 8.987 0 0 1 0 12.69 1.124 1.124 0 0 1-.814.338Zm-13.714.01a1.161 1.161 0 0 1-.814-.339 8.997 8.997 0 0 1 0-12.7 1.144 1.144 0 0 1 1.619 1.62 6.702 6.702 0 0 0 0 9.462 1.145 1.145 0 0 1-.805 1.957Z"
        fill={
          appTheme === appThemes.LIGHT
            ? theme.palette.lightTheme.contrastText
            : "#fff"
        }
      />
      <path
        d="M26.34 27.118a1.143 1.143 0 0 1-1.142-1.143c.002-.312.126-.611.347-.832a12.592 12.592 0 0 0 0-18.286 1.145 1.145 0 0 1 1.59-1.646 14.867 14.867 0 0 1 0 21.541 1.116 1.116 0 0 1-.795.366Zm-20.68 0a1.134 1.134 0 0 1-.915-.403 14.875 14.875 0 0 1 .119-21.513 1.145 1.145 0 0 1 1.59 1.646 12.59 12.59 0 0 0 0 18.286 1.161 1.161 0 0 1-.355 1.892c-.139.06-.288.09-.44.092Z"
        fill={
          appTheme === appThemes.LIGHT
            ? theme.palette.lightTheme.contrastText
            : "#fff"
        }
      />
    </svg>
  );
};

export default AddLiveStreamsIcon;
