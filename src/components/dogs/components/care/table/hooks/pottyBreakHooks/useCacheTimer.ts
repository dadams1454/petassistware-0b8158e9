
import { useRef } from 'react';

export const useCacheTimer = (cacheTTL: number = 20000) => {
  const cacheTimeoutRef = useRef<number>(0);
  
  const shouldRefresh = (forceRefresh: boolean = false): boolean => {
    const now = Date.now();
    
    // Skip refresh if it's been less than cacheTTL milliseconds since last refresh
    // unless forceRefresh=true is passed
    if (!forceRefresh && now - cacheTimeoutRef.current < cacheTTL) {
      console.log('⏳ Skipping care logs refresh - recently refreshed');
      return false;
    }
    
    return true;
  };
  
  const updateCacheTimestamp = (): void => {
    cacheTimeoutRef.current = Date.now();
  };
  
  const resetCache = (): void => {
    cacheTimeoutRef.current = 0;
  };
  
  return {
    shouldRefresh,
    updateCacheTimestamp,
    resetCache
  };
};
