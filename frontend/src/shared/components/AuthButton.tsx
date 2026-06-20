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
          ? "bg-(--accent) border-(--accent) text-white hover:bg-(--accent-hover) active:scale-[0.99] shadow-md shadow-indigo-900/20"
          : "bg-transparent border-(--border) text-(--text-h) hover:bg-slate-900 active:scale-[0.99]"
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