
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

  // Cache expiration time (15 minutes to ensure more frequent updates)
  const CACHE_EXPIRATION = 15 * 60 * 1000;
  
  const getCachedStatus = (dateString: string): DogCareStatus[] | null => {
    const now = Date.now();
    
    // Check if we have cached data that's not expired
    if (
      careStatusCache.current[dateString] && 
      now - careStatusCache.current[dateString].timestamp < CACHE_EXPIRATION &&
      careStatusCache.current[dateString].data.length > 0 // Ensure we have actual data
    ) {
      console.log(`📋 Found valid cache for ${dateString} with ${careStatusCache.current[dateString].data.length} dogs`);
      return careStatusCache.current[dateString].data;
    }
    
    console.log(`📋 No valid cache found for ${dateString}`);
    return null;
  };
  
  const setCachedStatus = (dateString: string, data: DogCareStatus[]) => {
    if (!data || data.length === 0) {
      console.log(`⚠️ Not caching empty data for ${dateString}`);
      return;
    }
    
    console.log(`📋 Caching ${data.length} dogs for ${dateString}`);
    careStatusCache.current[dateString] = {
      timestamp: Date.now(),
      data
    };
  };
  
  const clearCache = () => {
    console.log('🧹 Clearing dog data cache');
    careStatusCache.current = {};
  };
  
  return {
    getCachedStatus,
    setCachedStatus,
    clearCache
  };
};
