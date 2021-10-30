// import { useMediaQuery, useTheme } from "@material-ui/core";

// const useIsSMDesktop = () => {
//   const theme = useTheme();

//   const isLG = useMediaQuery(theme.breakpoints.only("lg"));
//   return isLG;
// };

// export default useIsSMDesktop;

import { useMediaQuery } from "react-responsive";

const useIsSMDesktop = () => {
  const isDesktopOrLaptop = useMediaQuery({
    minWidth: 1224,
    maxWidth: 1824,
  });

  return isDesktopOrLaptop;
};

export default useIsSMDesktop;
