import axios from "axios";
import type { AxiosResponse } from "axios";
import type {
  CommitsResponse,
  Repository,
  ChatRequest,
  ChatResponse,
  MultiProjectChatRequest,
  MultiProjectChatResponse,
  UsersResponse,
  CreateUserRequest,
  CreateUserResponse,
  ServerStatus,
  HealthResponse,
  GitHubUser,
  UserRepositoriesResponse,
  AuthResponse,
} from "../types/index.js";

// Base API configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Response Error:", error);

    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }

    if (error.code === "ECONNABORTED") {
      throw new Error("Request timeout - please try again");
    }

    if (error.response?.status === 404) {
      throw new Error("Repository not found or not accessible");
    }

    if (error.response?.status === 401) {
      throw new Error("Invalid or expired GitHub token");
    }

    if (error.response?.status === 403) {
      throw new Error("Rate limit exceeded - please try again later");
    }

    if (error.response?.status === 503) {
      throw new Error(
        "AI service not available - please check server configuration"
      );
    }

    throw new Error(error.message || "An unexpected error occurred");
  }
);

// API Service Class
export class ApiService {
  // Server status and health
  static async getServerStatus(): Promise<ServerStatus> {
    const response: AxiosResponse<ServerStatus> = await api.get("/");
    return response.data;
  }

  static async healthCheck(): Promise<HealthResponse> {
    const response: AxiosResponse<HealthResponse> = await api.get("/health");
    return response.data;
  }

  // User management endpoints
  static async getUsers(): Promise<UsersResponse> {
    const response: AxiosResponse<UsersResponse> = await api.get("/api/users");
    return response.data;
  }

  static async createUser(
    userData: CreateUserRequest
  ): Promise<CreateUserResponse> {
    const response: AxiosResponse<CreateUserResponse> = await api.post(
      "/api/users",
      userData
    );
    return response.data;
  }

  // Get repository information
  static async getRepository(
    repository: string,
    token?: string
  ): Promise<Repository> {
    const params: any = { repo: repository };
    if (token) {
      params.token = token;
    }

    const response: AxiosResponse<Repository> = await api.get("/api/git/repo", {
      params,
    });
    return response.data;
  }

  // Get commits
  static async getCommits(
    repository: string,
    branch?: string,
    limit: number = 10,
    token?: string
  ): Promise<CommitsResponse> {
    const params: any = {
      repo: repository,
      limit: limit.toString(),
    };

    if (branch) {
      params.branch = branch;
    }

    if (token) {
      params.token = token;
    }

    const response: AxiosResponse<CommitsResponse> = await api.get(
      "/api/git/commits",
      { params }
    );
    return response.data;
  }

  // Get detailed commits with code differences
  static async getCommitDetails(
    repository: string,
    branch?: string,
    limit: number = 10,
    token?: string
  ): Promise<CommitsResponse> {
    const params: any = {
      repo: repository,
      limit: limit.toString(),
    };

    if (branch) {
      params.branch = branch;
    }

    if (token) {
      params.token = token;
    }

    const response: AxiosResponse<CommitsResponse> = await api.get(
      "/api/git/commit-details",
      { params }
    );
    return response.data;
  }

  // Get repository branches
  static async getRepositoryBranches(
    repository: string,
    token?: string
  ): Promise<{ name: string; protected: boolean }[]> {
    const params: any = { repo: repository };
    if (token) {
      params.token = token;
    }

    const response: AxiosResponse<{ name: string; protected: boolean }[]> =
      await api.get("/api/git/branches", { params });
    return response.data;
  }

  // Validate repository format
  static validateRepositoryFormat(repository: string): boolean {
    const repoRegex = /^[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+$/;
    return repoRegex.test(repository);
  }

  // Validate GitHub token format
  static validateTokenFormat(token: string): boolean {
    // GitHub tokens start with ghp_, gho_, ghu_, ghs_, or ghr_
    const tokenRegex = /^gh[psou]_[a-zA-Z0-9_]{36}$/;
    return tokenRegex.test(token);
  }

  // Validate parameter combinations for GitHub endpoints
  static validateGitHubParams(
    repository: string,
    token?: string,
    branch?: string
  ): { isValid: boolean; error?: string } {
    if (!this.validateRepositoryFormat(repository)) {
      return {
        isValid: false,
        error: "Invalid repository format. Use 'owner/repo'",
      };
    }

    if (!token && !branch) {
      return {
        isValid: false,
        error: "Must provide either a GitHub token or branch name",
      };
    }

    if (token && !this.validateTokenFormat(token)) {
      return { isValid: false, error: "Invalid GitHub token format" };
    }

    return { isValid: true };
  }

  // Build repository URL
  static buildRepositoryUrl(repository: string): string {
    return `https://github.com/${repository}`;
  }

  // Build commit URL
  static buildCommitUrl(repository: string, sha: string): string {
    return `https://github.com/${repository}/commit/${sha}`;
  }

  // Format file size
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  // Format date
  static formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Format relative time
  static formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else {
      return this.formatDate(dateString);
    }
  }

