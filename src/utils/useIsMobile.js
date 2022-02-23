import { useMediaQuery } from "react-responsive";

const useIsMobile = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  return isMobile;
};

export default useIsMobile;
