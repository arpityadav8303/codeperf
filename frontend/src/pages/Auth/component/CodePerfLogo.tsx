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
      {/* Outer hexagon */}
      <path
        d="M12 2L3 7.2V16.8L12 22L21 16.8V7.2L12 2Z"
        stroke="url(#logo-gradient)"
        strokeWidth="2"
        fill="rgba(59, 130, 246, 0.15)"
      />
      {/* Inner design representing complexity brackets */}
      <path
        d="M9 8.5L6.5 12L9 15.5M15 8.5L17.5 12L15 15.5"
        stroke="#60a5fa"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="logo-gradient" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3b82f6" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
    </svg>
  );
};
