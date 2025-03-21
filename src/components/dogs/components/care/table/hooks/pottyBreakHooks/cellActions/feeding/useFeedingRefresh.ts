
import { useRef, useCallback } from 'react';

export interface UseFeedingRefreshProps {
  onRefresh?: () => void;
}

export const useFeedingRefresh = ({ onRefresh }: UseFeedingRefreshProps) => {
  // Create a debounced refresh function
  const refreshDebounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const triggerDebouncedRefresh = useCallback(() => {
    if (refreshDebounceTimeoutRef.current) {
      clearTimeout(refreshDebounceTimeoutRef.current);
    }
    
    refreshDebounceTimeoutRef.current = setTimeout(() => {
      if (onRefresh) {
        console.log('🔄 Executing debounced feeding refresh');
        onRefresh();
      }
      refreshDebounceTimeoutRef.current = null;
    }, 1000); // 1 second debounce
  }, [onRefresh]);
  
  // Clean up function to be called on unmount
  const cleanupRefresh = useCallback(() => {
    if (refreshDebounceTimeoutRef.current) {
      clearTimeout(refreshDebounceTimeoutRef.current);
      refreshDebounceTimeoutRef.current = null;
    }
  }, []);
  
  return {
    triggerDebouncedRefresh,
    cleanupRefresh
  };
};
