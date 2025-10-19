import { useState, useCallback } from "react";
import { useApp } from "../contexts/AppContext";
import ApiService from "../services/api";

// Generic API hook for handling async operations
export const useApi = <T>() => {
  const [data, setData] = useState<T | null>(null);
  const { setLoading, setError, clearError } = useApp();

  const execute = useCallback(
    async (apiCall: () => Promise<T>) => {
      try {
        setLoading(true);
        clearError();
        const result = await apiCall();
        setData(result);
        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, clearError]
  );

  const reset = useCallback(() => {
    setData(null);
    clearError();
  }, [clearError]);

  return {
    data,
    execute,
    reset,
    isLoading: useApp().state.isLoading,
    error: useApp().state.error,
  };
};

// Hook for repository operations
export const useRepository = () => {
  const api = useApi();

  const getRepository = useCallback(
    async (repository: string, token?: string) => {
      return api.execute(() => ApiService.getRepository(repository, token));
    },
    [api]
  );

  return {
    ...api,
    getRepository,
  };
};

// Hook for commits operations
export const useCommits = () => {
  const api = useApi();

  const getCommits = useCallback(
    async (
      repository: string,
      branch?: string,
      limit: number = 10,
      token?: string
    ) => {
      return api.execute(() =>
        ApiService.getCommits(repository, branch, limit, token)
      );
    },
    [api]
  );

  const getCommitDetails = useCallback(
    async (
      repository: string,
      branch?: string,
      limit: number = 10,
      token?: string
    ) => {
      return api.execute(() =>
        ApiService.getCommitDetails(repository, branch, limit, token)
      );
    },
    [api]
  );

  return {
    ...api,
    getCommits,
    getCommitDetails,
  };
};

// Hook for health check
export const useHealthCheck = () => {
  const api = useApi();

  const checkHealth = useCallback(async () => {
    return api.execute(() => ApiService.healthCheck());
  }, [api]);

  return {
    ...api,
    checkHealth,
  };
};
