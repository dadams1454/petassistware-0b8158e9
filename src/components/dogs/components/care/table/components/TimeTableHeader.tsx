
import React from 'react';
import { careCategories } from '@/components/dogs/components/care/CareCategories';
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
  const categoryName = (careCategories || []).find(c => c.id === activeCategory)?.name || 'Care';
  
  // Ensure we have a valid categories array to pass to CategoryTabs
  const categories = Array.isArray(careCategories) 
    ? careCategories.map(c => ({ id: c.id, label: c.name }))
    : [];
  
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
