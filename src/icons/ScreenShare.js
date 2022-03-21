import { SvgIcon } from "@material-ui/core";
import React from "react";

const ScreenShare = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <defs>
          <clipPath id="clip-path">
            <rect
              id="Rectangle_7038"
              data-name="Rectangle 7038"
              width="24"
              height="24"
              transform="translate(2.547 2.547)"
            />
          </clipPath>
        </defs>
        <g
          id="screen_share_on"
          transform="translate(-2.547 -2.547)"
          clipPath="url(#clip-path)"
        >
          <path
            id="share_1_"
            data-name="share (1)"
            d="M24.35,9.2H6.756a1.079,1.079,0,0,0-1.078,1.074v13.25A1.079,1.079,0,0,0,6.756,24.6H24.351a1.076,1.076,0,0,0,1.074-1.078V10.276A1.075,1.075,0,0,0,24.35,9.2ZM20.1,16.038l-3.069,3.073a.4.4,0,0,1-.43.081.39.39,0,0,1-.244-.365v-1.07a5.05,5.05,0,0,0-4.427,3.483.395.395,0,0,1-.751,0,5.933,5.933,0,0,1-.284-1.809,5.864,5.864,0,0,1,5.46-5.841v-.9a.39.39,0,0,1,.244-.365.4.4,0,0,1,.43.081L20.1,15.482a.386.386,0,0,1,.119.276.4.4,0,0,1-.119.28Zm-.463,10.047a.395.395,0,0,0,0-.79H11.472a.395.395,0,1,0,0,.79Z"
            transform="translate(-1.374 -2.68)"
            fill={props.fillColor}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default ScreenShare;
