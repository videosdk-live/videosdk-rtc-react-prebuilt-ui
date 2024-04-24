import { Box, Typography } from "@mui/material";
import React from "react";
import Error_400 from "../errorCodes/Error_400";
import Error_401 from "../errorCodes/Error_401";
import Error_403 from "../errorCodes/Error_403";
import Astronaut from "../errorCodes/Astronaut";
import useResponsiveSize from "../utils/useResponsiveSize";

const ErrorPage = ({ errMsg, statusCode }) => {
  const iconSize = useResponsiveSize({
    xl: 180,
    lg: 120,
    md: 120,
    sm: 90,
    xs: 90,
  });

  return (
    <Box
      style={{
        flex: 1,
        height: "100vh",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Box
        style={{
          margin: iconSize * 0.5,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Box>
            {statusCode == 400 ? (
              <Error_400 height={iconSize} />
            ) : statusCode == 401 ? (
              <Error_401 height={iconSize} />
            ) : statusCode == 403 ? (
              <Error_403 height={iconSize} />
            ) : null}
          </Box>
          <Box>
            <Typography style={{ fontSize: iconSize * 0.2 }}>
              {errMsg}
            </Typography>
          </Box>
        </Box>
        <Box>
          <Astronaut height={iconSize * 1.8} />
        </Box>
      </Box>
    </Box>
  );
};

export default ErrorPage;
