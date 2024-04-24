import { SvgIcon } from "@mui/material";
import React from "react";

const Emoji = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 20 20">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
      >
        <path
          id="emoji"
          d="M12,2A10,10,0,1,1,2,12,10,10,0,0,1,12,2Zm0,1.667A8.333,8.333,0,1,0,20.333,12,8.333,8.333,0,0,0,12,3.667Zm3.106,11.111a.833.833,0,1,1,1.242,1.112,5.834,5.834,0,0,1-8.7,0,.833.833,0,1,1,1.242-1.112,4.167,4.167,0,0,0,6.212,0ZM9.083,9.083a1.25,1.25,0,1,1-1.25,1.25A1.25,1.25,0,0,1,9.083,9.083Zm5.833,0a1.25,1.25,0,1,1-1.25,1.25A1.25,1.25,0,0,1,14.917,9.083Z"
          transform="translate(-2 -2)"
        />
      </svg>
    </SvgIcon>
  );
};

export default Emoji;
