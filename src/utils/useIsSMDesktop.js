import { useMediaQuery } from "react-responsive";

const useIsSMDesktop = () => {
  const isDesktopOrLaptop = useMediaQuery({
    minWidth: 1224,
    maxWidth: 1824,
  });

  return isDesktopOrLaptop;
};

export default useIsSMDesktop;
