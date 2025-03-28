
import { useState, useMemo, useCallback } from 'react';
import { DogCareStatus } from '@/types/dailyCare';

type SortConfig = {
  key: keyof DogCareStatus | 'dog_name';
  direction: 'asc' | 'desc';
};

export const useDogSorting = (dogs: DogCareStatus[]) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'dog_name',
    direction: 'asc'
  });

  // Request a sort by a specific key
  const requestSort = useCallback((key: keyof DogCareStatus | 'dog_name') => {
    setSortConfig(prevSortConfig => {
      if (prevSortConfig.key === key) {
        return {
          ...prevSortConfig,
          direction: prevSortConfig.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return { key, direction: 'asc' };
    });
  }, []);

  // Sort the dogs based on the current sort configuration
  const sortedDogs = useMemo(() => {
    if (!dogs || dogs.length === 0) return [];
    
    const sortableItems = [...dogs];
    
    sortableItems.sort((a, b) => {
      // Special handling for 'dog_name' which is a property in our objects
      if (sortConfig.key === 'dog_name') {
        if (a.dog_name < b.dog_name) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a.dog_name > b.dog_name) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      }
      
      // For other sortable fields
      const valueA = a[sortConfig.key];
      const valueB = b[sortConfig.key];
      
      if (valueA === undefined || valueA === null) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valueB === undefined || valueB === null) return sortConfig.direction === 'asc' ? 1 : -1;
      
      if (valueA < valueB) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    return sortableItems;
  }, [dogs, sortConfig]);

  // Return sortedDogs, the current sortConfig and the requestSort function
  return { sortedDogs, sortConfig, requestSort };
};
