
import React from 'react';
import { careCategories } from '@/components/dogs/components/care/CareCategories';
import CategoryTabs from './CategoryTabs';

interface TimeTableHeaderProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  hideTopLevelTabs?: boolean; // New prop to control visibility of category tabs
}

const TimeTableHeader: React.FC<TimeTableHeaderProps> = ({ 
  activeCategory, 
  onCategoryChange,
  hideTopLevelTabs = false
}) => {
  // Make sure careCategories is defined and is an array before trying to find elements
  const safeCategories = Array.isArray(careCategories) ? careCategories : [];
  
  // Get the current category name for display in the header
  const categoryName = safeCategories.find(c => c.id === activeCategory)?.name || 'Care';
  
  // Ensure we have a valid categories array to pass to CategoryTabs
  const categories = safeCategories.map(c => ({ id: c.id, label: c.name }));
  
  // If hideTopLevelTabs is true, don't render the CategoryTabs component
  if (hideTopLevelTabs) {
    return null;
  }
  
  return (
    <div className="bg-card border-b">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">{categoryName} Time Table</h3>
        <p className="text-sm text-muted-foreground">
          Track {categoryName.toLowerCase()} activities for all dogs
        </p>
      </div>
      
      <CategoryTabs 
        categories={categories}
        activeCategory={activeCategory} 
        onCategoryChange={onCategoryChange} 
      />
    </div>
  );
};

export default TimeTableHeader;
