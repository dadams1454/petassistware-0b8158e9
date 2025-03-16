
import React from 'react';
import { Dog } from 'lucide-react';
import { TabsTrigger } from '@/components/ui/tabs';

export const careCategories = [
  { id: 'all', name: 'All Care', icon: <Dog className="h-4 w-4 mr-1" /> },
  { id: 'exercise', name: 'Exercise', icon: <Dog className="h-4 w-4 mr-1" /> },
  { id: 'feeding', name: 'Feeding', icon: <Dog className="h-4 w-4 mr-1" /> },
  { id: 'grooming', name: 'Grooming', icon: <Dog className="h-4 w-4 mr-1" /> },
  { id: 'medication', name: 'Medication', icon: <Dog className="h-4 w-4 mr-1" /> },
  { id: 'pottybreaks', name: 'Potty Breaks', icon: <Dog className="h-4 w-4 mr-1" /> },
];

interface CareCategoriesProps {
  activeCategory: string;
}

const CareCategories: React.FC<CareCategoriesProps> = ({ activeCategory }) => {
  return (
    <>
      {careCategories.map(category => (
        <TabsTrigger 
          key={category.id} 
          value={category.id}
          className="data-[state=active]:bg-background rounded-t-lg rounded-b-none"
        >
          {category.icon}
          {category.name}
        </TabsTrigger>
      ))}
    </>
  );
};

export default CareCategories;
