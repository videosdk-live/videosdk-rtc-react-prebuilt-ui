import { useTheme } from "@mui/material";
import * as React from "react";
import { appThemes, useMeetingAppContext } from "../MeetingAppContextDef";

const WebCamOffIcon = (props) => {
  const { appTheme } = useMeetingAppContext();
  const theme = useTheme();
  return (
    <svg
      width={24}
      height={24}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M22.477 17.655c.163-.102.296-.242.388-.407.092-.166.14-.35.137-.539v-8.4a1.237 1.237 0 0 0-.154-.53 1.275 1.275 0 0 0-.371-.416.95.95 0 0 0-1.05 0l-3.675 1.892a3.115 3.115 0 0 0-.953-2.131 3.309 3.309 0 0 0-2.197-.924h-3.886l11.551 11.557c-.001-.102.104-.102.21-.102Zm.21 3.572-5.04-5.043L7.67 6.2 3.786 2.315A.993.993 0 0 0 3.05 2a1.02 1.02 0 0 0-.735.315A1.037 1.037 0 0 0 2 3.051a1.011 1.011 0 0 0 .315.736L4.73 6.2c-.77.119-1.471.503-1.973 1.083a3.083 3.083 0 0 0-.757 2.07v6.304c-.009.413.067.825.222 1.21s.388.737.683 1.035c.29.293.64.524 1.025.68.386.156.802.233 1.22.226h9.45a2.8 2.8 0 0 0 1.075-.17c.343-.126.656-.319.92-.565l4.621 4.622a1.02 1.02 0 0 0 .735.305 1.046 1.046 0 0 0 .735-.305c.195-.198.305-.461.305-.735 0-.274-.11-.538-.305-.736v.003Z"
        fill={
          appTheme === appThemes.LIGHT
            ? theme.palette.lightTheme.contrastText
            : "#fff"
        }
      />
    </svg>
  );
};

export default WebCamOffIcon;
