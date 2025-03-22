
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CareCategories from '../CareCategories';

interface CategoryTabsProps {
  activeCategory: string;
  onValueChange: (value: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ 
  activeCategory, 
  onValueChange 
}) => {
  return (
    <Tabs 
      value={activeCategory} 
      onValueChange={onValueChange}
      className="w-full"
    >
      <TabsList onClick={(e) => e.stopPropagation()}>
        {CareCategories.map(category => (
          <TabsTrigger 
            key={category.id} 
            value={category.id} 
            className="flex items-center"
            onClick={(e) => {
              // Prevent default to avoid any navigation
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {category.icon}
            <span className="ml-2">{category.name}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default CategoryTabs;
