
import { useState, useCallback } from 'react';

/**
 * Custom hook to manage loading state
 */
export const useLoading = () => {
  const [loading, setLoading] = useState(false);
  
  const withLoading = useCallback(<T>(fn: () => Promise<T>): Promise<T> => {
    setLoading(true);
    return fn().finally(() => setLoading(false));
  }, []);
  
  return {
    loading,
    setLoading,
    withLoading
  };
};
