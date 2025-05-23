
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Coffee, Dog, Scissors, Dumbbell, Heart, Clipboard, LifeBuoy, Pill, 
  Baby, Building2, GraduationCap, StickyNote
} from 'lucide-react';

export interface CategoryTabsProps {
  categories: { id: string; label: string }[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories = [], // Provide default empty array
  activeCategory,
  onCategoryChange,
}) => {
  const isMobile = useIsMobile();

  // Define category icons
  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'dogletout':
        return <Dog className="h-4 w-4" />;
      case 'feeding':
        return <Coffee className="h-4 w-4" />;
      case 'grooming':
        return <Scissors className="h-4 w-4" />;
      case 'training':
        return <GraduationCap className="h-4 w-4" />;
      case 'health':
        return <Heart className="h-4 w-4" />;
      case 'wellness':
        return <LifeBuoy className="h-4 w-4" />;
      case 'medication':
      case 'medications':
        return <Pill className="h-4 w-4" />;
      case 'puppies':
        return <Baby className="h-4 w-4" />;
      case 'facility':
        return <Building2 className="h-4 w-4" />;
      case 'notes':
        return <StickyNote className="h-4 w-4" />;
      default:
        return <Clipboard className="h-4 w-4" />;
    }
  };

  // Ensure categories is an array
  const safeCategories = Array.isArray(categories) ? categories : [];
  
  return (
    <Tabs
      value={activeCategory}
      onValueChange={onCategoryChange}
      className="w-full mb-4"
    >
      <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full h-auto">
        {safeCategories.map((category) => (
          <TabsTrigger
            key={category.id}
            value={category.id}
            className={`flex items-center justify-center ${
              isMobile ? 'px-2 py-2' : 'px-4 py-2'
            } data-[state=active]:bg-primary/10`}
          >
            {getCategoryIcon(category.id)}
            <span className={isMobile ? 'ml-1 text-xs' : 'ml-2'}>
              {category.label}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default CategoryTabs;
