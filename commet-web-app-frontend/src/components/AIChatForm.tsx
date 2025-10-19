import React, { useState } from "react";
import { useApp } from "../contexts/AppContext";
import ApiService from "../services/api";
import type {
  ChatFormData,
  ChatResponse,
  UserRepository,
} from "../types/index.js";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import {
  Search,
  GitBranch,
  CheckCircle,
  Clock,
  Brain,
  Database,
} from "lucide-react";

// Progress step component
const ProgressStep: React.FC<{
  step: number;
  title: string;
  description: string;
  status: "pending" | "active" | "completed";
  icon: React.ReactNode;
}> = ({ title, description, status, icon }) => {
  const getStatusColor = () => {
    switch (status) {
      case "completed":
        return "text-green-400 bg-green-400/20 border-green-400/30";
      case "active":
        return "text-blue-400 bg-blue-400/20 border-blue-400/30 animate-pulse";
      case "pending":
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const getIconColor = () => {
    switch (status) {
      case "completed":
        return "text-green-400";
      case "active":
        return "text-blue-400 animate-pulse";
      case "pending":
        return "text-gray-400";
    }
  };

  return (
    <div
      className={`flex items-start space-x-4 p-4 rounded-lg border transition-all duration-300 ${getStatusColor()}`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor()}`}
      >
        {status === "completed" ? (
          <CheckCircle className="w-5 h-5 text-green-400" />
        ) : (
          <div className={getIconColor()}>{icon}</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <span className="text-sm font-medium">{title}</span>
          {status === "active" && (
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
              <div
                className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          )}
        </div>
        <p className="text-sm opacity-75">{description}</p>
      </div>
    </div>
  );
};

// Component to format AI response with better typography
const FormattedAIResponse: React.FC<{ response: string }> = ({ response }) => {
  // Function to parse markdown-style bold text and convert to JSX
  const parseBoldText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        const boldText = part.slice(2, -2);
        return (
          <strong key={index} className="text-white font-semibold">
            {boldText}
          </strong>
        );
      }
      return part;
    });
  };

  const formatResponse = (text: string) => {
    // Clean up the text first
    let cleanedText = text
      .replace(/^###\s*$/gm, "") // Remove standalone ### lines
      .replace(/\n{3,}/g, "\n\n") // Replace multiple newlines with double newlines
      .trim();

    // Split by lines and process each line
    const lines = cleanedText.split("\n");
    const elements: React.ReactElement[] = [];
    let currentSection: string[] = [];
    let sectionNumber = 1;

    const processSection = (
      sectionLines: string[],
      isNumbered: boolean = false
    ) => {
      if (sectionLines.length === 0) return;

      const firstLine = sectionLines[0].trim();
      const contentLines = sectionLines.slice(1);

      // Extract title and number
      let title = firstLine;
      let number = sectionNumber.toString();

      if (isNumbered) {
        const numberMatch = firstLine.match(/^(\d+)\.\s*(.+)/);
        if (numberMatch) {
          number = numberMatch[1];
          title = numberMatch[2];
        }
      } else {
        // For markdown headers, remove ###
        title = firstLine.replace(/^###\s+/, "");
      }

      elements.push(
        <div key={`section-${sectionNumber}`} className="mb-6">
          <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
            <span className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white mr-3">
              {number}
            </span>
            {parseBoldText(title)}
          </h4>
          <div className="ml-9">
            {contentLines.map((line, lineIndex) => {
              if (!line.trim()) return null;

              // Skip standalone ### symbols
              if (/^###\s*$/.test(line.trim())) return null;

              // Check for bullet points
              if (
                line.trim().startsWith("•") ||
                line.trim().startsWith("-") ||
                line.trim().startsWith("*")
              ) {
                return (
                  <div key={lineIndex} className="flex items-start mb-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-200 leading-relaxed">
                      {parseBoldText(line.trim().replace(/^[•\-*]\s*/, ""))}
                    </span>
                  </div>
                );
              }

              // Regular paragraph
              return (
                <p
                  key={lineIndex}
                  className="text-gray-200 leading-relaxed mb-2"
                >
                  {parseBoldText(line.trim())}
                </p>
              );
            })}
          </div>
        </div>
      );

      sectionNumber++;
    };

    // Process lines
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (!line) {
        if (currentSection.length > 0) {
          processSection(currentSection);
          currentSection = [];
        }
        continue;
      }

      // Check if this is a new section
      const isMarkdownHeader = /^###\s+/.test(line);
      const isNumberedSection = /^\d+\.\s+/.test(line);

      if (isMarkdownHeader || isNumberedSection) {
        // Process previous section
        if (currentSection.length > 0) {
          processSection(currentSection);
        }
        // Start new section
        currentSection = [line];
      } else {
        // Add to current section
        currentSection.push(line);
      }
    }

    // Process final section
    if (currentSection.length > 0) {
      processSection(currentSection);
    }

    // If no sections were found, treat as regular text
    if (elements.length === 0) {
      return (
        <div className="text-gray-200 leading-relaxed">
          {lines.map((line, index) => {
            if (!line.trim()) return null;

            // Check for bullet points
            if (
              line.trim().startsWith("•") ||
              line.trim().startsWith("-") ||
              line.trim().startsWith("*")
            ) {
              return (
                <div key={index} className="flex items-start mb-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-200 leading-relaxed">
                    {parseBoldText(line.trim().replace(/^[•\-*]\s*/, ""))}
                  </span>
                </div>
              );
            }

            return (
              <p key={index} className="text-gray-200 leading-relaxed mb-2">
                {parseBoldText(line.trim())}
              </p>
            );
          })}
        </div>
      );
    }

    return <div className="text-gray-200 leading-relaxed">{elements}</div>;
  };

  return (
    <div className="text-gray-200 leading-relaxed">
      {formatResponse(response)}
    </div>
  );
};

interface AIChatFormProps {
  className?: string;
}

const AIChatForm: React.FC<AIChatFormProps> = ({ className = "" }) => {
  const { state, setLoading, setError, clearError } = useApp();
  const [formData, setFormData] = useState<ChatFormData>({
    question: "",
    repository: "",
    branch: "",
    commits_limit: 10,
  });
  const [response, setResponse] = useState<ChatResponse | null>(null);
  const [selectedRepository, setSelectedRepository] =
    useState<UserRepository | null>(null);
  const [availableBranches, setAvailableBranches] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVisibility, setSelectedVisibility] = useState<
    "all" | "public" | "private"
  >("all");
  const [isLoadingBranches, setIsLoadingBranches] = useState(false);
  const [usingFallbackBranches, setUsingFallbackBranches] = useState(false);
  const [selectedExampleQuestion, setSelectedExampleQuestion] = useState<
    string | null
  >(null);
  const [analysisProgress, setAnalysisProgress] = useState<{
    currentStep: number;
    steps: Array<{
      id: number;
      title: string;
      description: string;
      status: "pending" | "active" | "completed";
    }>;
  }>({
    currentStep: 0,
    steps: [
      {
        id: 1,
        title: "Connecting to Repository",
        description: "Fetching repository information and metadata",
        status: "pending",
      },
      {
        id: 2,
        title: "Analyzing Commits",
        description: "Processing recent commits and code changes",
        status: "pending",
      },
      {
        id: 3,
        title: "AI Analysis",
        description: "Generating intelligent insights and recommendations",
        status: "pending",
      },
    ],
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "commits_limit" ? parseInt(value) || 10 : value,
    }));

    // Clear selected example question if user manually types in question field
    if (name === "question" && selectedExampleQuestion) {
      setSelectedExampleQuestion(null);
    }

    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.question.trim()) {
      setError("Please enter a question");
      return;
    }

    if (!formData.repository.trim()) {
      setError("Please enter a repository");
      return;
    }

    if (!ApiService.validateRepositoryFormat(formData.repository)) {
      setError("Please enter a valid repository format (owner/repo)");
      return;
    }

    setLoading(true);
    clearError();
    setResponse(null);

    // Reset progress
    setAnalysisProgress({
      currentStep: 0,
      steps: [
        {
          id: 1,
          title: "Connecting to Repository",
          description: "Fetching repository information and metadata",
          status: "pending",
        },
        {
          id: 2,
          title: "Analyzing Commits",
          description: "Processing recent commits and code changes",
          status: "pending",
        },
        {
          id: 3,
          title: "AI Analysis",
          description: "Generating intelligent insights and recommendations",
          status: "pending",
        },
      ],
    });

    try {
      // Use authenticated user's access token if available, otherwise fall back to manual token
      const token = state.accessToken || state.githubToken || undefined;

      // Step 1: Start repository connection
      setAnalysisProgress((prev) => ({
        ...prev,
        currentStep: 1,
        steps: prev.steps.map((step) =>
          step.id === 1 ? { ...step, status: "active" as const } : step
        ),
      }));

      // Simulate some delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Step 2: Start commit analysis
      setAnalysisProgress((prev) => ({
        ...prev,
        currentStep: 2,
        steps: prev.steps.map((step) =>
          step.id === 1
            ? { ...step, status: "completed" as const }
            : step.id === 2
            ? { ...step, status: "active" as const }
            : step
        ),
      }));

      // Simulate some delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Step 3: Start AI analysis
      setAnalysisProgress((prev) => ({
        ...prev,
        currentStep: 3,
        steps: prev.steps.map((step) =>
          step.id === 2
            ? { ...step, status: "completed" as const }
            : step.id === 3
            ? { ...step, status: "active" as const }
            : step
        ),
      }));

      const result = await ApiService.chatWithRepository(
        formData.question,
        formData.repository,
        token,
        formData.branch || undefined,
        formData.commits_limit || 10
      );

      // Complete all steps
      setAnalysisProgress((prev) => ({
        ...prev,
        currentStep: 3,
        steps: prev.steps.map((step) => ({
          ...step,
          status: "completed" as const,
        })),
      }));

      setResponse(result);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const exampleQuestions = [
    "What is the main programming language used in this repository?",
    "What are the recent changes in this codebase?",
    "Who are the main contributors to this project?",
    "What is the development activity pattern?",
    "What technologies and frameworks are used?",
    "What is the code quality and structure like?",
  ];

  const handleExampleClick = (question: string) => {
    setFormData((prev) => ({ ...prev, question }));
    setSelectedExampleQuestion(question);
  };

  // Filter repositories based on search and visibility
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

  // Handle repository selection
  const handleRepositoryChange = (repo: UserRepository) => {
    setSelectedRepository(repo);
    setFormData((prev) => ({
      ...prev,
      repository: repo.full_name,
      branch: repo.default_branch, // Set default branch
    }));

    // Fetch branches for the selected repository
    fetchBranches(repo.full_name);
  };

  // Fetch branches for a repository
  const fetchBranches = async (repoFullName: string) => {
    setIsLoadingBranches(true);
    try {
      const token = state.accessToken || state.githubToken;

      // Try to fetch real branches from GitHub API
      const branches = await ApiService.getRepositoryBranches(
        repoFullName,
        token || undefined
      );
      const branchNames = branches.map((branch) => branch.name);
      setAvailableBranches(branchNames);
      setUsingFallbackBranches(false);
    } catch (error: any) {
      console.error("Failed to fetch branches:", error);

      // Check if it's a private repo error or rate limit
      if (
        error.message?.includes("404") ||
        error.message?.includes("Not Found")
      ) {
        // Repository might be private or not accessible
        if (selectedRepository) {
          setAvailableBranches([selectedRepository.default_branch]);
          setUsingFallbackBranches(true);
        }
      } else if (
        error.message?.includes("rate limit") ||
        error.message?.includes("403")
      ) {
        // Rate limit or authentication issue - use fallback
        if (selectedRepository) {
          const commonBranches = [
            "main",
            "master",
            "develop",
            "dev",
            "staging",
            "production",
          ];
          const defaultBranch = selectedRepository.default_branch;
          const branches = [
            defaultBranch,
            ...commonBranches.filter((b) => b !== defaultBranch),
          ];
          setAvailableBranches(branches);
          setUsingFallbackBranches(true);
        }
      } else {
        // Other error - use fallback
        if (selectedRepository) {
          const commonBranches = [
            "main",
            "master",
            "develop",
            "dev",
            "staging",
            "production",
          ];
          const defaultBranch = selectedRepository.default_branch;
          const branches = [
            defaultBranch,
            ...commonBranches.filter((b) => b !== defaultBranch),
          ];
          setAvailableBranches(branches);
          setUsingFallbackBranches(true);
        }
      }
    } finally {
      setIsLoadingBranches(false);
    }
  };

  // Handle branch selection
  const handleBranchChange = (branch: string) => {
    setFormData((prev) => ({ ...prev, branch }));
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="bg-card rounded-lg p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          AI Repository Analysis
        </h2>
        <p className="text-muted-foreground mb-6">
          Ask questions about any GitHub repository and get AI-powered insights
          based on the repository data and recent commits.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label
              htmlFor="repository"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Repository *
            </label>
            {state.authenticatedUser ? (
              <div className="space-y-4">
                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-3">
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
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 shadow-lg"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: "right 0.5rem center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "1.5em 1.5em",
                        paddingRight: "2.5rem",
                      }}
                    >
                      <option
                        value="all"
                        className="bg-slate-800 text-white py-2"
                      >
                        All Repositories
                      </option>
                      <option
                        value="public"
                        className="bg-slate-800 text-white py-2"
                      >
                        Public Only
                      </option>
                      <option
                        value="private"
                        className="bg-slate-800 text-white py-2"
                      >
                        Private Only
                      </option>
                    </select>
                  </div>
                </div>

                {/* Repository Selection */}
                <div className="bg-slate-800 rounded-md border border-slate-600 max-h-64 overflow-y-auto shadow-lg">
                  <div className="p-3 text-sm text-slate-300 border-b border-slate-600 bg-slate-700/50">
                    Showing {filteredRepositories.length} of{" "}
                    {state.userRepositories.length} repositories
                  </div>
                  <div className="space-y-1 p-2">
                    {filteredRepositories.map((repo) => (
                      <button
                        key={repo.full_name}
                        onClick={() => handleRepositoryChange(repo)}
                        className={`w-full text-left p-3 rounded-md transition-all duration-200 ${
                          selectedRepository?.full_name === repo.full_name
                            ? "bg-primary text-primary-foreground shadow-md border border-primary/30"
                            : "bg-slate-700 hover:bg-slate-600 text-white border border-transparent hover:border-slate-500"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">
                              {repo.name}
                            </div>
                            <div className="text-sm opacity-75 truncate">
                              {repo.owner.login}
                            </div>
                            {repo.description && (
                              <div className="text-xs opacity-60 truncate mt-1">
                                {repo.description}
                              </div>
                            )}
                          </div>
                          <div className="ml-2 text-xs opacity-60">
                            {repo.is_private ? "🔒" : "🌐"}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Repository Display */}
                {selectedRepository && (
                  <div className="p-3 bg-primary/10 border border-primary/20 rounded-md">
                    <div className="text-sm text-primary font-medium">
                      Selected Repository:
                    </div>
                    <div className="text-foreground">
                      {selectedRepository.full_name}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <input
                type="text"
                id="repository"
                name="repository"
                value={formData.repository}
                onChange={handleInputChange}
                placeholder="owner/repository (e.g., microsoft/vscode)"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50"
                required
              />
            )}
          </div>

          <div>
            <label
              htmlFor="branch"
              className="block text-sm font-medium text-foreground mb-2"
            >
              <GitBranch className="h-4 w-4 inline mr-2" />
              Branch (optional)
            </label>
            {selectedRepository ? (
              <select
                id="branch"
                name="branch"
                value={formData.branch}
                onChange={(e) => handleBranchChange(e.target.value)}
                disabled={isLoadingBranches}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: "right 0.5rem center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "1.5em 1.5em",
                  paddingRight: "2.5rem",
                }}
              >
                {isLoadingBranches ? (
                  <option value="" className="bg-slate-800 text-white py-2">
                    Loading branches...
                  </option>
                ) : availableBranches.length > 0 ? (
                  availableBranches.map((branch) => (
                    <option
                      key={branch}
                      value={branch}
                      className="bg-slate-800 text-white py-2"
                    >
                      {branch}{" "}
                      {branch === selectedRepository.default_branch
                        ? "(default)"
                        : ""}
                    </option>
                  ))
                ) : (
                  <option
                    value={selectedRepository.default_branch}
                    className="bg-slate-800 text-white py-2"
                  >
                    {selectedRepository.default_branch} (default)
                  </option>
                )}
              </select>
            ) : (
              <input
                type="text"
                id="branch"
                name="branch"
                value={formData.branch}
                onChange={handleInputChange}
                placeholder="Select a repository first"
                disabled
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-500 placeholder-gray-500 cursor-not-allowed"
              />
            )}

            {/* Branch status indicator */}
            {selectedRepository && !isLoadingBranches && (
              <div className="mt-2 text-xs">
                {usingFallbackBranches ? (
                  <div className="flex items-center text-yellow-400">
                    <span className="mr-1">⚠️</span>
                    <span>
                      Using common branch names (repository may be private or
                      API rate limited)
                    </span>
                  </div>
                ) : availableBranches.length > 0 ? (
                  <div className="flex items-center text-green-400">
                    <span className="mr-1">✅</span>
                    <span>
                      Showing {availableBranches.length} real branch
                      {availableBranches.length !== 1 ? "es" : ""} from
                      repository
                    </span>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="commits_limit"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Commits to Analyze
            </label>
            <select
              id="commits_limit"
              name="commits_limit"
              value={formData.commits_limit}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 shadow-lg"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 0.5rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.5em 1.5em",
                paddingRight: "2.5rem",
              }}
            >
              <option value={5} className="bg-slate-800 text-white py-2">
                5 commits
              </option>
              <option value={10} className="bg-slate-800 text-white py-2">
                10 commits
              </option>
              <option value={20} className="bg-slate-800 text-white py-2">
                20 commits
              </option>
              <option value={50} className="bg-slate-800 text-white py-2">
                50 commits
              </option>
            </select>
          </div>

          <div>
            <label
              htmlFor="question"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Your Question *
            </label>
            <textarea
              id="question"
              name="question"
              value={formData.question}
              onChange={handleInputChange}
              rows={4}
              placeholder="Ask anything about the repository..."
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50"
              required
            />
          </div>

          <button
            type="submit"
            disabled={state.isLoading}
            className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted text-primary-foreground font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
          >
            {state.isLoading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Analyzing Repository...
              </>
            ) : (
              "Ask AI"
            )}
          </button>
        </form>

        {state.error && (
          <div className="mt-4">
            <ErrorMessage error={state.error} onRetry={clearError} />
          </div>
        )}
      </div>

      {/* Analysis Progress */}
      {state.isLoading && (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">
              AI Analysis in Progress
            </h3>
          </div>

          <div className="space-y-4">
            {analysisProgress.steps.map((step) => (
              <ProgressStep
                key={step.id}
                step={step.id}
                title={step.title}
                description={step.description}
                status={step.status}
                icon={
                  step.id === 1 ? (
                    <Database className="w-4 h-4" />
                  ) : step.id === 2 ? (
                    <GitBranch className="w-4 h-4" />
                  ) : (
                    <Brain className="w-4 h-4" />
                  )
                }
              />
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <div className="flex items-center space-x-2 text-blue-400">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">
                This may take a few moments...
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              The AI is analyzing repository data, commit history, and
              generating insights based on your question.
            </p>
          </div>
        </div>
      )}

      {/* Example Questions */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mt-6">
        <h3 className="text-lg font-medium text-white mb-2">
          Example Questions
        </h3>
        <p className="text-sm text-gray-300 mb-4">
          Click any question below to automatically fill the question field
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {exampleQuestions.map((question, index) => {
            const isSelected = selectedExampleQuestion === question;
            return (
              <button
                key={index}
                onClick={() => handleExampleClick(question)}
                className={`group text-left p-3 border rounded-md transition-all duration-200 text-sm hover:shadow-sm ${
                  isSelected
                    ? "bg-blue-600/20 border-blue-500/50 text-white shadow-sm"
                    : "bg-gray-700 hover:bg-blue-600/20 border-gray-600 hover:border-blue-500/30 text-gray-200 hover:text-white"
                }`}
              >
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0 w-5 h-5 mt-0.5">
                    <div
                      className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                        isSelected
                          ? "bg-blue-500"
                          : "bg-blue-400/60 group-hover:bg-blue-500"
                      }`}
                    ></div>
                  </div>
                  <span className="flex-1">{question}</span>
                  {isSelected && (
                    <div className="flex-shrink-0 text-blue-500">✓</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* AI Response */}
      {response && (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">AI Analysis</h3>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Model: {response.model_used}</span>
            </div>
          </div>

          {/* Question Section */}
          <div className="mb-6 p-4 bg-gray-700/50 border border-gray-600 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
              <div className="text-sm font-medium text-blue-400">Question</div>
            </div>
            <div className="text-gray-100 text-base leading-relaxed">
              {response.question}
            </div>
          </div>

          {/* Repository Info */}
          <div className="mb-6 p-4 bg-gray-700/50 border border-gray-600 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-1 h-4 bg-green-500 rounded-full"></div>
              <div className="text-sm font-medium text-green-400">
                Repository Analysis
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-400 mb-1">Repository</div>
                <div className="text-gray-100 font-medium">
                  {response.repository}
                </div>
                <div className="text-sm text-gray-400">
                  Branch: {response.branch}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Analysis Scope</div>
                <div className="text-gray-100 font-medium">
                  {response.analysis_data.commits_analyzed} commits analyzed
                </div>
                <div className="text-sm text-gray-400">
                  Comprehensive review
                </div>
              </div>
            </div>
          </div>

          {/* AI Response */}
          <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
              <div className="text-sm font-medium text-blue-400">
                AI Response
              </div>
            </div>
            <div className="prose prose-invert max-w-none">
              <FormattedAIResponse response={response.ai_response} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatForm;
