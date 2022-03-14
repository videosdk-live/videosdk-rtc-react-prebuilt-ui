import * as React from "react";

const SvgComponent = (props) => (
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
    <rect x={74} y={40} width={2} height={4} rx={1} fill="#333244" />
    <rect x={77} y={38} width={2} height={8} rx={1} fill="#333244" />
    <rect x={80} y={40} width={2} height={4} rx={1} fill="#333244" />
  </svg>
);

export default SvgComponent;