  // AI Chat - Ask questions about a repository
  static async chatWithRepository(
    question: string,
    repository: string,
    token?: string,
    branch?: string,
    commitsLimit: number = 10
  ): Promise<ChatResponse> {
    // Validate parameters
    const validation = this.validateGitHubParams(repository, token, branch);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    const requestData: ChatRequest = {
      question,
      repo: repository,
      commits_limit: commitsLimit,
    };

    if (token) {
      requestData.token = token;
    }

    if (branch) {
      requestData.branch = branch;
    }

    const response: AxiosResponse<ChatResponse> = await api.post(
      "/api/chat",
      requestData
    );
    return response.data;
  }

  // Multi-Project AI Chat - Ask questions about multiple connected repositories
  static async chatWithMultipleRepositories(
    question: string,
    repositories: string[],
    token?: string,
    branch?: string,
    commitsLimit: number = 10
  ): Promise<MultiProjectChatResponse> {
    // Validate parameters
    if (repositories.length === 0) {
      throw new Error("At least one repository must be provided");
    }

    if (repositories.length > 5) {
      throw new Error("Maximum 5 repositories can be analyzed at once");
    }

    // Validate each repository format
    for (const repo of repositories) {
      if (!this.validateRepositoryFormat(repo)) {
        throw new Error(`Invalid repository format: ${repo}. Use 'owner/repo'`);
      }
    }

    const requestData: MultiProjectChatRequest = {
      question,
      repositories,
      commits_limit: commitsLimit,
    };

    if (token) {
      requestData.token = token;
    }

    if (branch) {
      requestData.branch = branch;
    }

    // Create a separate axios instance with longer timeout for multi-project requests
    const multiProjectApi = axios.create({
      baseURL: API_BASE_URL,
      timeout: 120000, // 2 minutes timeout for multi-project analysis
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor for logging
    multiProjectApi.interceptors.request.use(
      (config) => {
        console.log(
          `Multi-Project API Request: ${config.method?.toUpperCase()} ${
            config.url
          }`
        );
        return config;
      },
      (error) => {
        console.error("Multi-Project API Request Error:", error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    multiProjectApi.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.error("Multi-Project API Response Error:", error);

        if (error.response?.data?.error) {
          throw new Error(error.response.data.error);
        }

        if (error.code === "ECONNABORTED") {
          throw new Error(
            "Request timeout - multi-project analysis is taking longer than expected. Please try again with fewer repositories or a simpler question."
          );
        }

        if (error.response?.status === 404) {
          throw new Error("Repository not found or not accessible");
        }

        if (error.response?.status === 401) {
          throw new Error("Invalid or expired GitHub token");
        }

        if (error.response?.status === 403) {
          throw new Error("Rate limit exceeded - please try again later");
        }

        if (error.response?.status === 503) {
          throw new Error(
            "AI service not available - please check server configuration"
          );
        }

        throw new Error(error.message || "An unexpected error occurred");
      }
    );

    const response: AxiosResponse<MultiProjectChatResponse> =
      await multiProjectApi.post("/api/chat/multi-project", requestData);
    return response.data;
  }

  // GitHub OAuth Authentication
  static async initiateGitHubLogin(): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await api.get("/auth/github");
    return response.data;
  }

  static async getCurrentUser(accessToken: string): Promise<GitHubUser> {
    const response: AxiosResponse<GitHubUser> = await api.get("/auth/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  }

  static async getUserRepositories(
    accessToken: string,
    visibility: string = "all"
  ): Promise<UserRepositoriesResponse> {
    const response: AxiosResponse<UserRepositoriesResponse> = await api.get(
      "/auth/repositories",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: { visibility },
      }
    );
    return response.data;
  }

  static async logout(): Promise<{ message: string }> {
    const response: AxiosResponse<{ message: string }> = await api.post(
      "/auth/logout"
    );
    return response.data;
  }

  // Generate commit story
  static async generateCommitStory(
    repository: string,
    branch?: string,
    token?: string,
    commitsLimit: number = 20,
    storyStyle: "narrative" | "technical" | "casual" = "narrative"
  ): Promise<{
    repository: string;
    branch: string;
    story_style: string;
    total_commits_analyzed: number;
    story: string;
    commits_data: any[];
    repository_info: any;
  }> {
    // Validate parameters
    const validation = this.validateGitHubParams(repository, token, branch);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    const requestData: any = {
      repository,
      commits_limit: commitsLimit,
      story_style: storyStyle,
    };

    if (token) {
      requestData.token = token;
    }

    if (branch) {
      requestData.branch = branch;
    }

    const response: AxiosResponse<{
      repository: string;
      branch: string;
      story_style: string;
      total_commits_analyzed: number;
      story: string;
      commits_data: any[];
      repository_info: any;
    }> = await api.post("/api/git/commits/story", requestData);

    return response.data;
  }
}

export default ApiService;
