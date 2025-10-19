import React, { useState } from "react";
import { useApp } from "../contexts/AppContext";
import RepositorySelector from "../components/RepositorySelector";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import GitHubAuth from "../components/GitHubAuth";
import {
  Users,
  Search,
  Filter,
  MapPin,
  Building,
  ExternalLink,
} from "lucide-react";
import { formatNumber } from "../utils";

interface GitHubUser {
  id: number;
  login: string;
  name: string;
  email: string;
  avatar_url: string;
  url: string;
  bio: string;
  location: string;
  company: string;
  blog: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

interface ContributorStats {
  user: GitHubUser;
  repositories: number;
  totalStars: number;
  totalForks: number;
  recentActivity: string;
  languages: string[];
}

const UsersPage: React.FC = () => {
  const { state } = useApp();
  const [contributors, setContributors] = useState<ContributorStats[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState<
    "name" | "repos" | "stars" | "followers"
  >("name");
  const [selectedRepositories, setSelectedRepositories] = useState<string[]>(
    []
  );

  const handleRepositorySelect = async (repoName: string) => {
    if (selectedRepositories.includes(repoName)) {
      return;
    }

    const newSelectedRepos = [...selectedRepositories, repoName];
    setSelectedRepositories(newSelectedRepos);

    // Fetch contributors for the selected repository
    await fetchContributors();
  };

  const handleRepositoryRemove = (repoName: string) => {
    const newSelectedRepos = selectedRepositories.filter((r) => r !== repoName);
    setSelectedRepositories(newSelectedRepos);

    // Refetch contributors for remaining repositories
    if (newSelectedRepos.length > 0) {
      fetchContributors();
    } else {
      setContributors([]);
    }
  };

  const fetchContributors = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // For now, we'll simulate contributor data since the API might not have this endpoint
      // In a real implementation, you'd call an API endpoint like:
      // const contributors = await ApiService.getRepositoryContributors(repo, token);

      const mockContributors: ContributorStats[] = [
        {
          user: {
            id: 1,
            login: "octocat",
            name: "The Octocat",
            email: "octocat@github.com",
            avatar_url: "https://github.com/images/error/octocat_happy.gif",
            url: "https://api.github.com/users/octocat",
            bio: "GitHub's mascot",
            location: "San Francisco",
            company: "GitHub",
            blog: "https://github.blog",
            public_repos: 8,
            public_gists: 8,
            followers: 1000,
            following: 9,
            created_at: "2011-01-25T18:44:36Z",
            updated_at: "2023-01-25T18:44:36Z",
          },
          repositories: 3,
          totalStars: 150,
          totalForks: 25,
          recentActivity: "2 days ago",
          languages: ["JavaScript", "TypeScript", "Python"],
        },
        {
          user: {
            id: 2,
            login: "defunkt",
            name: "Chris Wanstrath",
            email: "chris@github.com",
            avatar_url: "https://github.com/images/error/defunkt_happy.gif",
            url: "https://api.github.com/users/defunkt",
            bio: "GitHub co-founder",
            location: "San Francisco, CA",
            company: "GitHub",
            blog: "https://chriswanstrath.com",
            public_repos: 107,
            public_gists: 273,
            followers: 2000,
            following: 210,
            created_at: "2007-10-20T05:24:19Z",
            updated_at: "2023-01-25T18:44:36Z",
          },
          repositories: 5,
          totalStars: 500,
          totalForks: 100,
          recentActivity: "1 week ago",
          languages: ["Ruby", "JavaScript", "Go"],
        },
      ];

      setContributors(mockContributors);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch contributors"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and sort contributors
  const filteredAndSortedContributors = contributors
    .filter(
      (contributor) =>
        contributor.user.login.toLowerCase().includes(filter.toLowerCase()) ||
        contributor.user.name?.toLowerCase().includes(filter.toLowerCase()) ||
        contributor.user.company?.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "repos":
          return b.repositories - a.repositories;
        case "stars":
          return b.totalStars - a.totalStars;
        case "followers":
          return b.user.followers - a.user.followers;
        case "name":
        default:
          return (a.user.name || a.user.login).localeCompare(
            b.user.name || b.user.login
          );
      }
    });

