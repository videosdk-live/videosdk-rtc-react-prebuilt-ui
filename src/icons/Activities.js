import { SvgIcon } from "@mui/material";
import React from "react";

const Activities = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 20 20">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
      >
        <path
          id="Path_6057"
          data-name="Path 6057"
          d="M12.167,12.811,3,8.956v8.589a1.878,1.878,0,0,0,1.111,1.689L12.1,23h.067ZM13,11.333l9.456-3.967a1.8,1.8,0,0,0-.567-.422l-8-3.744a2.078,2.078,0,0,0-1.778,0l-8,3.744a1.8,1.8,0,0,0-.567.422Zm.833,1.478V23h.056l8-3.767A1.878,1.878,0,0,0,23,17.556v-8.6Z"
          transform="translate(-3 -3)"
          fill={props.fillColor}
        />
      </svg>
    </SvgIcon>
  );
};

export default Activities;
