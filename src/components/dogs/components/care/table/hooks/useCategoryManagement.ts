
import { useState, useEffect, useCallback } from 'react';
import { DebugInfo } from '../types';

export const useCategoryManagement = (
  setDebugInfo: (info: DebugInfo) => void,
  clickCountRef: React.MutableRefObject<number>,
  initialCategory: string = 'feeding'
) => {
  // State for active category
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  
  // Update debug info when category changes
  useEffect(() => {
    setDebugInfo(prev => ({
      ...prev,
      activeCategory
    }));
  }, [activeCategory, setDebugInfo]);
  
  // Handle category change
  const handleCategoryChange = useCallback((category: string) => {
    console.log('Category changed to:', category);
    // Reset click count when category changes
    clickCountRef.current = 0;
    setActiveCategory(category);
  }, [clickCountRef]);
  
  return {
    activeCategory,
    handleCategoryChange
  };
};

export default useCategoryManagement;
