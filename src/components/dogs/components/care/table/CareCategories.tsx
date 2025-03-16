
import React from 'react';
import { TabsTrigger } from '@/components/ui/tabs';
import { Bowl, AlarmClock, Pill, Activity, Scissors, Layers } from 'lucide-react';
import { CareCategory } from './components/types';

// Define care categories with icons
export const careCategories: CareCategory[] = [
  { id: 'all', name: 'All', icon: <Layers className="h-4 w-4 mr-2" /> },
  { id: 'feeding', name: 'Feeding', icon: <Bowl className="h-4 w-4 mr-2" /> },
  { id: 'pottybreaks', name: 'Potty Breaks', icon: <AlarmClock className="h-4 w-4 mr-2" /> },
  { id: 'medications', name: 'Medications', icon: <Pill className="h-4 w-4 mr-2" /> },
  { id: 'exercise', name: 'Exercise', icon: <Activity className="h-4 w-4 mr-2" /> },
  { id: 'grooming', name: 'Grooming', icon: <Scissors className="h-4 w-4 mr-2" /> }
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
          {category.icon}
          {category.name}
        </TabsTrigger>
      ))}
    </>
  );
};

export default CareCategories;
