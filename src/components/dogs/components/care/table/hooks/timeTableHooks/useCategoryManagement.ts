
import { useState, useCallback, MutableRefObject } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useCategoryManagement = (
  setDebugInfo: (info: any) => void,
  clickCountRef: MutableRefObject<number>,
  initialCategory: string = 'feeding'  // Default is feeding but never was pottybreaks
) => {
  // Use search params to keep track of the active category in the URL
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get the category from the URL or use the default
  const initialCategoryFromUrl = searchParams.get('category') || initialCategory;
  
  // State for active category
  const [activeCategory, setActiveCategory] = useState<string>(initialCategoryFromUrl);
  
  // Handler for category change
  const handleCategoryChange = useCallback((category: string) => {
    setActiveCategory(category);
    
    // Update search params
    searchParams.set('category', category);
    setSearchParams(searchParams);
    
    // Update debug info
    setDebugInfo(prev => ({
      ...prev,
      lastCategoryChange: new Date().toISOString(),
      previousCategory: activeCategory,
      newCategory: category
    }));
    
    // Increment click count
    clickCountRef.current += 1;
  }, [activeCategory, setDebugInfo, searchParams, setSearchParams, clickCountRef]);
  
  return { activeCategory, handleCategoryChange };
};

export default useCategoryManagement;
