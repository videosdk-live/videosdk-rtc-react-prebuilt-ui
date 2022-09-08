import { useTheme } from "@material-ui/styles";
import * as React from "react";
import { themeColorType, useMeetingAppContext } from "../MeetingAppContextDef";

const AddLiveStreamIcon = (props) => {
  const { themeColor } = useMeetingAppContext();
  const theme = useTheme();
  return (
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
        <path
          fill={
            themeColor === themeColorType.LIGHT
              ? theme.palette.lightTheme.contrastText
              : "#C4C4C4"
          }
          d="M0 0h24v24H0z"
        />
      </mask>
      <g mask="url(#a)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M20.637 3h-18A1.638 1.638 0 0 0 1 4.636V12a.818.818 0 0 0 .818.818 7.372 7.372 0 0 1 7.364 7.364A.818.818 0 0 0 10 21h10.637a1.639 1.639 0 0 0 1.636-1.636V4.636A1.639 1.639 0 0 0 20.637 3ZM1.818 14.454a.818.818 0 1 0 0 1.637 4.095 4.095 0 0 1 4.091 4.09.818.818 0 1 0 1.637 0 5.734 5.734 0 0 0-5.728-5.727Zm0 3.273a.818.818 0 0 0 0 1.636.82.82 0 0 1 .819.819.818.818 0 0 0 1.636 0 2.458 2.458 0 0 0-2.455-2.455Z"
          fill={
            themeColor === themeColorType.LIGHT
              ? theme.palette.lightTheme.contrastText
              : "#95959E"
          }
        />
      </g>
    </svg>
  );
};

export default AddLiveStreamIcon;
