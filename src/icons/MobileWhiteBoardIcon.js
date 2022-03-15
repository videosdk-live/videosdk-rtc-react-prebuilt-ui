import * as React from "react";

const MobileWhiteBoardIcon = (props) => (
  <svg
    width={24}
    height={24}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <mask
      id="a"
      style={{
        maskType: "alpha",
      }}
      maskUnits="userSpaceOnUse"
      x={0}
      y={0}
      width={24}
      height={24}
    >
      <path fill={props.fillColor} d="M0 0h24v24H0z" />
    </mask>
    <g clipPath="url(#b)">
      <path
        d="M3.947 6.327c.779-.79 1.557-1.5 1.9-1.357.556.222 0 1.146-.334 1.691-.276.467-3.179 4.327-3.179 7.019a3.99 3.99 0 0 0 1.491 3.315 3.333 3.333 0 0 0 2.937.512c1.19-.345 2.169-1.557 3.4-3.081 1.349-1.658 3.151-3.826 4.538-3.826 1.813 0 1.835 1.123 1.958 1.991-4.2.712-5.984 4.082-5.984 5.973A3.513 3.513 0 0 0 14.247 22c1.813 0 4.772-1.479 5.217-6.785H22.2v-2.781h-2.747c-.167-1.834-1.213-4.672-4.483-4.672-2.5 0-4.65 2.125-5.495 3.159-.645.812-2.291 2.759-2.547 3.026-.278.334-.756.934-1.235.934-.5 0-.8-.923-.4-2.136A20.3 20.3 0 0 1 7.35 8.83 5.892 5.892 0 0 0 8.8 5.181 2.93 2.93 0 0 0 6 2a4.851 4.851 0 0 0-3.021 1.39c-.4.4-.734.734-.979 1.034l1.947 1.903ZM14.28 19.3a.835.835 0 0 1-.823-.8c0-.667.812-2.447 3.192-3.07-.333 2.988-1.59 3.87-2.369 3.87Z"
        fill={props.fillColor}
      />
    </g>
    <defs>
      <clipPath id="b">
        <path
          fill={props.fillColor}
          transform="translate(2 2)"
          d="M0 0h20.2v20H0z"
        />
      </clipPath>
    </defs>
  </svg>
);

export default MobileWhiteBoardIcon;
