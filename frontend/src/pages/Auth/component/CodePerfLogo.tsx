import React from "react";

export const CodePerfLogo: React.FC<{ size?: number; className?: string }> = ({ size = 28, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 2L3 7.2V16.8L12 22L21 16.8V7.2L12 2Z"
        stroke="#FF6C37"
        strokeWidth="2"
        fill="#2A2A2A"
      />
      <path
        d="M9 8.5L6.5 12L9 15.5M15 8.5L17.5 12L15 15.5"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
