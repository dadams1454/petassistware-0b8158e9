
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { careCategories } from './CareCategories';

interface TopCategoryTabsProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories?: string[];
  showAllCategories?: boolean;
}

const TopCategoryTabs: React.FC<TopCategoryTabsProps> = ({ 
  selectedCategory, 
  onCategoryChange,
  categories,
  showAllCategories = false
}) => {
  // Filter categories if needed (useful for smaller views)
  let displayCategories = showAllCategories 
    ? careCategories 
    : careCategories.slice(0, 5); // Show only first 5 categories in compact mode
  
  // If specific categories are provided, filter the care categories to only show those
  if (categories && categories.length > 0) {
    displayCategories = careCategories.filter(category => 
      categories.includes(category.id)
    );
  }
  
  return (
    <Tabs value={selectedCategory} onValueChange={onCategoryChange} className="w-full">
      <TabsList className="w-full justify-start overflow-auto p-1 bg-background border-b">
        {displayCategories.map(category => (
          <TabsTrigger 
            key={category.id} 
            value={category.id} 
            className="flex items-center gap-2 data-[state=active]:bg-muted"
          >
            {category.icon}
            <span>{category.name}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default TopCategoryTabs;
