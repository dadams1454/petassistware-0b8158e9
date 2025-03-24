
import { useEffect, useRef, useCallback } from 'react';

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
  
  // Add reset function for manual tracking
  const resetTracking = useCallback(() => {
    renderCount.current = 0;
    lastRenderTime.current = performance.now();
  }, []);
  
  return { 
    renderCount: renderCount.current,
    resetTracking
  };
};

/**
 * Enhanced hook to measure and report function execution time
 * with better performance metrics tracking
 */
export const usePerformanceTracking = () => {
  const metricsRef = useRef<Record<string, { 
    count: number, 
    totalTime: number, 
    maxTime: number 
  }>>({});
  
  // Only return active tracking in development mode
  if (process.env.NODE_ENV !== 'development') {
    return {
      trackExecution: (_name: string, fn: Function, ...args: any[]) => fn(...args),
      getMetrics: () => ({})
    };
  }
  
  // Actual tracking logic for development
  const trackExecution = useCallback(<T extends any[]>(
    name: string, 
    fn: (...args: T) => any, 
    ...args: T
  ) => {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    const executionTime = end - start;
    
    // Update metrics
    if (!metricsRef.current[name]) {
      metricsRef.current[name] = { count: 0, totalTime: 0, maxTime: 0 };
    }
    
    const metric = metricsRef.current[name];
    metric.count++;
    metric.totalTime += executionTime;
    metric.maxTime = Math.max(metric.maxTime, executionTime);
    
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
  }, []);
  
  // Get aggregated metrics
  const getMetrics = useCallback(() => {
    return Object.entries(metricsRef.current).reduce((acc, [name, data]) => {
      acc[name] = {
        ...data,
        avgTime: data.count > 0 ? data.totalTime / data.count : 0
      };
      return acc;
    }, {} as Record<string, any>);
  }, []);
  
  return { 
    trackExecution,
    getMetrics
  };
};

/**
 * Debounce function with proper typings and cleanup
 */
export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): { 
  (...args: Parameters<T>): void;
  cancel: () => void;
} => {
  let timeoutId: NodeJS.Timeout | null = null;
  
  const debouncedFn = (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
  
  debouncedFn.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };
  
  return debouncedFn;
};

/**
 * Throttle function with proper typings and execution guarantees
 */
export const throttle = <T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): { 
  (...args: Parameters<T>): void;
  cancel: () => void;
} => {
  let waiting = false;
  let lastArgs: Parameters<T> | null = null;
  let timeoutId: NodeJS.Timeout | null = null;
  
  const throttledFn = (...args: Parameters<T>) => {
    if (waiting) {
      lastArgs = args;
      return;
    }
    
    fn(...args);
    waiting = true;
    
    timeoutId = setTimeout(() => {
      waiting = false;
      if (lastArgs) {
        fn(...lastArgs);
        lastArgs = null;
      }
    }, limit);
  };
  
  throttledFn.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    waiting = false;
    lastArgs = null;
  };
  
  return throttledFn;
};

// Memory optimization utilities
export const memoizeWithExpiry = <T extends (...args: any[]) => any>(
  fn: T, 
  keyFn?: (...args: Parameters<T>) => string,
  expiryMs: number = 60000
) => {
  const cache = new Map<string, { 
    value: ReturnType<T>; 
    timestamp: number;
  }>();
  
  return (...args: Parameters<T>): ReturnType<T> => {
    const key = keyFn ? keyFn(...args) : JSON.stringify(args);
    const now = Date.now();
    const cachedItem = cache.get(key);
    
    if (cachedItem && now - cachedItem.timestamp < expiryMs) {
      return cachedItem.value;
    }
    
    const result = fn(...args);
    cache.set(key, { value: result, timestamp: now });
    
    // Clean up expired items occasionally
    if (cache.size > 50) {
      for (const [cacheKey, item] of cache.entries()) {
        if (now - item.timestamp > expiryMs) {
          cache.delete(cacheKey);
        }
      }
    }
    
    return result;
  };
};
