import * as React from "react";

const PinParticipantIcon = (props) => (
  <svg
    width={92}
    height={56}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect
      x={0.75}
      y={0.75}
      width={90.5}
      height={54.5}
      rx={5.25}
      stroke={props.strokeColor}
      strokeWidth={1.5}
    />
    <rect x={6} y={6} width={80} height={44} rx={2} fill={props.fillColor} />
    <path
      d="M38 31.889v2.333c0 .43.336.778.75.778h10.5c.414 0 .75-.348.75-.778V31.89c0-1.718-1.343-3.111-3-3.111h-6c-1.657 0-3 1.393-3 3.11Zm9-7.778c0 1.718-1.343 3.111-3 3.111s-3-1.393-3-3.11C41 22.391 42.343 21 44 21s3 1.393 3 3.111Z"
      fill="#333244"
    />
    <mask
      id="a"
      style={{
        maskType: "alpha",
      }}
      maskUnits="userSpaceOnUse"
      x={72}
      y={36}
      width={12}
      height={12}
    >
      <path fill="#C4C4C4" d="M72 36h12v12H72z" />
    </mask>
    <g mask="url(#a)">
      <path
        d="M79.98 37h-3.692c-.36 0-.65.316-.65.706 0 .186.069.371.188.502.12.13.29.204.462.204h.12v3.51l-.872 1.132a.214.214 0 0 0-.017.204c.034.056.085.112.153.112h4.906a.15.15 0 0 0 .12-.056c.016-.019.016-.037.033-.056a.214.214 0 0 0-.017-.204l-.854-1.114v-3.51h.12a.607.607 0 0 0 .46-.204.717.717 0 0 0 .189-.501c0-.39-.29-.724-.65-.724Zm-2.017 10.102c.017.074.085.13.17.149a.15.15 0 0 0 .12-.056.414.414 0 0 0 .052-.093l.803-3.361h-1.931l.786 3.36Z"
        fill="#333244"
      />
    </g>
  </svg>
);

export default PinParticipantIcon;
