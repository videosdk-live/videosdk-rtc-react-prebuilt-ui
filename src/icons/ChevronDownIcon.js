import * as React from "react";

const ChevronDownIcon = (props) => (
    <svg
        width={20}
        height={20}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            stroke={props.stroke || "currentColor"}
        />
    </svg>
);

export default ChevronDownIcon;