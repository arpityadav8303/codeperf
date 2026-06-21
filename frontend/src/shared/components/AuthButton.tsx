import React from "react";

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "social";
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  children,
  isLoading,
  variant = "primary",
  disabled,
  className = "",
  ...props
}) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={`w-full py-3 px-4 rounded-lg font-medium text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer border ${
        variant === "primary"
          ? "bg-[#FF6C37] border-[#FF6C37] text-white hover:bg-[#E05A2B] hover:border-[#E05A2B] active:scale-[0.99]"
          : "bg-transparent border-[#4A4A4A] text-white hover:bg-[#282828] hover:border-[#5A5A5A] active:scale-[0.99]"
      } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${className}`}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
};