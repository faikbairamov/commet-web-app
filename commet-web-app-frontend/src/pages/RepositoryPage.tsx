import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import type {
  Repository,
  CommitsResponse,
  UserRepository,
} from "../types/index.js";
import { useApp } from "../contexts/AppContext";
import RepositorySelector from "../components/RepositorySelector";
import RepositoryCard from "../components/RepositoryCard";
import CommitCard from "../components/CommitCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import GitHubAuth from "../components/GitHubAuth";
import { BarChart3, X, GitBranch, RotateCcw } from "lucide-react";
import { formatNumber } from "../utils";

interface RepositoryWithCommits {
  repository: Repository;
  commits: CommitsResponse | null;
  isLoading: boolean;
  error: string | null;
}

const RepositoryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { state } = useApp();
  const [repositories, setRepositories] = useState<RepositoryWithCommits[]>([]);
  const [selectedRepositories, setSelectedRepositories] = useState<
    UserRepository[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [commitsLimit, setCommitsLimit] = useState(20);
  const hasInitialized = useRef(false);

  // Get initial values from URL params
  const initialRepos = searchParams.get("repos")?.split(",") || [];
  const initialBranch = searchParams.get("branch") || "";
  const initialLimit = parseInt(searchParams.get("limit") || "20");

  // Find initial repositories from user's repos if available
  useEffect(() => {
    if (
      initialRepos.length > 0 &&
      state.userRepositories.length > 0 &&
      !hasInitialized.current
    ) {
      const repos = state.userRepositories.filter((r) =>
        initialRepos.includes(r.full_name)
      );
      if (repos.length > 0) {
        setSelectedRepositories(repos);
        setSelectedBranch(initialBranch || repos[0]?.default_branch || "");
        setCommitsLimit(initialLimit);
        hasInitialized.current = true;
      }
    }
  }, [
    initialRepos,
    initialBranch,
    initialLimit,
    state.userRepositories.length,
  ]);

  const handleRepositoryAdd = async (repository: UserRepository) => {
    // Check if repository is already selected
    if (
      selectedRepositories.some((r) => r.full_name === repository.full_name)
    ) {
      return;
    }

    const newSelectedRepos = [...selectedRepositories, repository];
    setSelectedRepositories(newSelectedRepos);

    // Update URL params
    const newParams = new URLSearchParams();
    newParams.set("repos", newSelectedRepos.map((r) => r.full_name).join(","));
    if (selectedBranch) newParams.set("branch", selectedBranch);
    newParams.set("limit", commitsLimit.toString());
    setSearchParams(newParams);

    // Fetch data for the new repository
    await fetchRepositoryData(repository);
  };

  const handleRepositoryRemove = (repository: UserRepository) => {
    const newSelectedRepos = selectedRepositories.filter(
      (r) => r.full_name !== repository.full_name
    );
    setSelectedRepositories(newSelectedRepos);

    // Remove from repositories state
    setRepositories((prev) =>
      prev.filter((r) => r.repository.full_name !== repository.full_name)
    );

    // Update URL params
    const newParams = new URLSearchParams();
    if (newSelectedRepos.length > 0) {
      newParams.set(
        "repos",
        newSelectedRepos.map((r) => r.full_name).join(",")
      );
      if (selectedBranch) newParams.set("branch", selectedBranch);
      newParams.set("limit", commitsLimit.toString());
    }
    // If no repositories left, clear URL params completely
    setSearchParams(newParams);
  };

  const handleBranchChange = async (branch: string) => {
    setSelectedBranch(branch);

    // Update URL params
    const newParams = new URLSearchParams();
    newParams.set(
      "repos",
      selectedRepositories.map((r) => r.full_name).join(",")
    );
    newParams.set("branch", branch);
    newParams.set("limit", commitsLimit.toString());
    setSearchParams(newParams);

    // Refetch all repositories with new branch
    await fetchAllRepositories(branch, commitsLimit);
  };

  const handleLimitChange = async (limit: number) => {
    setCommitsLimit(limit);

    // Update URL params
    const newParams = new URLSearchParams();
    newParams.set(
      "repos",
      selectedRepositories.map((r) => r.full_name).join(",")
    );
    if (selectedBranch) newParams.set("branch", selectedBranch);
    newParams.set("limit", limit.toString());
    setSearchParams(newParams);

    // Refetch all repositories with new limit
    await fetchAllRepositories(selectedBranch, limit);
  };

  const fetchRepositoryData = async (userRepo: UserRepository) => {
    try {
      setIsLoading(true);
      setError(null);

      // Add loading state for this repository
      setRepositories((prev) => [
        ...prev,
        {
          repository: {} as Repository,
          commits: null,
          isLoading: true,
          error: null,
        },
      ]);

      const { default: api } = await import("../services/api");

      // Fetch repository info
      const repoData = await api.getRepository(
        userRepo.full_name,
        state.accessToken || state.githubToken || undefined
      );

      // Fetch commits
      const commitsData = await api.getCommits(
        userRepo.full_name,
        selectedBranch || userRepo.default_branch,
        commitsLimit,
        state.accessToken || state.githubToken || undefined
      );

      // Update the repository data
      setRepositories((prev) =>
        prev.map((r) =>
          r.isLoading && !r.repository.name
            ? {
                repository: repoData,
                commits: commitsData,
                isLoading: false,
                error: null,
              }
            : r
        )
      );
    } catch (err) {
      setRepositories((prev) =>
        prev.map((r) =>
          r.isLoading && !r.repository.name
            ? {
                repository: {} as Repository,
                commits: null,
                isLoading: false,
                error:
                  err instanceof Error
                    ? err.message
                    : "Failed to fetch repository",
              }
            : r
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllRepositories = async (branch: string, limit: number) => {
    if (selectedRepositories.length === 0) return;

    try {
      setIsLoading(true);
      setError(null);

      // Reset repositories state
      setRepositories([]);

      // Fetch data for all selected repositories
      const promises = selectedRepositories.map(async (userRepo) => {
        try {
          const { default: api } = await import("../services/api");

          // Fetch repository info
          const repoData = await api.getRepository(
            userRepo.full_name,
            state.accessToken || state.githubToken || undefined
          );

          // Fetch commits
          const commitsData = await api.getCommits(
            userRepo.full_name,
            branch || userRepo.default_branch,
            limit,
            state.accessToken || state.githubToken || undefined
          );

          return {
            repository: repoData,
            commits: commitsData,
            isLoading: false,
            error: null,
          };
        } catch (err) {
          return {
            repository: {} as Repository,
            commits: null,
            isLoading: false,
            error:
              err instanceof Error ? err.message : "Failed to fetch repository",
          };
        }
      });

      const results = await Promise.all(promises);
      setRepositories(results);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch repositories"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (selectedRepositories.length > 0) {
      fetchAllRepositories(selectedBranch, commitsLimit);
    }
  };

  // Auto-fetch if URL params are present (only on initial load)
  useEffect(() => {
    if (
      selectedRepositories.length > 0 &&
      repositories.length === 0 &&
      !isLoading &&
      initialRepos.length > 0 // Only auto-fetch on initial load from URL
    ) {
      fetchAllRepositories(selectedBranch, commitsLimit);
    }
  }, [selectedRepositories.length, initialRepos.length]);

  // Display repositories
  const displayedRepos = repositories;

  const totalStars = repositories.reduce(
    (sum, repo) => sum + (repo.repository.stars || 0),
    0
  );
  const totalCommits = repositories.reduce(
    (sum, repo) => sum + (repo.commits?.total_commits || 0),
    0
  );
  const successfulRepos = repositories.filter(
    (repo) => !repo.error && repo.repository.name
  ).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-primary/10 rounded-xl">
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                Repository Analysis
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Compare and analyze multiple GitHub repositories side by side
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Repository Selection Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-8 sticky top-8">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Select Repositories
              </h2>

              {state.authenticatedUser ? (
                <div className="space-y-6">
                  {/* Repository Selector */}
                  <RepositorySelector
                    onRepositorySelect={(repoName) => {
                      const repo = state.userRepositories.find(
                        (r) => r.full_name === repoName
                      );
                      if (repo) {
                        handleRepositoryAdd(repo);
                      }
                    }}
                    className="max-h-96"
                  />

                  {/* Selected Repositories */}
                  {selectedRepositories.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-foreground mb-3">
                        Selected Repositories ({selectedRepositories.length})
                      </h3>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {selectedRepositories.map((repo) => (
                          <div
                            key={repo.full_name}
                            className="flex items-center justify-between bg-muted rounded-md p-3"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-foreground truncate">
                                {repo.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {repo.owner.login}
                              </div>
                            </div>
                            <button
                              onClick={() => handleRepositoryRemove(repo)}
                              className="ml-2 p-1 text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Branch Selection */}
                  {selectedRepositories.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        <GitBranch className="h-4 w-4 inline mr-2" />
                        Branch
                      </label>
                      <select
                        value={selectedBranch}
                        onChange={(e) => handleBranchChange(e.target.value)}
                        className="input-field"
                      >
                        {selectedRepositories.map((repo) => (
                          <option
                            key={`${repo.full_name}-${repo.default_branch}`}
                            value={repo.default_branch}
                          >
                            {repo.default_branch} (default)
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Commits Limit */}
                  {selectedRepositories.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        <BarChart3 className="h-4 w-4 inline mr-2" />
                        Commits to Show
                      </label>
                      <select
                        value={commitsLimit}
                        onChange={(e) =>
                          handleLimitChange(parseInt(e.target.value))
                        }
                        className="input-field"
                      >
                        <option value={10}>10 commits</option>
                        <option value={20}>20 commits</option>
                        <option value={50}>50 commits</option>
                        <option value={100}>100 commits</option>
                      </select>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mb-4">
                    <BarChart3 className="h-12 w-12 text-muted mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Connect GitHub
                    </h3>
                    <p className="text-muted-foreground text-sm mb-6">
                      Sign in with GitHub to access your repositories and
                      compare them side by side.
                    </p>
                  </div>
                  <GitHubAuth />
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {isLoading && (
              <div className="card p-8">
                <LoadingSpinner size="lg" className="mb-4" />
                <p className="text-center text-muted-foreground">
                  Analyzing repositories...
                </p>
              </div>
            )}

            {error && (
              <ErrorMessage
                error={error}
                onRetry={handleRetry}
                className="mb-6"
              />
            )}

            {repositories.length > 0 && !isLoading && (
              <div className="space-y-6">
                {/* Summary Stats */}
                <div className="card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-2">
                        Analysis Summary
                      </h2>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <GitBranch className="h-4 w-4" />
                          <span>{selectedBranch || "default"}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BarChart3 className="h-4 w-4" />
                          <span>{commitsLimit} commits per repo</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleRetry}
                      disabled={isLoading}
                      className="p-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      <RotateCcw className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {selectedRepositories.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Repositories
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">
                        {formatNumber(totalStars)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total Stars
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {formatNumber(totalCommits)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total Commits
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-destructive">
                        {repositories.length - successfulRepos}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Errors
                      </div>
                    </div>
                  </div>
                </div>

                {/* Repository List */}
                <div className="space-y-6">
                  {displayedRepos.map((repoData, index) => (
                    <div key={index} className="card-elevated p-6">
                      {repoData.error ? (
                        <div className="text-center py-8">
                          <div className="text-destructive mb-2">
                            Failed to load repository
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {repoData.error}
                          </div>
                        </div>
                      ) : repoData.repository.name ? (
                        <div className="space-y-4">
                          <RepositoryCard repository={repoData.repository} />

                          {repoData.commits && (
                            <div className="mt-6 pt-6 border-t border-border">
                              <h3 className="text-lg font-semibold text-foreground mb-4">
                                Recent Commits ({repoData.commits.total_commits}{" "}
                                total)
                              </h3>
                              <div className="space-y-3">
                                {repoData.commits.commits
                                  .slice(0, 3)
                                  .map((commit) => (
                                    <CommitCard
                                      key={commit.sha}
                                      commit={commit}
                                      showDetails={false}
                                    />
                                  ))}
                                {repoData.commits.commits.length > 3 && (
                                  <div className="text-center pt-2">
                                    <a
                                      href={`/commits?repo=${repoData.repository.full_name}&branch=${repoData.commits.branch}`}
                                      className="btn-secondary text-sm"
                                    >
                                      View All Commits
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <LoadingSpinner size="md" className="mb-4" />
                          <div className="text-muted-foreground">
                            Loading repository...
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {repositories.length === 0 &&
              !isLoading &&
              !error &&
              state.authenticatedUser && (
                <div className="card p-8 text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No Repositories Selected
                  </h3>
                  <p className="text-muted-foreground">
                    Select repositories from the sidebar to start your analysis.
                  </p>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepositoryPage;
