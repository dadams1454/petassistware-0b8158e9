
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Utensils, 
  Pill, 
  RotateCw, 
  Scissors, 
  Heart, 
  Droplets, 
  Building, 
  BookOpen
} from 'lucide-react';

interface TabDescriptor {
  id: string;
  name: string;
  icon: React.ReactNode;
  description?: string; 
}

interface TopCategoryTabsProps {
  categories: TabDescriptor[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const TopCategoryTabs: React.FC<TopCategoryTabsProps> = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}) => {
  // If no categories provided, use the defaults
  const displayCategories = categories.length > 0 ? categories : getDefaultCategories();
  
  return (
    <Tabs value={selectedCategory} onValueChange={onCategoryChange}>
      <TabsList className="w-full justify-start overflow-auto p-1 bg-background border rounded-md flex-nowrap">
        {displayCategories.map((category) => (
          <TabsTrigger 
            key={category.id} 
            value={category.id}
            className="flex items-center gap-1.5 whitespace-nowrap h-9 px-3"
          >
            {category.icon}
            <span>{category.name}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export const getDefaultCategories = (): TabDescriptor[] => [
  { id: 'feeding', name: 'Feeding', icon: <Utensils className="h-4 w-4" /> },
  { id: 'medications', name: 'Medications', icon: <Pill className="h-4 w-4" /> },
  { id: 'exercise', name: 'Exercise', icon: <RotateCw className="h-4 w-4" /> },
  { id: 'grooming', name: 'Grooming', icon: <Scissors className="h-4 w-4" /> },
  { id: 'wellness', name: 'Wellness', icon: <Heart className="h-4 w-4" /> },
  { id: 'hydration', name: 'Hydration', icon: <Droplets className="h-4 w-4" /> },
  { id: 'facility', name: 'Facility', icon: <Building className="h-4 w-4" /> },
  { id: 'notes', name: 'Notes', icon: <BookOpen className="h-4 w-4" /> },
];

export default TopCategoryTabs;
