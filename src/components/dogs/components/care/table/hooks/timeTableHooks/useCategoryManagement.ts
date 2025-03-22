
import { useState, useCallback } from 'react';

/**
 * Hook to manage category changes in the time table
 */
export const useCategoryManagement = (
  setDebugInfo: (info: string) => void,
  clickCountRef: React.MutableRefObject<number>
) => {
  const [activeCategory, setActiveCategory] = useState<string>('pottybreaks');

  // Safe tab change handler with logging
  const handleCategoryChange = useCallback((value: string) => {
    console.log(`Tab changed to ${value}`);
    // Reset click counter when changing tabs to avoid triggering the 6-click issue
    clickCountRef.current = 0;
    setDebugInfo(`Tab changed to ${value}, clicks reset`);
    setActiveCategory(value);
  }, [clickCountRef, setDebugInfo]);

  return {
    activeCategory,
    handleCategoryChange
  };
};
