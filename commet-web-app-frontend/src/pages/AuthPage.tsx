import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GitHubAuth from "../components/GitHubAuth";
import { useApp } from "../contexts/AppContext";
import ApiService from "../services/api";

const AuthPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    setAccessToken,
    setError,
    clearError,
    setAuthenticatedUser,
    setUserRepositories,
    setLoading,
  } = useApp();
  const hasProcessedCallback = useRef(false);

  useEffect(() => {
    // Prevent infinite loop by checking if we've already processed this callback
    if (hasProcessedCallback.current) {
      return;
    }

    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const errorMessage = params.get("message");

    if (token) {
      hasProcessedCallback.current = true;
      handleAuthSuccess(token);
      navigate("/auth", { replace: true }); // Clean the URL
    } else if (errorMessage) {
      hasProcessedCallback.current = true;
      setError(errorMessage);
      navigate("/auth", { replace: true }); // Clean the URL
    }
  }, [location.search]); // Only depend on location.search

  const handleAuthSuccess = async (accessToken: string) => {
    try {
      setLoading(true);
      clearError();

      // Store the access token
      setAccessToken(accessToken);

      // Get user information
      const userInfo = await ApiService.getCurrentUser(accessToken);
      setAuthenticatedUser(userInfo);

      // Get user repositories
      const reposResponse = await ApiService.getUserRepositories(accessToken);
      setUserRepositories(reposResponse.repositories);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch user data"
      );
      setAccessToken(null); // Clear invalid token
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            GitHub Authentication
          </h1>
          <p className="text-gray-300 text-lg">
            Connect your GitHub account to access your repositories and get
            personalized insights.
          </p>
        </div>

        <GitHubAuth />

        <div className="mt-12 bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            What you get with GitHub authentication
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">
                🔐 Secure Access
              </h3>
              <p className="text-gray-300 text-sm">
                Access your private repositories securely using GitHub OAuth. No
                need to manage tokens manually.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">
                📊 Repository Insights
              </h3>
              <p className="text-gray-300 text-sm">
                Get AI-powered analysis of your repositories, commit patterns,
                and development activity.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">
                🚀 Easy Selection
              </h3>
              <p className="text-gray-300 text-sm">
                Browse and select from all your repositories with search and
                filtering capabilities.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">
                🔄 Real-time Data
              </h3>
              <p className="text-gray-300 text-sm">
                Always get the latest repository information and commit data
                directly from GitHub.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
