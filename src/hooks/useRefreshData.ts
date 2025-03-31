
import { useState, useEffect, useCallback } from 'react';
import { useRefresh } from '@/contexts/RefreshContext';

interface UseRefreshDataParams<T> {
  key: string;
  fetchData: () => Promise<T>;
  dependencies?: any[];
  loadOnMount?: boolean;
}

export function useRefreshData<T>({
  key,
  fetchData,
  dependencies = [],
  loadOnMount = false,
}: UseRefreshDataParams<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { refreshTrigger } = useRefresh();

  const refresh = useCallback(
    async (showLoading = true) => {
      if (showLoading) {
        setIsLoading(true);
      }
      
      try {
        const result = await fetchData();
        setData(result);
        setError(null);
        return result;
      } catch (err) {
        console.error(`Error fetching data for ${key}:`, err);
        setError(err as Error);
        return null;
      } finally {
        if (showLoading) {
          setIsLoading(false);
        }
      }
    },
    [fetchData, key]
  );

  useEffect(() => {
    if (loadOnMount) {
      refresh(true);
    }
  }, [loadOnMount, refresh]);

  useEffect(() => {
    // Refresh when dependencies change or when refresh is triggered
    refresh(false);
  }, [refreshTrigger, ...dependencies, refresh]);

  return {
    data,
    isLoading,
    error,
    refresh,
  };
}
