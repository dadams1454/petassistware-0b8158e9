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
   * Creates a deep copy of dog care status to ensure no reference issues
   */
  const deepCloneDogStatus = (dogs: DogCareStatus[]): DogCareStatus[] => {
    return dogs.map(dog => ({
      ...dog,
      // Ensure each dog gets its own copy of flags
      flags: dog.flags ? [...dog.flags].map(flag => ({...flag})) : []
    }));
  };
  
  /**
   * Ensures that all flags are properly formatted and deduplicated
   */
  const normalizeFlags = (dogs: DogCareStatus[]): DogCareStatus[] => {
    // Create a new array to avoid mutation issues
    return dogs.map(dog => {
      // If the dog has no flags, return unchanged
      if (!dog.flags || dog.flags.length === 0) return dog;
      
      // Group flags by type to normalize and deduplicate
      const flagsByType: Record<string, DogFlag[]> = {};
      
      // First, group all flags by their type
      dog.flags.forEach(flag => {
        if (!flag) return; // Skip null or undefined flags
        
        if (!flagsByType[flag.type]) {
          flagsByType[flag.type] = [];
        }
        flagsByType[flag.type].push({...flag}); // Create a copy of each flag
      });
      
      // Create a new array of normalized flags
      const normalizedFlags: DogFlag[] = [];
      
      // For each flag type, take appropriate action
      Object.keys(flagsByType).forEach(flagType => {
        // For special_attention, only keep one flag of each unique value
        if (flagType === 'special_attention' && flagsByType[flagType].length > 0) {
          // Group by value to deduplicate
          const valueGroups: Record<string, DogFlag> = {};
          flagsByType[flagType].forEach(flag => {
            const value = flag.value || 'needs_attention';
            if (!valueGroups[value]) {
              valueGroups[value] = {...flag};
            }
          });
          // Add each unique special attention flag
          Object.values(valueGroups).forEach(flag => {
            normalizedFlags.push(flag);
          });
        } 
        // For incompatible flags, merge all incompatible_with arrays
        else if (flagType === 'incompatible' && flagsByType[flagType].length > 0) {
          const mergedIncompatibleWith: string[] = [];
          
          flagsByType[flagType].forEach(flag => {
            if (flag.incompatible_with) {
              flag.incompatible_with.forEach(dogId => {
                if (!mergedIncompatibleWith.includes(dogId)) {
                  mergedIncompatibleWith.push(dogId);
                }
              });
            }
          });
          
          if (mergedIncompatibleWith.length > 0) {
            normalizedFlags.push({
              type: 'incompatible',
              incompatible_with: mergedIncompatibleWith
            });
          }
        }
        // For all other flag types, keep all flags
        else {
          normalizedFlags.push(...flagsByType[flagType].map(flag => ({...flag})));
        }
      });
      
      // Return dog with normalized flags, maintaining the dog-to-flag association
      return {
        ...dog,
        flags: normalizedFlags
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
      
      // Deep clone before returning to prevent reference issues
      const cachedDogs = deepCloneDogStatus(careStatusCache.current[dateString].data);
      
      // Normalize flags before returning
      return normalizeFlags(cachedDogs);
    }
    
    console.log(`📋 No valid cache found for ${dateString}`);
    return null;
  };
  
  const setCachedStatus = (dateString: string, data: DogCareStatus[]) => {
    if (!data || data.length === 0) {
      console.log(`⚠️ Not caching empty data for ${dateString}`);
      return;
    }
    
    // Make a complete deep copy of the data to avoid reference issues
    const dogsDeepCopy = deepCloneDogStatus(data);
    
    // Normalize flags before caching
    const normalizedData = normalizeFlags(dogsDeepCopy);
    
    console.log(`📋 Caching ${normalizedData.length} dogs for ${dateString}`);
    careStatusCache.current[dateString] = {
      timestamp: Date.now(),
      data: normalizedData
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
