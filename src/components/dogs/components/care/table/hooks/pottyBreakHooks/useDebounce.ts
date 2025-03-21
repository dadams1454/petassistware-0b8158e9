
import { useRef, useCallback, useEffect } from 'react';

export const useDebounce = (delay: number = 1000) => {
  const debounceTimerRef = useRef<number | null>(null);
  
  // Clean up the timer when component unmounts
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, []);
  
  const debounce = useCallback((callback: () => void) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = window.setTimeout(() => {
      callback();
      debounceTimerRef.current = null;
    }, delay);
  }, [delay]);
  
  const cancelDebounce = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, []);
  
  return {
    debounce,
    cancelDebounce,
    isPending: debounceTimerRef.current !== null
  };
};
