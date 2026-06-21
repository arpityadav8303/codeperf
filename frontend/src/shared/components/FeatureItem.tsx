import React from "react";
import { type LucideIcon } from "lucide-react";
import "../../styles/signup.css";

interface FeatureItemProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const FeatureItem: React.FC<FeatureItemProps> = ({ title, description, icon: Icon }) => {
  return (
    <div className="flex gap-4 items-start text-left">
      <div className="signup-feature-badge">
        <Icon size={20} />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-(--signup-text-h) mb-0.5">
          {title}
        </h4>
        <p className="text-xs text-[#A6A6A6] leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};