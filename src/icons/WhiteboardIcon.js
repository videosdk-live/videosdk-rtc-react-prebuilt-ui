import { useTheme } from "@material-ui/core";
import * as React from "react";
import { appThemes, useMeetingAppContext } from "../MeetingAppContextDef";

const WhiteboardIcon = (props) => {
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
      <g clipPath="url(#a)">
        <mask
          id="b"
          style={{
            maskType: "alpha",
          }}
          maskUnits="userSpaceOnUse"
          x={0}
          y={0}
          width={32}
          height={32}
        >
          <path fill="#D9D9D9" d="M0 0h32v32H0z" />
        </mask>
        <g mask="url(#b)">
          <path
            d="M7.12 9.76c.849-.87 1.696-1.65 2.07-1.493.605.244 0 1.26-.364 1.86-.3.514-3.462 4.76-3.462 7.72a4.427 4.427 0 0 0 .377 2.021c.282.634.71 1.192 1.247 1.626a3.61 3.61 0 0 0 3.198.563c1.296-.38 2.362-1.712 3.703-3.389 1.47-1.823 3.432-4.208 4.942-4.208 1.975 0 1.999 1.235 2.133 2.19-4.574.783-6.517 4.49-6.517 6.57a3.882 3.882 0 0 0 1.173 2.701A3.805 3.805 0 0 0 18.338 27c1.974 0 5.197-1.626 5.682-7.463H27v-3.059h-2.992c-.182-2.017-1.321-5.139-4.883-5.139-2.722 0-5.064 2.338-5.984 3.475-.703.893-2.495 3.035-2.774 3.328-.303.368-.823 1.028-1.345 1.028-.545 0-.871-1.015-.436-2.35a22.407 22.407 0 0 1 2.24-4.306 6.516 6.516 0 0 0 1.58-4.014 3.253 3.253 0 0 0-.784-2.408A3.167 3.167 0 0 0 9.357 5a5.26 5.26 0 0 0-3.29 1.529c-.436.44-.8.807-1.067 1.137L7.12 9.76Zm11.254 14.27a.905.905 0 0 1-.622-.26.923.923 0 0 1-.274-.62c0-.734.884-2.692 3.476-3.377-.363 3.286-1.732 4.256-2.58 4.256Z"
            fill={
              appTheme === appThemes.LIGHT
                ? theme.palette.lightTheme.contrastText
                : "#fff"
            }
          />
        </g>
      </g>
      <defs>
        <clipPath id="a">
          <path
            fill={
              appTheme === appThemes.LIGHT
                ? theme.palette.lightTheme.contrastText
                : "#fff"
            }
            d="M0 0h32v32H0z"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default WhiteboardIcon;
