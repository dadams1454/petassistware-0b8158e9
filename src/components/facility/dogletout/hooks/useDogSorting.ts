
import { useMemo } from 'react';
import { DogCareStatus } from '@/types/dailyCare';

export const useDogSorting = (dogs: DogCareStatus[]) => {
  // Sorted dogs - alphabetical by default
  const sortedDogs = useMemo(() => {
    if (!dogs || dogs.length === 0) return [];
    
    return [...dogs].sort((a, b) => {
      // Primary sort by name
      return a.dog_name.localeCompare(b.dog_name);
    });
  }, [dogs]);
  
  return { sortedDogs };
};
