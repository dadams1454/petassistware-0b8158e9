
import React from 'react';
import { careCategories } from '../../CareCategories';
import CategoryTabs from './CategoryTabs';

interface TimeTableHeaderProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const TimeTableHeader: React.FC<TimeTableHeaderProps> = ({ 
  activeCategory, 
  onCategoryChange 
}) => {
  // Get the current category name for display in the header
  const categoryName = careCategories.find(c => c.id === activeCategory)?.name || 'Care';
  
  return (
    <div className="bg-card border-b">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">{categoryName} Time Table</h3>
        <p className="text-sm text-muted-foreground">
          Track {categoryName.toLowerCase()} activities for all dogs
        </p>
      </div>
      <CategoryTabs 
        activeCategory={activeCategory} 
        onCategoryChange={onCategoryChange} 
      />
    </div>
  );
};

export default TimeTableHeader;
