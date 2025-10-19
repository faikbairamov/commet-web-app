import React, { useState } from "react";
import { useApp } from "../contexts/AppContext";
import type { UserRepository } from "../types/index.js";
import { Search, Star, GitFork, Lock, Globe } from "lucide-react";

interface RepositorySelectorProps {
  onRepositorySelect: (repository: string) => void;
  className?: string;
}

const RepositorySelector: React.FC<RepositorySelectorProps> = ({
  onRepositorySelect,
  className = "",
}) => {
  const { state } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVisibility, setSelectedVisibility] = useState<
    "all" | "public" | "private"
  >("all");

  const filteredRepositories = state.userRepositories.filter((repo) => {
    const matchesSearch =
      repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repo.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesVisibility =
      selectedVisibility === "all" ||
      (selectedVisibility === "public" && !repo.is_private) ||
      (selectedVisibility === "private" && repo.is_private);

    return matchesSearch && matchesVisibility;
  });

  const handleRepositoryClick = (repo: UserRepository) => {
    onRepositorySelect(repo.full_name);
  };

  if (!state.authenticatedUser) {
    return (
      <div className={`bg-gray-900 rounded-lg p-6 text-center ${className}`}>
        <p className="text-gray-400">
          Please sign in with GitHub to view your repositories
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className} max-h-96 overflow-hidden`}>
      {/* Search and Filter */}
      <div className="bg-card rounded-lg p-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search repositories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50"
              />
            </div>
          </div>

          {/* Visibility Filter */}
          <div className="md:w-48">
            <select
              value={selectedVisibility}
              onChange={(e) =>
                setSelectedVisibility(
                  e.target.value as "all" | "public" | "private"
                )
              }
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50"
            >
              <option value="all">All Repositories</option>
              <option value="public">Public Only</option>
              <option value="private">Private Only</option>
            </select>
          </div>
        </div>

        <div className="mt-2 text-sm text-gray-400">
          Showing {filteredRepositories.length} of{" "}
          {state.userRepositories.length} repositories
        </div>
      </div>

      {/* Repository List */}
      <div className="bg-card rounded-lg p-3">
        <h3 className="text-lg font-medium text-white mb-3">
          Select a Repository
        </h3>

        {filteredRepositories.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm
              ? "No repositories match your search"
              : "No repositories found"}
          </div>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {filteredRepositories.map((repo) => (
              <div
                key={repo.id}
                onClick={() => handleRepositoryClick(repo)}
                className="bg-muted rounded-md p-3 hover:bg-muted/80 cursor-pointer transition-colors duration-200 border border-transparent hover:border-border"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-foreground font-medium text-sm">
                        {repo.name}
                      </h4>
                      {repo.is_private ? (
                        <Lock className="w-3 h-3 text-yellow-400" />
                      ) : (
                        <Globe className="w-3 h-3 text-green-400" />
                      )}
                    </div>

                    {repo.description && (
                      <p className="text-muted-foreground text-xs mb-1 line-clamp-1">
                        {repo.description}
                      </p>
                    )}

                    <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                      {repo.language && (
                        <span className="flex items-center space-x-1">
                          <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                          <span>{repo.language}</span>
                        </span>
                      )}
                      <span className="flex items-center space-x-1">
                        <Star className="w-3 h-3" />
                        <span>{repo.stars}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <GitFork className="w-3 h-3" />
                        <span>{repo.forks}</span>
                      </span>
                    </div>
                  </div>

                  <div className="ml-3 text-right">
                    <div className="text-xs text-gray-500">
                      {repo.size.toLocaleString()} KB
                    </div>
                    <div className="text-xs text-blue-400">Select</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RepositorySelector;
