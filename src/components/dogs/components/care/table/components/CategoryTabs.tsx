
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { careCategories } from '@/components/dogs/components/care/CareCategories';

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ 
  activeCategory, 
  onCategoryChange 
}) => {
  return (
    <Tabs value={activeCategory} onValueChange={onCategoryChange} className="w-full">
      <TabsList className="w-full justify-start overflow-auto p-1 bg-background border-b">
        {careCategories.map(category => (
          <TabsTrigger 
            key={category.id} 
            value={category.id} 
            className="flex items-center data-[state=active]:bg-muted gap-2"
          >
            {category.icon}
            <span>{category.name}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default CategoryTabs;
