// import { useMediaQuery, useTheme } from "@material-ui/core";

// const useIsLGDesktop = () => {
//   const theme = useTheme();

//   const isXL = useMediaQuery(theme.breakpoints.up("xl"));
//   return isXL;
// };z

// export default useIsLGDesktop;

import { useMediaQuery } from "react-responsive";

const useIsLGDesktop = () => {
  const isBigScreen = useMediaQuery({ query: "(min-width: 1824px)" });
  return isBigScreen;
};

export default useIsLGDesktop;
