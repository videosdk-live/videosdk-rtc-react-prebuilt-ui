// import { useMediaQuery, useTheme } from "@material-ui/core";

// const useIsTab = () => {
//   const theme = useTheme();
//   const isMD = useMediaQuery(theme.breakpoints.only("md"));
//   return isMD;
// };

// export default useIsTab;

import { useMediaQuery } from "react-responsive";

const useIsTab = () => {
  const isTablet = useMediaQuery({
    minWidth: 768,
    maxWidth: 1223, // 991,
  });

  return isTablet;
};

export default useIsTab;
