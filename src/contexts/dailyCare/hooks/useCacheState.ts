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
  
  /**
   * Deduplicates special attention flags on a dog object
   */
  const deduplicateSpecialAttentionFlags = (dogs: DogCareStatus[]): DogCareStatus[] => {
    return dogs.map(dog => {
      if (!dog.flags || dog.flags.length === 0) return dog;
      
      // Find all special attention flags
      const specialAttentionFlags = dog.flags.filter(f => f.type === 'special_attention');
      
      // If there's only 0 or 1, no deduplication needed
      if (specialAttentionFlags.length <= 1) return dog;
      
      // Keep only the first special attention flag, filter out others
      const firstSpecialAttentionFlag = specialAttentionFlags[0];
      
      // Return dog with deduplicated flags
      return {
        ...dog,
        flags: [
          ...dog.flags.filter(f => f.type !== 'special_attention'),
          firstSpecialAttentionFlag
        ]
      };
    });
  };
  
  const getCachedStatus = (dateString: string): DogCareStatus[] | null => {
    const now = Date.now();
    
    // Check if we have cached data that's not expired
    if (
      careStatusCache.current[dateString] && 
      now - careStatusCache.current[dateString].timestamp < CACHE_EXPIRATION &&
      careStatusCache.current[dateString].data.length > 0 // Ensure we have actual data
    ) {
      console.log(`📋 Found valid cache for ${dateString} with ${careStatusCache.current[dateString].data.length} dogs`);
      
      // Deduplicate special attention flags before returning
      return deduplicateSpecialAttentionFlags(careStatusCache.current[dateString].data);
    }
    
    console.log(`📋 No valid cache found for ${dateString}`);
    return null;
  };
  
  const setCachedStatus = (dateString: string, data: DogCareStatus[]) => {
    if (!data || data.length === 0) {
      console.log(`⚠️ Not caching empty data for ${dateString}`);
      return;
    }
    
    // Deduplicate special attention flags before caching
    const dedupedData = deduplicateSpecialAttentionFlags(data);
    
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
