import { SvgIcon } from "@material-ui/core";
import React from "react";

const VideoCamera = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 20 12">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="12"
        viewBox="0 0 20 12"
      >
        <path
          id="video-camera"
          d="M21.5,7.1a.908.908,0,0,0-1,0L17,8.9A3.058,3.058,0,0,0,14,6H5A2.946,2.946,0,0,0,2,9v6a2.946,2.946,0,0,0,3,3h9a3.058,3.058,0,0,0,3-2.9l3.6,1.8a1.053,1.053,0,0,0,1.3-.4A.9.9,0,0,0,22,16V8A1.193,1.193,0,0,0,21.5,7.1Z"
          transform="translate(-2 -6)"
        />
      </svg>
    </SvgIcon>
  );
};

export default VideoCamera;
