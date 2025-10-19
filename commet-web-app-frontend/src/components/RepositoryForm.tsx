import React, { useState } from "react";
import { Search, Key, Code2, AlertTriangle } from "lucide-react";
import type { RepositoryFormData } from "../types/index.js";
import ApiService from "../services/api";

interface RepositoryFormProps {
  onSubmit: (data: RepositoryFormData) => void;
  isLoading?: boolean;
  className?: string;
}

const RepositoryForm: React.FC<RepositoryFormProps> = ({
  onSubmit,
  isLoading = false,
  className = "",
}) => {
  const [formData, setFormData] = useState<RepositoryFormData>({
    repository: "",
    branch: "",
    limit: 20,
    token: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Validate repository format
    if (!formData.repository) {
      newErrors.repository = "Repository is required";
    } else if (!ApiService.validateRepositoryFormat(formData.repository)) {
      newErrors.repository = 'Repository must be in format "owner/repo"';
    }

    // Validate limit
    if (formData.limit && (formData.limit < 1 || formData.limit > 100)) {
      newErrors.limit = "Limit must be between 1 and 100";
    }

    // Validate token if provided
    if (formData.token && !ApiService.validateTokenFormat(formData.token)) {
      newErrors.token = "Invalid GitHub token format";
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

  const handleInputChange = (
    field: keyof RepositoryFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {/* Repository input */}
      <div>
        <label
          htmlFor="repository"
          className="block text-sm font-medium text-gray-700  mb-2"
        >
          Repository
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Code2 className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            id="repository"
            value={formData.repository}
            onChange={(e) => handleInputChange("repository", e.target.value)}
            placeholder="owner/repository (e.g., microsoft/vscode)"
            className={`input-field pl-10 ${
              errors.repository ? "border-red-500 focus:ring-red-500" : ""
            }`}
            disabled={isLoading}
          />
        </div>
        {errors.repository && (
          <p className="mt-1 text-sm text-red-600  flex items-center">
            <AlertTriangle className="h-4 w-4 mr-1" />
            {errors.repository}
          </p>
        )}
      </div>

      {/* Branch input */}
      <div>
        <label
          htmlFor="branch"
          className="block text-sm font-medium text-gray-700  mb-2"
        >
          Branch (optional)
        </label>
        <input
          type="text"
          id="branch"
          value={formData.branch}
          onChange={(e) => handleInputChange("branch", e.target.value)}
          placeholder="main, develop, feature-branch..."
          className="input-field"
          disabled={isLoading}
        />
      </div>

      {/* Limit input */}
      <div>
        <label
          htmlFor="limit"
          className="block text-sm font-medium text-gray-700  mb-2"
        >
          Number of commits
        </label>
        <input
          type="number"
          id="limit"
          value={formData.limit}
          onChange={(e) =>
            handleInputChange("limit", parseInt(e.target.value) || 20)
          }
          min="1"
          max="100"
          className={`input-field ${
            errors.limit ? "border-red-500 focus:ring-red-500" : ""
          }`}
          disabled={isLoading}
        />
        {errors.limit && (
          <p className="mt-1 text-sm text-red-600  flex items-center">
            <AlertTriangle className="h-4 w-4 mr-1" />
            {errors.limit}
          </p>
        )}
      </div>

      {/* Token input */}
      <div>
        <label
          htmlFor="token"
          className="block text-sm font-medium text-gray-700  mb-2"
        >
          GitHub Token (optional)
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Key className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="password"
            id="token"
            value={formData.token}
            onChange={(e) => handleInputChange("token", e.target.value)}
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
            className={`input-field pl-10 ${
              errors.token ? "border-red-500 focus:ring-red-500" : ""
            }`}
            disabled={isLoading}
          />
        </div>
        {errors.token && (
          <p className="mt-1 text-sm text-red-600  flex items-center">
            <AlertTriangle className="h-4 w-4 mr-1" />
            {errors.token}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500 ">
          Required for private repositories. Higher rate limits with token.
        </p>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            <Search className="h-4 w-4" />
            <span>Analyze Repository</span>
          </>
        )}
      </button>
    </form>
  );
};

export default RepositoryForm;
