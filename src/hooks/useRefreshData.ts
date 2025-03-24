
import { useEffect, useState, useCallback } from 'react';
import { useRefresh } from '@/contexts/RefreshContext';

interface UseRefreshDataOptions<T> {
  key: string; // Unique key for this refresh operation
  fetchData: () => Promise<T>;
  dependencies?: any[];
  loadOnMount?: boolean;
  refreshOnDependencyChange?: boolean;
}

/**
 * A hook that uses the centralized refresh context to manage data fetching
 * This can replace many of the custom hooks throughout the application
 */
export function useRefreshData<T>({
  key,
  fetchData,
  dependencies = [],
  loadOnMount = true,
  refreshOnDependencyChange = true
}: UseRefreshDataOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(loadOnMount);
  const [error, setError] = useState<Error | null>(null);
  
  const { refreshSpecific, refreshStatus } = useRefresh();
  
  // The actual refresh function
  const refresh = useCallback(async (showToast = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use the centralized refresh system
      const result = await refreshSpecific(key, fetchData, showToast);
      
      if (result !== null) {
        setData(result);
      }
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [key, fetchData, refreshSpecific]);
  
  // Load data on mount if specified
  useEffect(() => {
    if (loadOnMount) {
      refresh(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Refresh when dependencies change if enabled
  useEffect(() => {
    if (refreshOnDependencyChange && !loadOnMount) {
      refresh(false);
    }
    // We want to specifically exclude refresh from dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
  
  // Check if this specific operation is refreshing
  const isRefreshing = refreshStatus[key] || false;
  
  return {
    data,
    isLoading: isLoading || isRefreshing,
    error,
    refresh,
    isRefreshing
  };
}
