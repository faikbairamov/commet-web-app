import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className,
  text,
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center space-y-3",
        className
      )}
    >
      <div className="relative">
        {/* Outer ring */}
        <div
          className={cn(
            "animate-spin rounded-full border-2 border-muted",
            sizeClasses[size]
          )}
        />
        {/* Inner ring */}
        <div
          className={cn(
            "absolute top-0 left-0 animate-spin rounded-full border-2 border-transparent border-t-primary",
            sizeClasses[size]
          )}
          style={{ animationDirection: "reverse", animationDuration: "0.8s" }}
        />
        {/* Center dot */}
        <div
          className={cn(
            "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary",
            size === "sm"
              ? "h-1 w-1"
              : size === "md"
              ? "h-1.5 w-1.5"
              : "h-2 w-2"
          )}
        />
      </div>
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
