import React, { useState } from "react";
import { Plus, X, GitBranch, Hash, Key } from "lucide-react";
import type { MultiRepositoryFormData } from "../types/index.js";

interface MultiRepositoryFormProps {
  onSubmit: (data: MultiRepositoryFormData) => void;
  isLoading?: boolean;
  className?: string;
}

const MultiRepositoryForm: React.FC<MultiRepositoryFormProps> = ({
  onSubmit,
  isLoading = false,
  className = "",
}) => {
  const [repositories, setRepositories] = useState<string[]>([""]);
  const [branch, setBranch] = useState("");
  const [limit, setLimit] = useState(20);
  const [token, setToken] = useState("");

  const addRepository = () => {
    setRepositories([...repositories, ""]);
  };

  const removeRepository = (index: number) => {
    if (repositories.length > 1) {
      setRepositories(repositories.filter((_, i) => i !== index));
    }
  };

  const updateRepository = (index: number, value: string) => {
    const updated = [...repositories];
    updated[index] = value;
    setRepositories(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validRepositories = repositories.filter((repo) => repo.trim() !== "");
    if (validRepositories.length === 0) {
      return;
    }

    onSubmit({
      repositories: validRepositories,
      branch: branch.trim() || undefined,
      limit: limit || 20,
      token: token.trim() || undefined,
    });
  };

  const isValidRepository = (repo: string) => {
    return /^[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+$/.test(repo.trim());
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {/* Repository List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-black-100">
            Repositories
          </label>
          <button
            type="button"
            onClick={addRepository}
            className="btn-secondary text-sm flex items-center space-x-1"
            disabled={isLoading}
          >
            <Plus className="h-4 w-4" />
            <span>Add Repository</span>
          </button>
        </div>

        <div className="space-y-3">
          {repositories.map((repo, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={repo}
                  onChange={(e) => updateRepository(index, e.target.value)}
                  placeholder="owner/repository (e.g., microsoft/vscode)"
                  className={`input-field pr-10 ${
                    repo && !isValidRepository(repo)
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                  disabled={isLoading}
                />
                {repo && !isValidRepository(repo) && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  </div>
                )}
              </div>
              {repositories.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRepository(index)}
                  className="p-2 text-red-400 hover:text-red-300 transition-colors duration-200"
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {repositories.some((repo) => repo && !isValidRepository(repo)) && (
          <p className="text-sm text-red-400">
            Repository names should be in the format "owner/repository"
          </p>
        )}
      </div>

      {/* Branch */}
      <div>
        <label className="block text-sm font-medium text-black-100 mb-2">
          <GitBranch className="h-4 w-4 inline mr-2" />
          Branch (optional)
        </label>
        <input
          type="text"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          placeholder="main, master, develop..."
          className="input-field"
          disabled={isLoading}
        />
      </div>

      {/* Limit */}
      <div>
        <label className="block text-sm font-medium text-black-100 mb-2">
          <Hash className="h-4 w-4 inline mr-2" />
          Commit Limit
        </label>
        <input
          type="number"
          value={limit}
          onChange={(e) => setLimit(parseInt(e.target.value) || 20)}
          min="1"
          max="100"
          className="input-field"
          disabled={isLoading}
        />
      </div>

      {/* Token */}
      <div>
        <label className="block text-sm font-medium text-black-100 mb-2">
          <Key className="h-4 w-4 inline mr-2" />
          GitHub Token (optional)
        </label>
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
          className="input-field"
          disabled={isLoading}
        />
        <p className="text-xs text-muted mt-1">
          Required for private repositories and higher rate limits
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={
          isLoading ||
          repositories.filter((repo) => repo.trim() !== "").length === 0 ||
          repositories.some((repo) => repo && !isValidRepository(repo))
        }
        className="btn-primary w-full flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Analyzing Repositories...</span>
          </>
        ) : (
          <>
            <span>
              Analyze {repositories.filter((repo) => repo.trim() !== "").length}{" "}
              Repository
              {repositories.filter((repo) => repo.trim() !== "").length !== 1
                ? "ies"
                : ""}
            </span>
          </>
        )}
      </button>
    </form>
  );
};

export default MultiRepositoryForm;
