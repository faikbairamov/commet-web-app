import React, { useState } from "react";
import type { TokenFormData } from "../types/index.js";
import { useApp } from "../contexts/AppContext";
import { useGithubToken, useAppSettings } from "../hooks/useLocalStorage";
import TokenForm from "../components/TokenForm";
import ErrorMessage from "../components/ErrorMessage";
import GitHubAuth from "../components/GitHubAuth";
import {
  Settings,
  Key,
  Trash2,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Shield,
  LogOut,
  Github,
  ExternalLink,
  Info,
} from "lucide-react";

const SettingsPage: React.FC = () => {
  const { state, setGithubToken, setError, clearError } = useApp();
  const {
    token,
    setGithubToken: setToken,
    clearGithubToken,
    isValidToken,
  } = useGithubToken();
  const { settings, updateSetting, resetSettings } = useAppSettings();
  const [isLoading, setIsLoading] = useState(false);
  const [showTokenForm, setShowTokenForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleTokenSubmit = async (formData: TokenFormData) => {
    try {
      setIsLoading(true);
      clearError();

      // Validate token format
      if (!isValidToken(formData.token)) {
        setError("Invalid GitHub token format");
        return;
      }

      // Save token
      setToken(formData.token);
      setGithubToken(formData.token);

      setSuccessMessage("GitHub token saved successfully!");
      setShowTokenForm(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save token");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveToken = () => {
    if (
      window.confirm(
        "Are you sure you want to remove your GitHub token? This will limit access to public repositories only."
      )
    ) {
      clearGithubToken();
      setGithubToken(null);
      setSuccessMessage("GitHub token removed successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleResetSettings = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all settings to default values?"
      )
    ) {
      resetSettings();
      setSuccessMessage("Settings reset to default values!");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to sign out of GitHub?")) {
      try {
        const { default: api } = await import("../services/api");
        await api.logout();
        // The AppContext will handle clearing the user data
        window.location.reload();
      } catch (error) {
        setError("Failed to logout. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Settings className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Settings</h1>
              <p className="text-lg text-muted-foreground mt-2">
                Manage your GitHub authentication, preferences, and application
                settings
              </p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-900/20 border border-green-700 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
              <p className="text-green-300">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {state.error && (
          <ErrorMessage
            error={state.error}
            onRetry={clearError}
            className="mb-6"
          />
        )}

        <div className="space-y-8">
          {/* GitHub Authentication Section */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Github className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">
                  GitHub Authentication
                </h2>
              </div>
              {state.authenticatedUser && (
                <div className="flex items-center space-x-2 text-sm text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  <span>OAuth Connected</span>
                </div>
              )}
            </div>

            {state.authenticatedUser ? (
              <div className="space-y-6">
                {/* User Info */}
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={state.authenticatedUser.avatar_url}
                      alt={state.authenticatedUser.login}
                      className="w-12 h-12 rounded-full border-2 border-border"
                    />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-foreground">
                        {state.authenticatedUser.name ||
                          state.authenticatedUser.login}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        @{state.authenticatedUser.login}
                      </p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                        <span>
                          {state.authenticatedUser.public_repos} repos
                        </span>
                        <span>
                          {state.authenticatedUser.followers} followers
                        </span>
                        <span>
                          {state.authenticatedUser.following} following
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <a
                        href={state.authenticatedUser.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <button
                        onClick={handleLogout}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-green-300 mb-2">
                    Benefits of OAuth authentication:
                  </h4>
                  <ul className="text-sm text-green-200 space-y-1 list-disc list-inside">
                    <li>
                      Access to all your repositories (public and private)
                    </li>
                    <li>Higher rate limits (5,000 requests/hour)</li>
                    <li>Secure authentication without storing tokens</li>
                    <li>Automatic token refresh</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-300">
                        Not authenticated with GitHub
                      </h4>
                      <p className="text-sm text-yellow-200 mt-1">
                        Sign in with GitHub to access all features and your
                        repositories.
                      </p>
                    </div>
                  </div>
                </div>

                <GitHubAuth />
              </div>
            )}
          </div>

          {/* Legacy Token Section (for users who prefer manual tokens) */}
          {!state.authenticatedUser && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Key className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">
                    GitHub Personal Access Token
                  </h2>
                </div>
                {token && (
                  <div className="flex items-center space-x-2 text-sm text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    <span>Token configured</span>
                  </div>
                )}
              </div>

              {token ? (
                <div className="space-y-4">
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-foreground">
                          Current Token
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {token.substring(0, 8)}...
                          {token.substring(token.length - 4)}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setShowTokenForm(true)}
                          className="btn-secondary text-sm"
                        >
                          Update
                        </button>
                        <button
                          onClick={handleRemoveToken}
                          className="btn-secondary text-sm text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-300 mb-2">
                      Token benefits:
                    </h4>
                    <ul className="text-sm text-blue-200 space-y-1 list-disc list-inside">
                      <li>Access to private repositories</li>
                      <li>
                        Higher rate limits (5,000 requests/hour vs 60/hour)
                      </li>
                      <li>Better performance and reliability</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3" />
                      <div>
                        <h4 className="text-sm font-medium text-yellow-300">
                          No GitHub token configured
                        </h4>
                        <p className="text-sm text-yellow-200 mt-1">
                          You can only access public repositories without a
                          token.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowTokenForm(true)}
                    className="btn-primary"
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Add GitHub Token
                  </button>
                </div>
              )}

              {/* Token Form Modal */}
              {showTokenForm && (
                <div className="mt-6 pt-6 border-t border-border">
                  <TokenForm
                    onSubmit={handleTokenSubmit}
                    onCancel={() => setShowTokenForm(false)}
                    isLoading={isLoading}
                  />
                </div>
              )}
            </div>
          )}

          {/* Application Settings */}
          <div className="card p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Settings className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                Application Settings
              </h2>
            </div>

            <div className="space-y-6">
              {/* Default Branch */}
              <div>
                <label
                  htmlFor="defaultBranch"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Default Branch
                </label>
                <input
                  type="text"
                  id="defaultBranch"
                  value={settings.defaultBranch}
                  onChange={(e) =>
                    updateSetting("defaultBranch", e.target.value)
                  }
                  className="input-field max-w-xs"
                  placeholder="main"
                />
              </div>

              {/* Default Commit Limit */}
              <div>
                <label
                  htmlFor="defaultLimit"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Default Commit Limit
                </label>
                <input
                  type="number"
                  id="defaultLimit"
                  value={settings.defaultCommitLimit}
                  onChange={(e) =>
                    updateSetting(
                      "defaultCommitLimit",
                      parseInt(e.target.value) || 20
                    )
                  }
                  min="1"
                  max="100"
                  className="input-field max-w-xs"
                />
              </div>

              {/* Show File Changes */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-foreground">
                    Show File Changes
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Display detailed file changes in commit views
                  </p>
                </div>
                <button
                  onClick={() =>
                    updateSetting("showFileChanges", !settings.showFileChanges)
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    settings.showFileChanges ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      settings.showFileChanges
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Auto Refresh */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-foreground">
                    Auto Refresh
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Automatically refresh data at intervals
                  </p>
                </div>
                <button
                  onClick={() =>
                    updateSetting("autoRefresh", !settings.autoRefresh)
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    settings.autoRefresh ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      settings.autoRefresh ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Refresh Interval */}
              {settings.autoRefresh && (
                <div>
                  <label
                    htmlFor="refreshInterval"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Refresh Interval (seconds)
                  </label>
                  <input
                    type="number"
                    id="refreshInterval"
                    value={settings.refreshInterval / 1000}
                    onChange={(e) =>
                      updateSetting(
                        "refreshInterval",
                        (parseInt(e.target.value) || 30) * 1000
                      )
                    }
                    min="10"
                    max="300"
                    className="input-field max-w-xs"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Data & Privacy */}
          <div className="card p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                Data & Privacy
              </h2>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-300 mb-2">
                      Data Storage
                    </h4>
                    <p className="text-sm text-blue-200">
                      Your GitHub authentication tokens and settings are stored
                      locally in your browser. No data is sent to external
                      servers except for GitHub API requests.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-foreground">
                    Clear Local Data
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Remove all stored tokens and settings from your browser
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "This will clear all local data including tokens and settings. Continue?"
                      )
                    ) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                  className="btn-secondary text-destructive hover:text-destructive/80"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Data
                </button>
              </div>
            </div>
          </div>

          {/* Reset Settings */}
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-foreground">
                  Reset Settings
                </h3>
                <p className="text-sm text-muted-foreground">
                  Reset all application settings to their default values
                </p>
              </div>
              <button
                onClick={handleResetSettings}
                className="btn-secondary text-destructive hover:text-destructive/80"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
