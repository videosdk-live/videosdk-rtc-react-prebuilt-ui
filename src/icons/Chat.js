import { SvgIcon } from "@material-ui/core";
import React from "react";

const Chat = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 20 20">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
      >
        <path
          id="chat_1_"
          data-name="chat (1)"
          d="M19,2H5A2.946,2.946,0,0,0,2,5V15a2.946,2.946,0,0,0,3,3H16.6l3.7,3.7a.967.967,0,0,0,1.4,0A.908.908,0,0,0,22,21V5A2.946,2.946,0,0,0,19,2ZM7,13a1,1,0,0,1,0-2,1,1,0,0,1,0,2ZM7,9A.945.945,0,0,1,6,8,.945.945,0,0,1,7,7,.945.945,0,0,1,8,8,.945.945,0,0,1,7,9Zm10,4H11a1,1,0,0,1,0-2h6a1,1,0,0,1,0,2Zm0-4H11a.945.945,0,0,1-1-1,.945.945,0,0,1,1-1h6a.945.945,0,0,1,1,1A.945.945,0,0,1,17,9Z"
          transform="translate(-2 -2)"
        />
      </svg>
    </SvgIcon>
  );
};

export default Chat;
