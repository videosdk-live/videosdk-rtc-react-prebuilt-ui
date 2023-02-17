import React from "react";

function HDLightIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="92"
      height="56"
      fill="none"
      viewBox="0 0 92 56"
      {...props}
    >
      <rect
        width="90.5"
        height="54.5"
        x="0.75"
        y="0.75"
        stroke={props.strokeColor ? props.strokeColor : "#D3D7DA"}
        strokeWidth="1.5"
        rx="5.25"
      ></rect>
      <rect
        width="80"
        height="44"
        x="6"
        y="6"
        fill={props.strokeColor ? props.strokeColor : "#D3D7DA"}
        rx="2"
      ></rect>
      <path
        fill={props.pathColor ? props.pathColor : "#8896A4"}
        d="M43.75 26.258v1.828h-5.938v-1.828h5.938zm-5.242-4.633V33h-2.344V21.625h2.344zm6.914 0V33h-2.336V21.625h2.336zM50.953 33h-2.476l.015-1.828h2.461c.615 0 1.133-.138 1.555-.414.422-.281.74-.69.953-1.227.219-.536.328-1.185.328-1.945v-.555c0-.583-.062-1.096-.187-1.539a3.06 3.06 0 00-.54-1.117 2.256 2.256 0 00-.882-.68 2.918 2.918 0 00-1.203-.234H48.43v-1.836h2.547c.76 0 1.455.13 2.086.39a4.703 4.703 0 011.648 1.102c.464.48.82 1.052 1.07 1.719.255.661.383 1.398.383 2.21v.54c0 .807-.128 1.544-.383 2.21a4.924 4.924 0 01-1.07 1.72 4.75 4.75 0 01-1.648 1.101c-.636.255-1.339.383-2.11.383zm-1.148-11.375V33H47.46V21.625h2.344z"
      ></path>
    </svg>
  );
}

export default HDLightIcon;
