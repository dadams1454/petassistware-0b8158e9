
import { useEffect, useState, useCallback, useRef } from 'react';
import { useRefresh } from '@/contexts/RefreshContext';

interface UseRefreshDataOptions<T> {
  key: string; // Unique key for this refresh operation
  fetchData: () => Promise<T>;
  dependencies?: any[];
  loadOnMount?: boolean;
  refreshOnDependencyChange?: boolean;
  errorRetryCount?: number;
  errorRetryDelay?: number;
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
  refreshOnDependencyChange = true,
  errorRetryCount = 2,
  errorRetryDelay = 3000
}: UseRefreshDataOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(loadOnMount);
  const [error, setError] = useState<Error | null>(null);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const initialLoadDone = useRef(false);
  const isRetrying = useRef(false);
  
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
      
      // Reset retry attempts on success
      if (retryAttempts > 0) {
        setRetryAttempts(0);
      }
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      setError(error);
      
      // Implement auto-retry logic if retry count is not exceeded
      if (retryAttempts < errorRetryCount && !isRetrying.current) {
        console.log(`Auto-retrying for ${key} - attempt ${retryAttempts + 1}/${errorRetryCount}`);
        isRetrying.current = true;
        setRetryAttempts(prev => prev + 1);
        
        setTimeout(() => {
          isRetrying.current = false;
          refresh(false);
        }, errorRetryDelay);
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [key, fetchData, refreshSpecific, retryAttempts, errorRetryCount, errorRetryDelay]);
  
  // Load data on mount if specified - but only ONCE
  useEffect(() => {
    if (loadOnMount && !initialLoadDone.current) {
      initialLoadDone.current = true;
      refresh(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Refresh when dependencies change if enabled
  useEffect(() => {
    // Skip the initial run to avoid double fetching with loadOnMount
    if (refreshOnDependencyChange && initialLoadDone.current) {
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
    isRefreshing,
    retryAttempts
  };
}

/**
 * Simplified hook that returns a refresh function for the entire application
 * This is used for buttons and other UI elements that need to trigger a refresh
 */
export function useRefreshTrigger() {
  const { refreshAll } = useRefresh();
  return refreshAll;
}
