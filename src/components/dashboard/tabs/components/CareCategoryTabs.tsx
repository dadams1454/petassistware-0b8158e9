
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { careCategories } from '@/components/dogs/components/care/CareCategories';

interface CareCategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (value: string) => void;
}

const CareCategoryTabs: React.FC<CareCategoryTabsProps> = ({ 
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

export default CareCategoryTabs;
