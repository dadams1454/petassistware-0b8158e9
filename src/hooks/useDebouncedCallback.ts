
import { useCallback, useRef, useEffect } from 'react';

/**
 * A hook that returns a debounced version of the callback function.
 * The returned function will only execute after the specified delay has passed
 * without the function being called again.
 * 
 * @param callback The function to debounce
 * @param delay The delay in milliseconds (default: 300ms)
 * @returns A debounced version of the callback function
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay = 300
): (...args: Parameters<T>) => void {
  // Use refs to store the callback and timeout ID to avoid recreating the debounced function
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update the callback ref when the callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cleanup the timeout when the component unmounts or when the delay changes
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [delay]);

  // Return a memoized debounced version of the callback
  return useCallback(
    (...args: Parameters<T>) => {
      // Cancel the previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Schedule a new execution
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
        timeoutRef.current = null;
      }, delay);
    },
    [delay]
  );
}
