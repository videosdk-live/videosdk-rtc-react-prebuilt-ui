import React from "react";

function SpotlightLightIcon(props) {
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
        d="M38 31.889v2.333c0 .43.336.778.75.778h10.5c.414 0 .75-.348.75-.778V31.89c0-1.718-1.343-3.111-3-3.111h-6c-1.657 0-3 1.393-3 3.11zm9-7.778c0 1.718-1.343 3.111-3 3.111s-3-1.393-3-3.11C41 22.391 42.343 21 44 21s3 1.393 3 3.111z"
      ></path>
    </svg>
  );
}

export default SpotlightLightIcon;
