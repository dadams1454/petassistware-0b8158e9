
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { careCategories } from './table/CareCategories';

interface TopCategoryTabsProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  showAllCategories?: boolean;
}

const TopCategoryTabs: React.FC<TopCategoryTabsProps> = ({ 
  selectedCategory, 
  onCategoryChange,
  showAllCategories = false
}) => {
  // Filter categories if needed (useful for smaller views)
  const displayCategories = showAllCategories 
    ? careCategories 
    : careCategories.slice(0, 5); // Show only first 5 categories in compact mode
  
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
