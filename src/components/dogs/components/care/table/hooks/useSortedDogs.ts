
import { useMemo } from 'react';
import { DogCareStatus } from '@/types/dailyCare';

/**
 * Hook to sort dogs based on their properties
 */
export const useSortedDogs = (dogs: DogCareStatus[]) => {
  // Sort dogs by name
  const sortedDogs = useMemo(() => {
    if (!dogs || dogs.length === 0) return [];
    
    return [...dogs].sort((a, b) => {
      // First sort by dog group if available
      if (a.group_name && b.group_name && a.group_name !== b.group_name) {
        return a.group_name.localeCompare(b.group_name);
      }
      
      // Then sort by dog name
      return a.dog_name.localeCompare(b.dog_name);
    });
  }, [dogs]);
  
  return { sortedDogs };
};
