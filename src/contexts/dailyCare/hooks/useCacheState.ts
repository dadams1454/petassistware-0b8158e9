
import { useRef } from 'react';
import { DogCareStatus } from '@/types/dailyCare';

/**
 * Custom hook to manage cache state for dog care data
 */
export const useCacheState = () => {
  // Add cache to prevent repeated fetches
  const careStatusCache = useRef<{
    [dateString: string]: {
      timestamp: number;
      data: DogCareStatus[];
    }
  }>({});

  // Cache expiration time (30 minutes)
  const CACHE_EXPIRATION = 30 * 60 * 1000;
  
  const getCachedStatus = (dateString: string): DogCareStatus[] | null => {
    const now = Date.now();
    
    // Check if we have cached data that's not expired
    if (
      careStatusCache.current[dateString] && 
      now - careStatusCache.current[dateString].timestamp < CACHE_EXPIRATION
    ) {
      return careStatusCache.current[dateString].data;
    }
    
    return null;
  };
  
  const setCachedStatus = (dateString: string, data: DogCareStatus[]) => {
    careStatusCache.current[dateString] = {
      timestamp: Date.now(),
      data
    };
  };
  
  const clearCache = () => {
    careStatusCache.current = {};
  };
  
  return {
    getCachedStatus,
    setCachedStatus,
    clearCache
  };
};
