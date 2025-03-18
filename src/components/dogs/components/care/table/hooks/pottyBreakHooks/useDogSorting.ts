
import { useMemo } from 'react';
import { DogCareStatus } from '@/types/dailyCare';

export const useDogSorting = (dogsStatus: DogCareStatus[]) => {
  // Sort dogs alphabetically by name
  const sortedDogs = useMemo(() => {
    return [...dogsStatus].sort((a, b) => 
      a.dog_name.toLowerCase().localeCompare(b.dog_name.toLowerCase())
    );
  }, [dogsStatus]);
  
  return { sortedDogs };
};
