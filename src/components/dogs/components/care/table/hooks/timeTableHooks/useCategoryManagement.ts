
import { useState, useCallback, useEffect } from 'react';
import { careCategories } from '../../../../CareCategories';

/**
 * Hook to manage category changes in the time table
 */
export const useCategoryManagement = (
  setDebugInfo: (info: string) => void,
  clickCountRef: React.MutableRefObject<number>
) => {
  // Initialize with first category from the careCategories array
  const [activeCategory, setActiveCategory] = useState<string>(careCategories[0].id);

  // Safe tab change handler with logging
  const handleCategoryChange = useCallback((value: string) => {
    console.log(`Tab changed to ${value}`);
    // Reset click counter when changing tabs to avoid triggering the 6-click issue
    clickCountRef.current = 0;
    setDebugInfo(`Tab changed to ${value}, clicks reset`);
    setActiveCategory(value);
  }, [clickCountRef, setDebugInfo]);

  // Get all category IDs as a derived value
  const allCategoryIds = careCategories.map(category => category.id);

  return {
    activeCategory,
    handleCategoryChange,
    allCategoryIds
  };
};
