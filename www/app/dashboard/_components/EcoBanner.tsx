"use client";

import React from "react";
import { mdiLeaf, mdiRecycle, mdiEarth, mdiSprout, mdiTree } from "@mdi/js";
import Icon from "../../_components/Icon";

interface EcoBannerProps {
  type?: "info" | "success" | "warning" | "tip";
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const EcoBanner = ({ type = "info", title, children, className = "" }: EcoBannerProps) => {
  const getBannerConfig = () => {
    switch (type) {
      case "success":
        return {
          icon: mdiSprout,
          bgColor: "bg-gradient-to-r from-green-50 to-lime-50",
          borderColor: "border-green-200",
          textColor: "text-green-700",
          iconColor: "text-green-600",
          emoji: "🌱"
        };
      case "warning":
        return {
          icon: mdiTree,
          bgColor: "bg-gradient-to-r from-yellow-50 to-orange-50",
          borderColor: "border-yellow-200",
          textColor: "text-yellow-700",
          iconColor: "text-yellow-600",
          emoji: "🌿"
        };
      case "tip":
        return {
          icon: mdiRecycle,
          bgColor: "bg-gradient-to-r from-blue-50 to-cyan-50",
          borderColor: "border-blue-200",
          textColor: "text-blue-700",
          iconColor: "text-blue-600",
          emoji: "♻️"
        };
      default:
        return {
          icon: mdiEarth,
          bgColor: "bg-gradient-to-r from-green-50 to-blue-50",
          borderColor: "border-green-200",
          textColor: "text-green-700",
          iconColor: "text-green-600",
          emoji: "🌍"
        };
    }
  };

  const config = getBannerConfig();

  return (
    <div className={`p-4 rounded-lg border ${config.bgColor} ${config.borderColor} ${className} eco-hover-lift`}>
      <div className="flex items-start space-x-3">
        <div className={`flex-shrink-0 ${config.iconColor}`}>
          <Icon path={config.icon} size="24" />
        </div>
        <div className="flex-1">
          {title && (
            <h3 className={`text-lg font-semibold ${config.textColor} mb-2`}>
              {config.emoji} {title}
            </h3>
          )}
          <div className={`${config.textColor} text-sm leading-relaxed`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcoBanner; 