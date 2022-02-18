import { useMediaQuery } from "react-responsive";

const useIsLGDesktop = () => {
  const isBigScreen = useMediaQuery({ query: "(min-width: 1824px)" });
  return isBigScreen;
};

export default useIsLGDesktop;
