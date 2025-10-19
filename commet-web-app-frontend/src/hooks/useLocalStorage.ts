import { useState } from "react";
import ApiService from "../services/api";

// Hook for managing localStorage with React state
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] => {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // Save state
      setStoredValue(valueToStore);

      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

// Hook for managing GitHub token specifically
export const useGithubToken = () => {
  const [token, setToken] = useLocalStorage<string | null>(
    "github_token",
    null
  );

  const setGithubToken = (newToken: string | null) => {
    setToken(newToken);
  };

  const clearGithubToken = () => {
    setToken(null);
  };

  const isValidToken = (tokenToCheck: string): boolean => {
    return ApiService.validateTokenFormat(tokenToCheck);
  };

  return {
    token,
    setGithubToken,
    clearGithubToken,
    isValidToken,
    hasToken: !!token,
  };
};

// Hook for managing recent repositories
export const useRecentRepositories = () => {
  const [repositories, setRepositories] = useLocalStorage<string[]>(
    "recent_repositories",
    []
  );

  const addRepository = (repository: string) => {
    if (!repository || !ApiService.validateRepositoryFormat(repository)) {
      return;
    }

    setRepositories((prev) => {
      // Remove if already exists
      const filtered = prev.filter((repo) => repo !== repository);
      // Add to beginning
      const updated = [repository, ...filtered];
      // Keep only last 10
      return updated.slice(0, 10);
    });
  };

  const removeRepository = (repository: string) => {
    setRepositories((prev) => prev.filter((repo) => repo !== repository));
  };

  const clearRepositories = () => {
    setRepositories([]);
  };

  return {
    repositories,
    addRepository,
    removeRepository,
    clearRepositories,
  };
};

// Hook for managing app settings
export const useAppSettings = () => {
  const [settings, setSettings] = useLocalStorage("app_settings", {
    theme: "light",
    defaultBranch: "main",
    defaultCommitLimit: 20,
    showFileChanges: true,
    autoRefresh: false,
    refreshInterval: 30000, // 30 seconds
  });

  const updateSetting = <K extends keyof typeof settings>(
    key: K,
    value: (typeof settings)[K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetSettings = () => {
    setSettings({
      theme: "light",
      defaultBranch: "main",
      defaultCommitLimit: 20,
      showFileChanges: true,
      autoRefresh: false,
      refreshInterval: 30000,
    });
  };

  return {
    settings,
    updateSetting,
    resetSettings,
  };
};
