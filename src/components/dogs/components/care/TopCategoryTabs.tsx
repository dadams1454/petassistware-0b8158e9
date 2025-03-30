
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TopCategoryTabsProps {
  categories: { id: string; label: string }[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const TopCategoryTabs: React.FC<TopCategoryTabsProps> = ({
  categories,
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <Tabs 
      value={selectedCategory} 
      onValueChange={onCategoryChange}
      className="w-full"
    >
      <TabsList className="w-full justify-start overflow-auto">
        {categories.map(category => (
          <TabsTrigger key={category.id} value={category.id}>
            {category.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default TopCategoryTabs;
