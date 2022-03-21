import { SvgIcon } from "@material-ui/core";
import React from "react";

const MicOn = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 22 22">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width="22"
        height="22"
        viewBox="0 0 22 22"
      >
        <defs>
          <clipPath id="clip-path">
            <rect
              id="Rectangle_6481"
              data-name="Rectangle 6481"
              width="22"
              height="22"
            />
          </clipPath>
        </defs>
        <g id="mic_on" clipPath="url(#clip-path)">
          <g id="mic" transform="translate(1.935 1.05)">
            <path
              id="Path_3"
              data-name="Path 3"
              d="M17.157,16.186a3.053,3.053,0,0,0,3.057-3.052l.01-6.1a3.067,3.067,0,0,0-6.135,0v6.1A3.062,3.062,0,0,0,17.157,16.186Zm5.419-3.052a5.289,5.289,0,0,1-5.419,5.187,5.289,5.289,0,0,1-5.419-5.187H10a7.108,7.108,0,0,0,6.135,6.835V23.3H18.18V19.97a7.109,7.109,0,0,0,6.135-6.835Z"
              transform="translate(-7.876 -3.965)"
            />
            <path
              id="Path_4"
              data-name="Path 4"
              d="M0,0H18.563V18.563H0Z"
              transform="translate(0 0.777)"
              fill="none"
            />
          </g>
        </g>
      </svg>
    </SvgIcon>
  );
};

export default MicOn;
