
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
  // Re-order categories to prioritize dogletout and feeding
  const orderedCategories = [...careCategories].sort((a, b) => {
    if (a.id === 'feeding') return -1;
    if (b.id === 'feeding') return 1;
    if (a.id === 'dogletout') return -1;
    if (b.id === 'dogletout') return 1;
    return 0;
  });

  return (
    <Tabs value={activeCategory} onValueChange={onCategoryChange} className="w-full">
      <TabsList className="w-full justify-start overflow-auto p-1 bg-background border-b">
        {orderedCategories.map(category => (
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
