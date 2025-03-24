
import { useEffect, useRef } from 'react';

/**
 * Custom hook to measure and log component render performance
 * Only active in development mode
 */
export const useRenderPerformance = (componentName: string) => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(performance.now());
  
  useEffect(() => {
    // Only run in development mode
    if (process.env.NODE_ENV !== 'development') return;
    
    const currentTime = performance.now();
    const timeSinceLastRender = currentTime - lastRenderTime.current;
    renderCount.current += 1;
    
    // Log render statistics
    console.log(
      `%c[Performance] ${componentName} rendered (#${renderCount.current}): ${timeSinceLastRender.toFixed(2)}ms since last render`,
      'color: #7066e0; font-weight: bold;'
    );
    
    // Update last render time
    lastRenderTime.current = currentTime;
    
    // Show warning for rapid renders
    if (renderCount.current > 1 && timeSinceLastRender < 50) {
      console.warn(
        `%c[Performance Warning] ${componentName} re-rendered very quickly (${timeSinceLastRender.toFixed(2)}ms) - possible optimization opportunity`,
        'color: #e09c66; font-weight: bold;'
      );
    }
  });
  
  return { renderCount: renderCount.current };
};

/**
 * Hook to measure and report function execution time
 * Only active in development mode
 */
export const usePerformanceTracking = () => {
  // Only return active tracking in development mode
  if (process.env.NODE_ENV !== 'development') {
    return {
      trackExecution: (_name: string, fn: Function, ...args: any[]) => fn(...args)
    };
  }
  
  // Actual tracking logic for development
  const trackExecution = (name: string, fn: Function, ...args: any[]) => {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    const executionTime = end - start;
    
    console.log(
      `%c[Performance] ${name} executed in ${executionTime.toFixed(2)}ms`,
      'color: #66e0a3; font-weight: bold;'
    );
    
    // Log warning for slow operations
    if (executionTime > 100) {
      console.warn(
        `%c[Performance Warning] ${name} is slow (${executionTime.toFixed(2)}ms)`,
        'color: #e09c66; font-weight: bold;'
      );
    }
    
    return result;
  };
  
  return { trackExecution };
};

/**
 * Debounce function that returns a debounced version of the provided function
 */
export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
};

/**
 * Throttle function that returns a throttled version of the provided function
 */
export const throttle = <T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let waiting = false;
  let lastArgs: Parameters<T> | null = null;
  
  return (...args: Parameters<T>) => {
    if (waiting) {
      lastArgs = args;
      return;
    }
    
    fn(...args);
    waiting = true;
    
    setTimeout(() => {
      waiting = false;
      if (lastArgs) {
        fn(...lastArgs);
        lastArgs = null;
      }
    }, limit);
  };
};
