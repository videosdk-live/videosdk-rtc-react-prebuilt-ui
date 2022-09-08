import React from "react";

function PinParticipantLightIcon(props) {
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
      <mask
        id="mask0_502_165"
        style={{ maskType: "alpha" }}
        width="12"
        height="12"
        x="72"
        y="36"
        maskUnits="userSpaceOnUse"
      >
        <path fill="#C4C4C4" d="M72 36H84V48H72z"></path>
      </mask>
      <g mask="url(#mask0_502_165)">
        <path
          fill={props.pathColor ? props.pathColor : "#8896A4"}
          d="M79.98 37h-3.692c-.36 0-.65.316-.65.706a.75.75 0 00.188.502c.12.13.29.204.462.204h.12v3.51l-.872 1.132a.214.214 0 00-.017.204c.034.056.085.112.153.112h4.906a.15.15 0 00.12-.056c.016-.019.016-.037.033-.056a.214.214 0 00-.017-.204l-.854-1.114v-3.51h.12a.606.606 0 00.46-.204.717.717 0 00.189-.501c0-.39-.29-.724-.65-.724zm-2.017 10.102c.017.074.085.13.17.149a.15.15 0 00.12-.056.414.414 0 00.052-.093l.803-3.361h-1.931l.786 3.36z"
        ></path>
      </g>
    </svg>
  );
}

export default PinParticipantLightIcon;
