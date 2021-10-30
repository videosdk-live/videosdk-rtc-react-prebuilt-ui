import { useState, useEffect } from "react";

export const orientations = {
  "landscape-primary": "landscape-primary",
  "portrait-primary": "portrait-primary",
};

const useScreenOrientation = () => {
  const onOrientationChange = () => {
    var orientation = "portrait";
    var type = "primary";
    var angle = 0;

    if (window.orientation) {
      angle = window.orientation;
      orientation = Math.abs(angle) === 90 ? "landscape" : "portrait";
    }

    if (window.screen.orientation) {
      [orientation, type] = window.screen.orientation.type.split("-");
      angle = window.screen.orientation;
    }

    return `${orientation}-${type}`;
  };

  const [orientation, setOrientation] = useState(onOrientationChange());

  const updateOrientation = () => {
    setOrientation(onOrientationChange());
  };

  useEffect(() => {
    setTimeout(() => {
      onOrientationChange();
    }, 1000);

    window.addEventListener("orientationchange", updateOrientation);
    return () => {
      window.removeEventListener("orientationchange", updateOrientation);
    };
  }, []);

  return orientation;
};

export default useScreenOrientation;
