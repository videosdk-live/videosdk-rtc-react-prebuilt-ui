import * as React from "react";

function CopyIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={14.365}
      height={16.633}
      viewBox="0 0 14.365 16.633"
      {...props}
    >
      <path
        data-name="Path 5718"
        d="M10.585 0H1.512A1.517 1.517 0 000 1.512V12.1h1.512V1.512h9.072zm2.265 3.024H4.536a1.517 1.517 0 00-1.512 1.512v10.585a1.517 1.517 0 001.512 1.512h8.314a1.517 1.517 0 001.512-1.512V4.536a1.517 1.517 0 00-1.512-1.512zm0 12.1H4.536V4.536h8.314z"
        fill={props.fill || "#1c1f2e"}
      />
    </svg>
  );
}

export default CopyIcon;
