// GitHub API Response Types
export interface GitHubUser {
  name: string;
  email: string;
  date: string;
}

export interface CommitStats {
  additions: number;
  deletions: number;
  total: number;
}

export interface FileChange {
  filename: string;
  status: "added" | "removed" | "modified" | "renamed";
  additions: number;
  deletions: number;
  changes: number;
  patch?: string;
  previous_filename?: string;
}

export interface Commit {
  sha: string;
  message: string;
  author: GitHubUser;
  committer: GitHubUser;
  url: string;
  api_url?: string;
  stats: CommitStats;
  file_changes?: FileChange[];
}

export interface CommitsResponse {
  repository: string;
  branch: string;
  total_commits: number;
  commits: Commit[];
}

export interface RepositoryOwner {
  login: string;
  type: string;
  avatar_url: string;
  url: string;
}

export interface RepositoryLanguages {
  [key: string]: number;
}

export interface Repository {
  name: string;
  full_name: string;
  description: string;
  url: string;
  clone_url: string;
  ssh_url: string;
  language: string;
  languages: RepositoryLanguages;
  stars: number;
  forks: number;
  watchers: number;
  open_issues: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  default_branch: string;
  is_private: boolean;
  owner: RepositoryOwner;
}

export interface ApiError {
  error: string;
  details?: string;
}

// Application State Types
export interface AppState {
  isLoading: boolean;
  error: string | null;
  githubToken: string | null;
  currentRepository: string | null;
  currentBranch: string | null;
  authenticatedUser: GitHubUser | null;
  accessToken: string | null;
  userRepositories: UserRepository[];
}

// Form Types
export interface RepositoryFormData {
  repository: string;
  branch?: string;
  limit?: number;
  token?: string;
}

export interface MultiRepositoryFormData {
  repositories: string[];
  branch?: string;
  limit?: number;
  token?: string;
}

export interface TokenFormData {
  token: string;
}

// Navigation Types
export interface NavItem {
  name: string;
  href: string;
  icon?: React.ComponentType<any>;
  current?: boolean;
}

// Component Props Types
export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export interface ErrorMessageProps {
  error: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export interface RepositoryCardProps {
  repository: Repository;
  className?: string;
}

export interface CommitCardProps {
  commit: Commit;
  showDetails?: boolean;
  className?: string;
}

export interface FileChangeCardProps {
  fileChange: FileChange;
  className?: string;
}

// AI Chat Types
export interface ChatRequest {
  question: string;
  repo: string;
  token?: string;
  branch?: string;
  commits_limit?: number;
}

export interface ChatResponse {
  question: string;
  repository: string;
  branch: string;
  analysis_data: {
    repository_info: Repository;
    commits_analyzed: number;
    commits_limit: number;
  };
  ai_response: string;
  model_used: string;
}

export interface ChatFormData {
  question: string;
  repository: string;
  branch?: string;
  commits_limit?: number;
}

// User Management Types
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface UsersResponse {
  users: User[];
}

export interface CreateUserRequest {
  name: string;
  email: string;
}

export interface CreateUserResponse {
  message: string;
  user: User;
}

// Server Response Types
export interface ServerStatus {
  message: string;
  status: string;
  port: number;
}

export interface HealthResponse {
  status: string;
  message: string;
}

// API Error Response
export interface ApiErrorResponse {
  error: string;
  details?: string;
}

// GitHub OAuth Types
export interface GitHubUser {
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

export interface UserRepository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  url: string;
  clone_url: string;
  language: string;
  stars: number;
  forks: number;
  watchers: number;
  open_issues: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  default_branch: string;
  is_private: boolean;
  size: number;
  owner: {
    login: string;
    type: string;
    avatar_url: string;
    url: string;
  };
}

export interface UserRepositoriesResponse {
  repositories: UserRepository[];
  total: number;
}

export interface AuthResponse {
  auth_url: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: GitHubUser | null;
  accessToken: string | null;
  repositories: UserRepository[];
}
