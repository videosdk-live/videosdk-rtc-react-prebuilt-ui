import React from "react";

function GridLightIcon(props) {
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
        width="24"
        height="20"
        x="6"
        y="6"
        fill={props.strokeColor ? props.strokeColor : "#D3D7DA"}
        rx="2"
      ></rect>
      <rect
        width="24"
        height="20"
        x="6"
        y="30"
        fill={props.strokeColor ? props.strokeColor : "#D3D7DA"}
        rx="2"
      ></rect>
      <rect
        width="24"
        height="20"
        x="34"
        y="6"
        fill={props.strokeColor ? props.strokeColor : "#D3D7DA"}
        rx="2"
      ></rect>
      <rect
        width="24"
        height="20"
        x="34"
        y="30"
        fill={props.strokeColor ? props.strokeColor : "#D3D7DA"}
        rx="2"
      ></rect>
      <rect
        width="24"
        height="20"
        x="62"
        y="6"
        fill={props.strokeColor ? props.strokeColor : "#D3D7DA"}
        rx="2"
      ></rect>
      <rect
        width="24"
        height="20"
        x="62"
        y="30"
        fill={props.strokeColor ? props.strokeColor : "#D3D7DA"}
        rx="2"
      ></rect>
      <path
        fill={props.pathColor ? props.pathColor : "#8896A4"}
        d="M15 18.222v1.334c0 .245.196.444.438.444h6.124a.441.441 0 00.438-.444v-1.334c0-.982-.784-1.778-1.75-1.778h-3.5c-.966 0-1.75.796-1.75 1.778zm5.25-4.444c0 .982-.784 1.778-1.75 1.778s-1.75-.796-1.75-1.778S17.534 12 18.5 12s1.75.796 1.75 1.778zM15 42.222v1.334c0 .245.196.444.438.444h6.124a.441.441 0 00.438-.444v-1.334c0-.982-.784-1.778-1.75-1.778h-3.5c-.966 0-1.75.796-1.75 1.778zm5.25-4.444c0 .982-.784 1.778-1.75 1.778s-1.75-.796-1.75-1.778S17.534 36 18.5 36s1.75.796 1.75 1.778zM43 18.222v1.334c0 .245.196.444.438.444h6.124a.441.441 0 00.438-.444v-1.334c0-.982-.783-1.778-1.75-1.778h-3.5c-.967 0-1.75.796-1.75 1.778zm5.25-4.444c0 .982-.783 1.778-1.75 1.778s-1.75-.796-1.75-1.778S45.533 12 46.5 12s1.75.796 1.75 1.778zM43 42.222v1.334c0 .245.196.444.438.444h6.124a.441.441 0 00.438-.444v-1.334c0-.982-.783-1.778-1.75-1.778h-3.5c-.967 0-1.75.796-1.75 1.778zm5.25-4.444c0 .982-.783 1.778-1.75 1.778s-1.75-.796-1.75-1.778S45.533 36 46.5 36s1.75.796 1.75 1.778zM71 18.222v1.334c0 .245.196.444.438.444h6.124a.441.441 0 00.438-.444v-1.334c0-.982-.784-1.778-1.75-1.778h-3.5c-.966 0-1.75.796-1.75 1.778zm5.25-4.444c0 .982-.784 1.778-1.75 1.778s-1.75-.796-1.75-1.778S73.534 12 74.5 12s1.75.796 1.75 1.778zM71 42.222v1.334c0 .245.196.444.438.444h6.124a.441.441 0 00.438-.444v-1.334c0-.982-.784-1.778-1.75-1.778h-3.5c-.966 0-1.75.796-1.75 1.778zm5.25-4.444c0 .982-.784 1.778-1.75 1.778s-1.75-.796-1.75-1.778S73.534 36 74.5 36s1.75.796 1.75 1.778z"
      ></path>
    </svg>
  );
}

export default GridLightIcon;
