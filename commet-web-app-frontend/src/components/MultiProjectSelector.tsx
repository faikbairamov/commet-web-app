import React, { useState } from "react";
import { useApp } from "../contexts/AppContext";
import type { UserRepository } from "../types/index.js";
import {
  Search,
  Star,
  GitFork,
  Lock,
  Globe,
  Plus,
  X,
  Link,
  AlertCircle,
  Info,
} from "lucide-react";

interface MultiProjectSelectorProps {
  onProjectsChange: (projects: UserRepository[]) => void;
  selectedProjects: UserRepository[];
  className?: string;
}

const MultiProjectSelector: React.FC<MultiProjectSelectorProps> = ({
  onProjectsChange,
  selectedProjects,
  className = "",
}) => {
  const { state } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVisibility, setSelectedVisibility] = useState<
    "all" | "public" | "private"
  >("all");
  const [showProjectTypes, setShowProjectTypes] = useState(false);

  const filteredRepositories = state.userRepositories.filter((repo) => {
    const matchesSearch =
      repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repo.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesVisibility =
      selectedVisibility === "all" ||
      (selectedVisibility === "public" && !repo.is_private) ||
      (selectedVisibility === "private" && repo.is_private);

    // Don't show already selected projects
    const isNotSelected = !selectedProjects.some(
      (selected) => selected.id === repo.id
    );

    return matchesSearch && matchesVisibility && isNotSelected;
  });

  const handleProjectSelect = (repo: UserRepository) => {
    const newSelectedProjects = [...selectedProjects, repo];
    onProjectsChange(newSelectedProjects);
  };

  const handleProjectRemove = (repoId: number) => {
    const newSelectedProjects = selectedProjects.filter(
      (project) => project.id !== repoId
    );
    onProjectsChange(newSelectedProjects);
  };

  const getProjectType = (repo: UserRepository): string => {
    const name = repo.name.toLowerCase();
    const description = repo.description?.toLowerCase() || "";

    if (
      name.includes("frontend") ||
      name.includes("client") ||
      name.includes("ui") ||
      description.includes("frontend") ||
      description.includes("react") ||
      description.includes("vue") ||
      description.includes("angular")
    ) {
      return "Frontend";
    }
    if (
      name.includes("backend") ||
      name.includes("api") ||
      name.includes("server") ||
      description.includes("backend") ||
      description.includes("api") ||
      description.includes("server")
    ) {
      return "Backend";
    }
    if (
      name.includes("mobile") ||
      name.includes("app") ||
      description.includes("mobile") ||
      description.includes("ios") ||
      description.includes("android")
    ) {
      return "Mobile";
    }
    if (
      name.includes("database") ||
      name.includes("db") ||
      description.includes("database") ||
      description.includes("sql") ||
      description.includes("mongo")
    ) {
      return "Database";
    }
    if (
      name.includes("docs") ||
      name.includes("documentation") ||
      description.includes("documentation") ||
      description.includes("docs")
    ) {
      return "Documentation";
    }
    return "Other";
  };

  const getProjectTypeColor = (type: string): string => {
    switch (type) {
      case "Frontend":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Backend":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Mobile":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "Database":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "Documentation":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const analyzeProjectConnections = (): string[] => {
    if (selectedProjects.length < 2) return [];

    const connections: string[] = [];
    const projectTypes = selectedProjects.map(getProjectType);

    // Check for frontend-backend connections
    if (projectTypes.includes("Frontend") && projectTypes.includes("Backend")) {
      connections.push("Frontend-Backend API Integration");
    }

    // Check for mobile connections
    if (projectTypes.includes("Mobile") && projectTypes.includes("Backend")) {
      connections.push("Mobile-Backend API Integration");
    }

    // Check for database connections
    if (
      projectTypes.includes("Database") &&
      (projectTypes.includes("Backend") || projectTypes.includes("Frontend"))
    ) {
      connections.push("Database Integration");
    }

    // Check for documentation connections
    if (projectTypes.includes("Documentation")) {
      connections.push("Documentation & Code Alignment");
    }

    // Check for similar technologies
    const languages = selectedProjects
      .map((repo) => repo.language)
      .filter(Boolean);
    const uniqueLanguages = [...new Set(languages)];
    if (uniqueLanguages.length < languages.length) {
      connections.push("Shared Technology Stack");
    }

    return connections;
  };

  const connections = analyzeProjectConnections();

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
    <div className={`space-y-4 ${className}`}>
      {/* Selected Projects */}
      {selectedProjects.length > 0 && (
        <div className="bg-card rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium text-white">
              Selected Projects ({selectedProjects.length})
            </h3>
            <button
              onClick={() => onProjectsChange([])}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-2">
            {selectedProjects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-3 bg-muted rounded-md border border-border"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getProjectTypeColor(
                        getProjectType(project)
                      )}`}
                    >
                      {getProjectType(project).charAt(0)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-foreground font-medium text-sm truncate">
                        {project.name}
                      </h4>
                      <span
                        className={`px-2 py-1 text-xs rounded-full border ${getProjectTypeColor(
                          getProjectType(project)
                        )}`}
                      >
                        {getProjectType(project)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                      {project.language && (
                        <span className="flex items-center space-x-1">
                          <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                          <span>{project.language}</span>
                        </span>
                      )}
                      <span className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400" />
                        <span>{project.stars}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <GitFork className="w-3 h-3 text-gray-400" />
                        <span>{project.forks}</span>
                      </span>
                      {project.is_private ? (
                        <Lock className="w-3 h-3 text-yellow-400" />
                      ) : (
                        <Globe className="w-3 h-3 text-green-400" />
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleProjectRemove(project.id)}
                  className="flex-shrink-0 p-1 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Project Connections Analysis */}
          {connections.length > 0 && (
            <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Link className="w-4 h-4 text-blue-400" />
                <h4 className="text-sm font-medium text-blue-400">
                  Detected Project Connections
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {connections.map((connection, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30"
                  >
                    {connection}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Project Selection */}
      <div className="bg-card rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">
            Add Connected Projects
          </h3>
          <button
            onClick={() => setShowProjectTypes(!showProjectTypes)}
            className="text-sm text-gray-400 hover:text-white transition-colors flex items-center space-x-1"
          >
            <Info className="w-4 h-4" />
            <span>Project Types</span>
          </button>
        </div>

        {/* Project Types Info */}
        {showProjectTypes && (
          <div className="mb-4 p-3 bg-gray-800/50 border border-gray-600 rounded-lg">
            <h4 className="text-sm font-medium text-white mb-2">
              Project Type Detection
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500/20 border border-blue-500/30"></div>
                <span className="text-gray-300">Frontend</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/30"></div>
                <span className="text-gray-300">Backend</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-purple-500/20 border border-purple-500/30"></div>
                <span className="text-gray-300">Mobile</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-orange-500/20 border border-orange-500/30"></div>
                <span className="text-gray-300">Database</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-gray-500/20 border border-gray-500/30"></div>
                <span className="text-gray-300">Documentation</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-slate-500/20 border border-slate-500/30"></div>
                <span className="text-gray-300">Other</span>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-3 mb-4">
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

        <div className="text-sm text-gray-400 mb-3">
          Showing {filteredRepositories.length} of{" "}
          {state.userRepositories.length} repositories
        </div>

        {/* Repository List */}
        {filteredRepositories.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm
              ? "No repositories match your search"
              : selectedProjects.length > 0
              ? "All repositories have been selected"
              : "No repositories found"}
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredRepositories.map((repo) => (
              <button
                key={repo.id}
                onClick={() => handleProjectSelect(repo)}
                className="w-full text-left p-3 bg-muted rounded-md hover:bg-muted/80 transition-colors duration-200 border border-transparent hover:border-border"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getProjectTypeColor(
                          getProjectType(repo)
                        )}`}
                      >
                        {getProjectType(repo).charAt(0)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-foreground font-medium text-sm truncate">
                          {repo.name}
                        </h4>
                        <span
                          className={`px-2 py-1 text-xs rounded-full border ${getProjectTypeColor(
                            getProjectType(repo)
                          )}`}
                        >
                          {getProjectType(repo)}
                        </span>
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
                          <Star className="w-3 h-3 text-yellow-400" />
                          <span>{repo.stars}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <GitFork className="w-3 h-3 text-gray-400" />
                          <span>{repo.forks}</span>
                        </span>
                        {repo.is_private ? (
                          <Lock className="w-3 h-3 text-yellow-400" />
                        ) : (
                          <Globe className="w-3 h-3 text-green-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="ml-3 text-right">
                    <div className="text-xs text-gray-500">
                      {repo.size.toLocaleString()} KB
                    </div>
                    <div className="text-xs text-blue-400 flex items-center space-x-1">
                      <Plus className="w-3 h-3" />
                      <span>Add</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Usage Instructions */}
      {selectedProjects.length === 0 && (
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-400 mb-1">
                Multi-Project Analysis
              </h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                Select multiple connected projects (e.g., frontend and backend)
                to get comprehensive analysis and detailed instructions on how
                they work together. The AI will analyze API schemas, data flow,
                and provide complete prompts for development tasks.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiProjectSelector;
