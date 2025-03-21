
import { useRef, useCallback } from 'react';

export const useDebounce = (delay: number = 1000) => {
  const debounceTimerRef = useRef<number | null>(null);
  
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
    cancelDebounce
  };
};
