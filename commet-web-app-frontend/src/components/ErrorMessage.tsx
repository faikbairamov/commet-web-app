import React from "react";
import { AlertTriangle, RotateCcw, X } from "lucide-react";
import type { ErrorMessageProps } from "../types/index.js";

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  onRetry,
  onDismiss,
  className = "",
}) => {
  return (
    <div
      className={`bg-destructive/10 border border-destructive/20 rounded-lg p-4 animate-fade-in ${className}`}
    >
      <div className="flex items-start">
        <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-destructive">
            Something went wrong
          </h3>
          <p className="mt-1 text-sm text-destructive/80">{error}</p>
          {(onRetry || onDismiss) && (
            <div className="mt-3 flex space-x-2">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="inline-flex items-center px-3 py-2 border border-destructive/20 text-sm font-medium rounded-md text-destructive bg-destructive/10 hover:bg-destructive/20 focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2 focus:ring-offset-background transition-all duration-200"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Try Again
                </button>
              )}
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="inline-flex items-center px-3 py-2 border border-border text-sm font-medium rounded-md text-muted-foreground bg-muted hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200"
                >
                  <X className="h-4 w-4 mr-2" />
                  Dismiss
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
