
import { useState, useCallback } from 'react';

/**
 * Type for the return value of the useLoading hook
 */
export interface UseLoadingResult {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  withLoading: <T>(fn: () => Promise<T>) => Promise<T>;
}

/**
 * Custom hook to manage loading state with proper typing
 * 
 * @returns {UseLoadingResult} An object containing loading state and helper functions
 */
export const useLoading = (): UseLoadingResult => {
  const [loading, setLoading] = useState<boolean>(false);
  
  /**
   * Utility function to wrap async operations with automatic loading state management
   * @param fn Async function to execute
   * @returns A promise that resolves to the result of fn
   */
  const withLoading = useCallback(<T>(fn: () => Promise<T>): Promise<T> => {
    setLoading(true);
    
    return fn()
      .finally(() => {
        setLoading(false);
      });
  }, []);
  
  return {
    loading,
    setLoading,
    withLoading
  };
};
