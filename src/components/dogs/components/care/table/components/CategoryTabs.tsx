
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Coffee, Droplet, Scissors, Dumbbell, Heart, Clipboard, LifeBuoy, Pill
} from 'lucide-react';

export interface CategoryTabsProps {
  categories: { id: string; label: string }[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
}) => {
  const isMobile = useIsMobile();

  // Define category icons
  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'pottybreaks':
        return <Droplet className="h-4 w-4" />;
      case 'feeding':
        return <Coffee className="h-4 w-4" />;
      case 'grooming':
        return <Scissors className="h-4 w-4" />;
      case 'training':
        return <Dumbbell className="h-4 w-4" />;
      case 'health':
        return <Heart className="h-4 w-4" />;
      case 'wellness':
        return <LifeBuoy className="h-4 w-4" />;
      case 'medication':
      case 'medications':
        return <Pill className="h-4 w-4" />;
      default:
        return <Clipboard className="h-4 w-4" />;
    }
  };

  return (
    <Tabs
      value={activeCategory}
      onValueChange={onCategoryChange}
      className="w-full mb-4"
    >
      <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full h-auto">
        {categories
          .filter(category => category.id !== 'medications') // Remove medications from time table
          .map((category) => (
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
