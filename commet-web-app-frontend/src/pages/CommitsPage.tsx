import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import type {
  CommitsResponse,
  Commit,
  UserRepository,
} from "../types/index.js";
import { useCommits } from "../hooks/useApi";
import { useApp } from "../contexts/AppContext";
import RepositorySelector from "../components/RepositorySelector";
import CommitCard from "../components/CommitCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import GitHubAuth from "../components/GitHubAuth";
import {
  Code2,
  RotateCcw,
  Filter,
  Search,
  GitBranch,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import { formatNumber } from "../utils";

const CommitsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { state } = useApp();
  const { data: commits, execute, isLoading, error } = useCommits();

  // Type assertion for commits data
  const commitsResponse = commits as CommitsResponse | null;
  const [showDetails, setShowDetails] = useState(false);
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "additions" | "deletions">(
    "date"
  );
  const [selectedRepository, setSelectedRepository] =
    useState<UserRepository | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [commitsLimit, setCommitsLimit] = useState(20);

  // Get initial values from URL params
  const initialRepo = searchParams.get("repo") || "";
  const initialBranch = searchParams.get("branch") || "";
  const initialLimit = parseInt(searchParams.get("limit") || "20");

  // Find initial repository from user's repos if available
  useEffect(() => {
    if (initialRepo && state.userRepositories.length > 0) {
      const repo = state.userRepositories.find(
        (r) => r.full_name === initialRepo
      );
      if (repo) {
        setSelectedRepository(repo);
        setSelectedBranch(initialBranch || repo.default_branch);
        setCommitsLimit(initialLimit);
      }
    }
  }, [initialRepo, initialBranch, initialLimit, state.userRepositories]);

  const handleRepositorySelect = async (repository: UserRepository) => {
    setSelectedRepository(repository);
    setSelectedBranch(repository.default_branch);

    // Update URL params
    const newParams = new URLSearchParams();
    newParams.set("repo", repository.full_name);
    newParams.set("branch", repository.default_branch);
    newParams.set("limit", commitsLimit.toString());
    setSearchParams(newParams);

    // Fetch commits for the selected repository
    await fetchCommits(
      repository.full_name,
      repository.default_branch,
      commitsLimit
    );
  };

  const handleBranchChange = async (branch: string) => {
    if (!selectedRepository) return;

    setSelectedBranch(branch);

    // Update URL params
    const newParams = new URLSearchParams();
    newParams.set("repo", selectedRepository.full_name);
    newParams.set("branch", branch);
    newParams.set("limit", commitsLimit.toString());
    setSearchParams(newParams);

    // Fetch commits for the new branch
    await fetchCommits(selectedRepository.full_name, branch, commitsLimit);
  };

  const handleLimitChange = async (limit: number) => {
    if (!selectedRepository) return;

    setCommitsLimit(limit);

    // Update URL params
    const newParams = new URLSearchParams();
    newParams.set("repo", selectedRepository.full_name);
    newParams.set("branch", selectedBranch);
    newParams.set("limit", limit.toString());
    setSearchParams(newParams);

    // Fetch commits with new limit
    await fetchCommits(selectedRepository.full_name, selectedBranch, limit);
  };

  const fetchCommits = async (repo: string, branch: string, limit: number) => {
    try {
      await execute(() =>
        import("../services/api").then((api) =>
          showDetails
            ? api.default.getCommitDetails(
                repo,
                branch,
                limit,
                state.accessToken || state.githubToken || undefined
              )
            : api.default.getCommits(
                repo,
                branch,
                limit,
                state.accessToken || state.githubToken || undefined
              )
        )
      );
    } catch (err) {
      console.error("Error fetching commits:", err);
    }
  };

  const handleRetry = () => {
    if (selectedRepository) {
      fetchCommits(selectedRepository.full_name, selectedBranch, commitsLimit);
    }
  };

  const handleToggleDetails = async () => {
    if (!commits || !selectedRepository) return;

    setShowDetails(!showDetails);

    // Refetch with new detail level
    if (commitsResponse) {
      await execute(() =>
        import("../services/api").then((api) =>
          !showDetails
            ? api.default.getCommitDetails(
                selectedRepository.full_name,
                selectedBranch,
                commitsResponse.commits.length,
                state.accessToken || state.githubToken || undefined
              )
            : api.default.getCommits(
                selectedRepository.full_name,
                selectedBranch,
                commitsResponse.commits.length,
                state.accessToken || state.githubToken || undefined
              )
        )
      );
    }
  };

  // Filter and sort commits
  const filteredAndSortedCommits =
    commitsResponse?.commits
      .filter(
        (commit: Commit) =>
          commit.message.toLowerCase().includes(filter.toLowerCase()) ||
          commit.author.name.toLowerCase().includes(filter.toLowerCase())
      )
      .sort((a: Commit, b: Commit) => {
        switch (sortBy) {
          case "additions":
            return b.stats.additions - a.stats.additions;
          case "deletions":
            return b.stats.deletions - a.stats.deletions;
          case "date":
          default:
            return (
              new Date(b.author.date).getTime() -
              new Date(a.author.date).getTime()
            );
        }
      }) || [];

  // Calculate commit statistics
  const totalAdditions = filteredAndSortedCommits.reduce(
    (sum, commit) => sum + commit.stats.additions,
    0
  );
  const totalDeletions = filteredAndSortedCommits.reduce(
    (sum, commit) => sum + commit.stats.deletions,
    0
  );
  const uniqueAuthors = new Set(
    filteredAndSortedCommits.map((commit) => commit.author.name)
  ).size;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Code2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                Commit History
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Browse commit history with detailed code differences and file
                changes
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Repository Selection Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-8 sticky top-8">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Select Repository
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
                        handleRepositorySelect(repo);
                      }
                    }}
                    className="max-h-96"
                  />

                  {/* Branch Selection */}
                  {selectedRepository && (
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
                        <option value={selectedRepository.default_branch}>
                          {selectedRepository.default_branch} (default)
                        </option>
                        {/* Note: In a real implementation, you'd fetch available branches */}
                      </select>
                    </div>
                  )}

                  {/* Commits Limit */}
                  {selectedRepository && (
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

                  {/* View Options */}
                  {commitsResponse && (
                    <div className="pt-4 border-t border-border">
                      <h3 className="text-sm font-medium text-foreground mb-3">
                        View Options
                      </h3>
                      <button
                        onClick={handleToggleDetails}
                        disabled={isLoading}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                          showDetails
                            ? "bg-primary/20 text-primary border border-primary/50"
                            : "bg-muted text-muted-foreground hover:bg-muted/80 border border-border"
                        }`}
                      >
                        {showDetails ? "Hide" : "Show"} Code Differences
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mb-4">
                    <Code2 className="h-12 w-12 text-muted mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Connect GitHub
                    </h3>
                    <p className="text-muted-foreground text-sm mb-6">
                      Sign in with GitHub to access your repositories and browse
                      commit history.
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
                  Fetching commit history...
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

            {commitsResponse && !isLoading && (
              <div className="space-y-6">
                {/* Repository Info & Stats */}
                <div className="card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h2 className="text-xl font-semibold text-foreground">
                          {commitsResponse.repository}
                        </h2>
                        {selectedRepository && (
                          <a
                            href={selectedRepository.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80 transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <GitBranch className="h-4 w-4" />
                          <span>{commitsResponse.branch}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BarChart3 className="h-4 w-4" />
                          <span>
                            {formatNumber(commitsResponse.total_commits)}{" "}
                            commits
                          </span>
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

                  {/* Commit Statistics */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        +{formatNumber(totalAdditions)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Additions
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-400">
                        -{formatNumber(totalDeletions)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Deletions
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {uniqueAuthors}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Contributors
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filters and Sorting */}
                <div className="card p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search Filter */}
                    <div className="flex-1">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <input
                          type="text"
                          placeholder="Filter commits by message or author..."
                          value={filter}
                          onChange={(e) => setFilter(e.target.value)}
                          className="input-field pl-10"
                        />
                      </div>
                    </div>

                    {/* Sort Options */}
                    <div className="flex items-center space-x-2">
                      <Filter className="h-5 w-5 text-muted-foreground" />
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="input-field"
                      >
                        <option value="date">Sort by Date</option>
                        <option value="additions">Sort by Additions</option>
                        <option value="deletions">Sort by Deletions</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Commits List */}
                <div className="space-y-4">
                  {filteredAndSortedCommits.length > 0 ? (
                    filteredAndSortedCommits.map((commit: Commit) => (
                      <CommitCard
                        key={commit.sha}
                        commit={commit}
                        showDetails={showDetails}
                      />
                    ))
                  ) : (
                    <div className="card p-8 text-center">
                      <Code2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        No commits found
                      </h3>
                      <p className="text-muted-foreground">
                        {filter
                          ? "Try adjusting your search filter."
                          : "No commits available for this repository."}
                      </p>
                    </div>
                  )}
                </div>

                {/* Load More Info */}
                {commitsResponse.commits.length >=
                  (commitsResponse.total_commits || 0) && (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Showing all {formatNumber(commitsResponse.commits.length)}{" "}
                      commits
                    </p>
                  </div>
                )}
              </div>
            )}

            {!commitsResponse &&
              !isLoading &&
              !error &&
              state.authenticatedUser && (
                <div className="card p-8 text-center">
                  <Code2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No Repository Selected
                  </h3>
                  <p className="text-muted-foreground">
                    Select a repository from the sidebar to view its commit
                    history.
                  </p>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommitsPage;
