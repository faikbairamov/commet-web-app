import React from "react";
import { useApp } from "../contexts/AppContext";
import ApiService from "../services/api";
import { Github, LogOut, FolderOpen } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

interface GitHubAuthProps {
  className?: string;
}

const GitHubAuth: React.FC<GitHubAuthProps> = ({ className = "" }) => {
  const {
    state,
    setLoading,
    setError,
    clearError,
    setAuthenticatedUser,
    setAccessToken,
    setUserRepositories,
  } = useApp();

  // OAuth callback handling is now done in AuthPage component

  const handleGitHubLogin = async () => {
    try {
      setLoading(true);
      clearError();

      const authResponse = await ApiService.initiateGitHubLogin();
      window.location.href = authResponse.auth_url;
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to initiate GitHub login"
      );
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      clearError();

      await ApiService.logout();
      setAuthenticatedUser(null);
      setAccessToken(null);
      setUserRepositories([]);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to logout");
    } finally {
      setLoading(false);
    }
  };

  if (state.isLoading && !state.authenticatedUser) {
    return (
      <div className={`flex justify-center items-center p-8 ${className}`}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (state.authenticatedUser) {
    return (
      <div className={`space-y-4 ${className}`}>
        {/* User Info */}
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="flex items-center space-x-4">
            <img
              src={state.authenticatedUser.avatar_url}
              alt={
                state.authenticatedUser.name || state.authenticatedUser.login
              }
              className="w-12 h-12 rounded-full"
            />
            <div className="flex-1">
              <h3 className="text-lg font-medium text-white">
                {state.authenticatedUser.name || state.authenticatedUser.login}
              </h3>
              <p className="text-gray-400 text-sm">
                @{state.authenticatedUser.login}
              </p>
              {state.authenticatedUser.bio && (
                <p className="text-gray-300 text-sm mt-1">
                  {state.authenticatedUser.bio}
                </p>
              )}
            </div>
            <button
              onClick={handleLogout}
              disabled={state.isLoading}
              className="flex items-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white text-sm rounded-md transition-colors duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* User Stats */}
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-700">
            <div className="text-center">
              <div className="text-white font-medium">
                {state.authenticatedUser.public_repos}
              </div>
              <div className="text-gray-400 text-sm">Repositories</div>
            </div>
            <div className="text-center">
              <div className="text-white font-medium">
                {state.authenticatedUser.followers}
              </div>
              <div className="text-gray-400 text-sm">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-white font-medium">
                {state.authenticatedUser.following}
              </div>
              <div className="text-gray-400 text-sm">Following</div>
            </div>
          </div>
        </div>

        {/* Repositories */}
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <FolderOpen className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-medium text-white">
              Your Repositories
            </h3>
            <span className="text-gray-400 text-sm">
              ({state.userRepositories.length})
            </span>
          </div>

          {state.userRepositories.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No repositories found
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {state.userRepositories.slice(0, 10).map((repo) => (
                <div
                  key={repo.id}
                  className="bg-gray-800 rounded-md p-3 hover:bg-gray-700 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-white font-medium">{repo.name}</h4>
                        {repo.is_private && (
                          <span className="text-xs bg-yellow-600 text-white px-2 py-1 rounded">
                            Private
                          </span>
                        )}
                      </div>
                      {repo.description && (
                        <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                          {repo.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        {repo.language && <span>{repo.language}</span>}
                        <span>⭐ {repo.stars}</span>
                        <span>🍴 {repo.forks}</span>
                        <span>👁️ {repo.watchers}</span>
                      </div>
                    </div>
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      View
                    </a>
                  </div>
                </div>
              ))}
              {state.userRepositories.length > 10 && (
                <div className="text-center text-gray-400 text-sm">
                  And {state.userRepositories.length - 10} more repositories...
                </div>
              )}
            </div>
          )}
        </div>

        {state.error && (
          <ErrorMessage error={state.error} onRetry={clearError} />
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="bg-gray-900 rounded-lg p-6 text-center">
        <Github className="w-16 h-16 text-white mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">
          Sign in with GitHub
        </h2>
        <p className="text-gray-300 mb-6">
          Connect your GitHub account to access your repositories and get
          personalized insights.
        </p>

        <button
          onClick={handleGitHubLogin}
          disabled={state.isLoading}
          className="w-full bg-gray-800 hover:bg-gray-700 disabled:bg-gray-600 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          {state.isLoading ? (
            <>
              <LoadingSpinner size="sm" />
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <Github className="w-5 h-5" />
              <span>Sign in with GitHub</span>
            </>
          )}
        </button>
      </div>

      {state.error && <ErrorMessage error={state.error} onRetry={clearError} />}
    </div>
  );
};

export default GitHubAuth;
