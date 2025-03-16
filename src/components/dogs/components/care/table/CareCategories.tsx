
import React from 'react';
import { TabsTrigger } from '@/components/ui/tabs';

// Define care categories
export const careCategories = [
  { id: 'all', name: 'All' },
  { id: 'feeding', name: 'Feeding' },
  { id: 'pottybreaks', name: 'Potty Breaks' },
  { id: 'medications', name: 'Medications' },
  { id: 'exercise', name: 'Exercise' },
  { id: 'grooming', name: 'Grooming' }
];

interface CareCategoriesProps {
  activeCategory: string;
  onCategoryChange?: (category: string) => void;
}

const CareCategories: React.FC<CareCategoriesProps> = ({ 
  activeCategory,
  onCategoryChange 
}) => {
  const handleCategoryClick = (category: string) => {
    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };

  return (
    <>
      {careCategories.map(category => (
        <TabsTrigger 
          key={category.id} 
          value={category.id}
          onClick={() => handleCategoryClick(category.id)}
          className={activeCategory === category.id ? 'bg-primary/10' : ''}
        >
          {category.name}
        </TabsTrigger>
      ))}
    </>
  );
};

export default CareCategories;
