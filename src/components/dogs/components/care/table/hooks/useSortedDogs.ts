
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
      // Check if dogs have a group property via flags
      const aGroup = a.flags?.find(f => f.type === 'group')?.value;
      const bGroup = b.flags?.find(f => f.type === 'group')?.value;
      
      // First sort by dog group if available
      if (aGroup && bGroup && aGroup !== bGroup) {
        return aGroup.localeCompare(bGroup);
      }
      
      // Then sort by dog name
      return a.dog_name.localeCompare(b.dog_name);
    });
  }, [dogs]);
  
  return { sortedDogs };
};
