
import { useState, useEffect, useCallback } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { Category } from '../types/category';

interface UseCategoryDataResult {
  categoryData: DogCareStatus[];
  isLoading: boolean;
  refreshData: () => void;
}

export const useCategoryData = (
  dogs: DogCareStatus[],
  activeCategory: Category,
  currentDate: Date
): UseCategoryDataResult => {
  const [categoryData, setCategoryData] = useState<DogCareStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Process dogs data based on active category
  const processDogsData = useCallback(() => {
    setIsLoading(true);
    
    try {
      // Just return the dogs for now - we can add more filtering logic later if needed
      setCategoryData(dogs);
    } catch (error) {
      console.error('Error processing category data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [dogs]);

  // Update category data when dogs, activeCategory, or currentDate changes
  useEffect(() => {
    processDogsData();
  }, [dogs, activeCategory, currentDate, processDogsData]);

  return {
    categoryData,
    isLoading,
    refreshData: processDogsData
  };
};
