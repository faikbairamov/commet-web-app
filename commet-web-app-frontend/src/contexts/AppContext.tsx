import React, {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
} from "react";
import type { AppState, GitHubUser, UserRepository } from "../types/index.js";

// Action types
type AppAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_GITHUB_TOKEN"; payload: string | null }
  | { type: "SET_CURRENT_REPOSITORY"; payload: string | null }
  | { type: "SET_CURRENT_BRANCH"; payload: string | null }
  | { type: "SET_AUTHENTICATED_USER"; payload: GitHubUser | null }
  | { type: "SET_ACCESS_TOKEN"; payload: string | null }
  | { type: "SET_USER_REPOSITORIES"; payload: UserRepository[] }
  | { type: "CLEAR_ERROR" }
  | { type: "RESET_STATE" };

// Initial state
const initialState: AppState = {
  isLoading: false,
  error: null,
  githubToken: localStorage.getItem("github_token"),
  currentRepository: null,
  currentBranch: null,
  authenticatedUser: null,
  accessToken: localStorage.getItem("github_access_token"),
  userRepositories: [],
};

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };

    case "SET_GITHUB_TOKEN":
      if (action.payload) {
        localStorage.setItem("github_token", action.payload);
      } else {
        localStorage.removeItem("github_token");
      }
      return { ...state, githubToken: action.payload };

    case "SET_CURRENT_REPOSITORY":
      return { ...state, currentRepository: action.payload };

    case "SET_CURRENT_BRANCH":
      return { ...state, currentBranch: action.payload };

    case "SET_AUTHENTICATED_USER":
      return { ...state, authenticatedUser: action.payload };

    case "SET_ACCESS_TOKEN":
      if (action.payload) {
        localStorage.setItem("github_access_token", action.payload);
      } else {
        localStorage.removeItem("github_access_token");
      }
      return { ...state, accessToken: action.payload };

    case "SET_USER_REPOSITORIES":
      return { ...state, userRepositories: action.payload };

    case "CLEAR_ERROR":
      return { ...state, error: null };

    case "RESET_STATE":
      return initialState;

    default:
      return state;
  }
};

// Context type
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setGithubToken: (token: string | null) => void;
  setCurrentRepository: (repository: string | null) => void;
  setCurrentBranch: (branch: string | null) => void;
  setAuthenticatedUser: (user: GitHubUser | null) => void;
  setAccessToken: (token: string | null) => void;
  setUserRepositories: (repositories: UserRepository[]) => void;
  clearError: () => void;
  resetState: () => void;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Action creators
  const setLoading = (loading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: "SET_ERROR", payload: error });
  };

  const setGithubToken = (token: string | null) => {
    dispatch({ type: "SET_GITHUB_TOKEN", payload: token });
  };

  const setCurrentRepository = (repository: string | null) => {
    dispatch({ type: "SET_CURRENT_REPOSITORY", payload: repository });
  };

  const setCurrentBranch = (branch: string | null) => {
    dispatch({ type: "SET_CURRENT_BRANCH", payload: branch });
  };

  const setAuthenticatedUser = (user: GitHubUser | null) => {
    dispatch({ type: "SET_AUTHENTICATED_USER", payload: user });
  };

  const setAccessToken = (token: string | null) => {
    dispatch({ type: "SET_ACCESS_TOKEN", payload: token });
  };

  const setUserRepositories = (repositories: UserRepository[]) => {
    dispatch({ type: "SET_USER_REPOSITORIES", payload: repositories });
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const resetState = () => {
    dispatch({ type: "RESET_STATE" });
  };

  const value: AppContextType = {
    state,
    dispatch,
    setLoading,
    setError,
    setGithubToken,
    setCurrentRepository,
    setCurrentBranch,
    setAuthenticatedUser,
    setAccessToken,
    setUserRepositories,
    clearError,
    resetState,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the context
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export default AppContext;
