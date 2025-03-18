import { useRef } from 'react';
import { DogCareStatus, DogFlag } from '@/types/dailyCare';

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
   * while preserving the association between dogs and their flags
   */
  const deduplicateSpecialAttentionFlags = (dogs: DogCareStatus[]): DogCareStatus[] => {
    // Create a new array to avoid mutation issues
    return dogs.map(dog => {
      // If the dog has no flags, return unchanged
      if (!dog.flags || dog.flags.length === 0) return dog;
      
      // Group flags by type for deduplication
      const flagsByType: Record<string, DogFlag[]> = {};
      
      // First, group all flags by their type
      dog.flags.forEach(flag => {
        if (!flagsByType[flag.type]) {
          flagsByType[flag.type] = [];
        }
        flagsByType[flag.type].push(flag);
      });
      
      // Create a new array of deduplicated flags
      const deduplicatedFlags: DogFlag[] = [];
      
      // For each flag type, take appropriate action
      Object.keys(flagsByType).forEach(flagType => {
        // For special_attention, only keep the first one
        if (flagType === 'special_attention' && flagsByType[flagType].length > 0) {
          deduplicatedFlags.push(flagsByType[flagType][0]);
        } 
        // For all other flag types, keep all flags (or implement specific deduplication logic)
        else {
          deduplicatedFlags.push(...flagsByType[flagType]);
        }
      });
      
      // Return dog with deduplicated flags, maintaining the dog-to-flag association
      return {
        ...dog,
        flags: deduplicatedFlags
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
    
    // Make a deep copy of the data to avoid reference issues
    const dogsCopy = JSON.parse(JSON.stringify(data));
    
    // Deduplicate special attention flags before caching
    const dedupedData = deduplicateSpecialAttentionFlags(dogsCopy);
    
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
