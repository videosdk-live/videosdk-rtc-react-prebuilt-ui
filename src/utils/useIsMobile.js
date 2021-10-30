// import { useMediaQuery, useTheme } from "@material-ui/core";

// const useIsMobile = () => {
//   const theme = useTheme();

//   const isXSToSM = useMediaQuery(theme.breakpoints.between("xs", "sm"));
//   return isXSToSM;
// };

// export default useIsMobile;

import { useMediaQuery } from "react-responsive";

const useIsMobile = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  return isMobile;
};

export default useIsMobile;
