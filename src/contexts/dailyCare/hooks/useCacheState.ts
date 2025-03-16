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

  // Reduced cache expiration time (5 minutes to reduce stale data issues)
  const CACHE_EXPIRATION = 5 * 60 * 1000;
  
  const getCachedStatus = (dateString: string): DogCareStatus[] | null => {
    const now = Date.now();
    
    // Check if we have cached data that's not expired
    if (
      careStatusCache.current[dateString] && 
      now - careStatusCache.current[dateString].timestamp < CACHE_EXPIRATION &&
      careStatusCache.current[dateString].data.length > 0 // Ensure we have actual data
    ) {
      console.log(`📋 Found valid cache for ${dateString} with ${careStatusCache.current[dateString].data.length} dogs`);
      
      // Ensure each dog has at most one special_attention flag
      const dedupedData = careStatusCache.current[dateString].data.map(dog => {
        if (!dog.flags || dog.flags.length === 0) return dog;
        
        const specialAttentionFlags = dog.flags.filter(f => f.type === 'special_attention');
        if (specialAttentionFlags.length <= 1) return dog;
        
        // Keep only the first special attention flag
        const firstFlag = specialAttentionFlags[0];
        return {
          ...dog,
          flags: dog.flags.filter(f => f.type !== 'special_attention' || f === firstFlag)
        };
      });
      
      return dedupedData;
    }
    
    console.log(`📋 No valid cache found for ${dateString}`);
    return null;
  };
  
  const setCachedStatus = (dateString: string, data: DogCareStatus[]) => {
    if (!data || data.length === 0) {
      console.log(`⚠️ Not caching empty data for ${dateString}`);
      return;
    }
    
    // Ensure each dog has at most one special_attention flag before caching
    const dedupedData = data.map(dog => {
      if (!dog.flags || dog.flags.length === 0) return dog;
      
      const specialAttentionFlags = dog.flags.filter(f => f.type === 'special_attention');
      if (specialAttentionFlags.length <= 1) return dog;
      
      // Keep only the first special attention flag
      const firstFlag = specialAttentionFlags[0];
      return {
        ...dog,
        flags: dog.flags.filter(f => f.type !== 'special_attention' || f === firstFlag)
      };
    });
    
    console.log(`📋 Caching ${dedupedData.length} dogs for ${dateString}`);
    careStatusCache.current[dateString] = {
      timestamp: Date.now(),
      data: dedupedData
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
