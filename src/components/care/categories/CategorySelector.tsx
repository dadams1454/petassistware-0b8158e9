
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCareCategories } from '@/contexts/CareCategories/CareCategoriesContext';
import { CareCategory } from '@/types/careCategories';

interface CategorySelectorProps {
  activeCategory: CareCategory;
  onCategoryChange: (category: CareCategory) => void;
  includePuppy?: boolean;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ 
  activeCategory, 
  onCategoryChange,
  includePuppy = true
}) => {
  const { categories } = useCareCategories();
  
  // Filter categories if puppy is not included
  const displayCategories = includePuppy 
    ? categories 
    : categories.filter(cat => cat.id !== 'puppy');

  return (
    <Tabs value={activeCategory} onValueChange={(value) => onCategoryChange(value as CareCategory)}>
      <TabsList className="grid grid-cols-2 sm:grid-cols-5 mb-4">
        {displayCategories.map((category) => (
          <TabsTrigger 
            key={category.id} 
            value={category.id}
            className="flex items-center gap-2"
          >
            {category.icon}
            <span className="hidden sm:inline">{category.name}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default CategorySelector;
