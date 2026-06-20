import React, { forwardRef, useId, useState } from "react";
import { type LucideIcon, Eye, EyeOff } from "lucide-react";
import "../../styles/signup.css"; // Point cleanly to your isolated CSS path

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon: LucideIcon;
  labelRight?: React.ReactNode;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, icon: Icon, type = "text", labelRight, ...props }, ref) => {
    const inputId = useId();
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="w-full flex flex-col gap-1 text-left signup-animate-fade">
        <div className="flex justify-between items-center">
          <label 
            htmlFor={inputId} 
            className="auth-label"
          >
            {label}
          </label>
          {labelRight}
        </div>
        
        <div className="relative w-full flex items-center">
          {/* Prefix Visual Vector Wrapper */}
          <div className="absolute left-3.5 text-slate-500 pointer-events-none">
            <Icon size={18} />
          </div>

          <input
            id={inputId}
            ref={ref}
            type={inputType}
            className={`auth-input-field ${error ? "auth-input-field-error" : ""}`}
            {...props}
          />

          {/* Right Action Trigger view toggle */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer bg-transparent border-0 outline-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>

        {error && (
          <span className="text-xs text-red-400 font-medium mt-0.5">
            {error}
          </span>
        )}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";