  const totalContributors = contributors.length;
  const totalRepositories = contributors.reduce(
    (sum, c) => sum + c.repositories,
    0
  );
  const totalStars = contributors.reduce((sum, c) => sum + c.totalStars, 0);
  const totalFollowers = contributors.reduce(
    (sum, c) => sum + c.user.followers,
    0
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                Contributors
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Discover and analyze GitHub contributors across your
                repositories
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
                    onRepositorySelect={handleRepositorySelect}
                    className="max-h-96"
                  />

                  {/* Selected Repositories */}
                  {selectedRepositories.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-foreground mb-3">
                        Selected Repositories ({selectedRepositories.length})
                      </h3>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {selectedRepositories.map((repoName) => (
                          <div
                            key={repoName}
                            className="flex items-center justify-between bg-muted rounded-md p-3"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-foreground truncate">
                                {repoName.split("/")[1]}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {repoName.split("/")[0]}
                              </div>
                            </div>
                            <button
                              onClick={() => handleRepositoryRemove(repoName)}
                              className="ml-2 p-1 text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mb-4">
                    <Users className="h-12 w-12 text-muted mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Connect GitHub
                    </h3>
                    <p className="text-muted-foreground text-sm mb-6">
                      Sign in with GitHub to analyze contributors across your
                      repositories.
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
                  Analyzing contributors...
                </p>
              </div>
            )}

            {error && (
              <ErrorMessage
                error={error}
                onRetry={() => fetchContributors()}
                className="mb-6"
              />
            )}

            {contributors.length > 0 && !isLoading && (
              <div className="space-y-6">
                {/* Summary Stats */}
                <div className="card p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    Contributor Analysis
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {totalContributors}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Contributors
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">
                        {formatNumber(totalRepositories)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Repositories
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {formatNumber(totalStars)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total Stars
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">
                        {formatNumber(totalFollowers)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total Followers
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
                          placeholder="Filter contributors by name, username, or company..."
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
                        <option value="name">Sort by Name</option>
                        <option value="repos">Sort by Repositories</option>
                        <option value="stars">Sort by Stars</option>
                        <option value="followers">Sort by Followers</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Contributors List */}
                <div className="space-y-4">
                  {filteredAndSortedContributors.map((contributor) => (
                    <div key={contributor.user.id} className="card p-6">
                      <div className="flex items-start space-x-4">
                        {/* Avatar */}
                        <img
                          src={contributor.user.avatar_url}
                          alt={contributor.user.login}
                          className="w-16 h-16 rounded-full border-2 border-border"
                        />

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-foreground">
                              {contributor.user.name || contributor.user.login}
                            </h3>
                            <a
                              href={contributor.user.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary/80 transition-colors"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                            <span>@{contributor.user.login}</span>
                            {contributor.user.company && (
                              <div className="flex items-center space-x-1">
                                <Building className="h-4 w-4" />
                                <span>{contributor.user.company}</span>
                              </div>
                            )}
                            {contributor.user.location && (
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-4 w-4" />
                                <span>{contributor.user.location}</span>
                              </div>
                            )}
                          </div>

                          {contributor.user.bio && (
                            <p className="text-muted-foreground text-sm mb-3">
                              {contributor.user.bio}
                            </p>
                          )}

                          {/* Stats */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                            <div className="text-center">
                              <div className="text-lg font-semibold text-primary">
                                {contributor.repositories}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Repos
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold text-accent">
                                {formatNumber(contributor.totalStars)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Stars
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold text-primary">
                                {formatNumber(contributor.user.followers)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Followers
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold text-accent">
                                {contributor.user.public_repos}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Public Repos
                              </div>
                            </div>
                          </div>

                          {/* Languages */}
                          {contributor.languages.length > 0 && (
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-muted-foreground">
                                Languages:
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {contributor.languages.map((language) => (
                                  <span
                                    key={language}
                                    className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full"
                                  >
                                    {language}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {contributors.length === 0 &&
              !isLoading &&
              !error &&
              state.authenticatedUser && (
                <div className="card p-8 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No Repositories Selected
                  </h3>
                  <p className="text-muted-foreground">
                    Select repositories from the sidebar to analyze their
                    contributors.
                  </p>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
