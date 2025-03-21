
import { useRef, useCallback } from 'react';

export const useDebounce = (delay: number = 300) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const debounce = useCallback((fn: () => void) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    timerRef.current = setTimeout(() => {
      fn();
      timerRef.current = null;
    }, delay);
  }, [delay]);
  
  // Clear debounce timer when component unmounts
  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return { debounce, cleanup };
};
