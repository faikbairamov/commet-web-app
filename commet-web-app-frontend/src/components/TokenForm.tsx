import React, { useState } from "react";
import { Key, Eye, EyeOff, AlertTriangle, CheckCircle } from "lucide-react";
import type { TokenFormData } from "../types/index.js";
import ApiService from "../services/api";

interface TokenFormProps {
  onSubmit: (data: TokenFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  className?: string;
}

const TokenForm: React.FC<TokenFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
  className = "",
}) => {
  const [formData, setFormData] = useState<TokenFormData>({
    token: "",
  });
  const [showToken, setShowToken] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.token) {
      newErrors.token = "GitHub token is required";
    } else if (!ApiService.validateTokenFormat(formData.token)) {
      newErrors.token =
        "Invalid GitHub token format. Token should start with ghp_, gho_, ghu_, ghs_, or ghr_";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (value: string) => {
    setFormData({ token: value });
    // Clear error when user starts typing
    if (errors.token) {
      setErrors({});
    }
  };

  const isValidToken =
    formData.token && ApiService.validateTokenFormat(formData.token);

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {/* Token input */}
      <div>
        <label
          htmlFor="token"
          className="block text-sm font-medium text-foreground mb-2"
        >
          GitHub Personal Access Token
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Key className="h-5 w-5 text-muted-foreground" />
          </div>
          <input
            type={showToken ? "text" : "password"}
            id="token"
            value={formData.token}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
            className={`input-field pl-10 pr-10 ${
              errors.token
                ? "border-red-500 focus:ring-red-500"
                : isValidToken
                ? "border-green-500 focus:ring-green-500"
                : ""
            }`}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowToken(!showToken)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showToken ? (
              <EyeOff className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            ) : (
              <Eye className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            )}
          </button>
        </div>

        {/* Validation feedback */}
        {errors.token && (
          <p className="mt-1 text-sm text-destructive flex items-center">
            <AlertTriangle className="h-4 w-4 mr-1" />
            {errors.token}
          </p>
        )}
        {isValidToken && (
          <p className="mt-1 text-sm text-green-400 flex items-center">
            <CheckCircle className="h-4 w-4 mr-1" />
            Valid token format
          </p>
        )}
      </div>

      {/* Help text */}
      <div className="bg-blue-50 /20 border border-blue-200  rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800  mb-2">
          How to get a GitHub token:
        </h4>
        <ol className="text-sm text-blue-700  space-y-1 list-decimal list-inside">
          <li>
            Go to GitHub Settings → Developer settings → Personal access tokens
          </li>
          <li>Click "Generate new token (classic)"</li>
          <li>
            Select scopes:{" "}
            <code className="bg-blue-100  px-1 rounded">repo</code> (for private
            repos) or{" "}
            <code className="bg-blue-100  px-1 rounded">public_repo</code> (for
            public repos)
          </li>
          <li>Copy the generated token and paste it here</li>
        </ol>
      </div>

      {/* Benefits */}
      <div className="bg-green-50 /20 border border-green-200  rounded-lg p-4">
        <h4 className="text-sm font-medium text-green-800  mb-2">
          Benefits of using a token:
        </h4>
        <ul className="text-sm text-green-700  space-y-1 list-disc list-inside">
          <li>Access to private repositories</li>
          <li>Higher rate limits (5,000 requests/hour vs 60/hour)</li>
          <li>Better performance and reliability</li>
        </ul>
      </div>

      {/* Action buttons */}
      <div className="flex space-x-3">
        <button
          type="submit"
          disabled={isLoading || !isValidToken}
          className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Saving..." : "Save Token"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
            disabled={isLoading}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TokenForm;
