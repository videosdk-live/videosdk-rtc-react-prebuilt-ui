import { SvgIcon } from "@mui/material";
import React from "react";

const VideoOff = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 31 30">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width="31"
        height="30"
        viewBox="0 0 31 30"
      >
        <defs>
          <clipPath id="clip-video_off">
            <rect width="31" height="30" />
          </clipPath>
        </defs>
        <g id="video_off" clipPath="url(#clip-video_off)">
          <g
            id="Group_2115"
            data-name="Group 2115"
            transform="translate(-47 -52)"
          >
            <path
              id="video-camera-prohibited"
              d="M21.5,16.9A1.05,1.05,0,0,0,22,16V8a1.193,1.193,0,0,0-.5-.9.908.908,0,0,0-1,0L17,8.9A3.058,3.058,0,0,0,14,6H10.3l11,11C21.3,16.9,21.4,16.9,21.5,16.9Zm.2,3.4h0l-4.8-4.8h0L7.4,6h0L3.7,2.3a.967.967,0,0,0-1.4,0,.967.967,0,0,0,0,1.4L4.6,6A3.019,3.019,0,0,0,2,9v6a2.946,2.946,0,0,0,3,3h9a2.64,2.64,0,0,0,1.9-.7l4.4,4.4a.99.99,0,1,0,1.4-1.4Z"
              transform="translate(50 55)"
            />
          </g>
        </g>
      </svg>
    </SvgIcon>
  );
};

export default VideoOff;
