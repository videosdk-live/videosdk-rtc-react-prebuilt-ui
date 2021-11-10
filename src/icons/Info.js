import { SvgIcon } from "@material-ui/core";
import React from "react";

const Info = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <svg
        id="info_black_24dp"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          id="Path_6015"
          data-name="Path 6015"
          d="M0,0H24V24H0Z"
          fill="none"
        />
        <path
          id="Path_6016"
          data-name="Path 6016"
          d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm1,15H11V11h2Zm0-8H11V7h2Z"
        />
      </svg>
    </SvgIcon>
  );
};

export default Info;
