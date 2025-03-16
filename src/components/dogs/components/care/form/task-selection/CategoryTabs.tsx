
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Folder, Tag, Flag, List, Heart, UtensilsCrossed, Bath, Pill } from 'lucide-react';

interface CategoryTabsProps {
  categories: string[];
  selectedCategory: string;
  handleCategoryChange: (category: string) => void;
  compact?: boolean; // New prop for compact mode
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ 
  categories, 
  selectedCategory, 
  handleCategoryChange,
  compact = false
}) => {
  // Get icon for category
  const getCategoryIcon = (category: string) => {
    const categoryLower = category.toLowerCase();
    
    if (categoryLower.includes('feeding') || categoryLower.includes('food')) {
      return <UtensilsCrossed className={`${compact ? 'h-3 w-3' : 'h-4 w-4'} mr-2`} />;
    } else if (categoryLower.includes('health') || categoryLower.includes('medical')) {
      return <Flag className={`${compact ? 'h-3 w-3' : 'h-4 w-4'} mr-2`} />;
    } else if (categoryLower.includes('grooming') || categoryLower.includes('bath')) {
      return <Bath className={`${compact ? 'h-3 w-3' : 'h-4 w-4'} mr-2`} />;
    } else if (categoryLower.includes('medication') || categoryLower.includes('medicine')) {
      return <Pill className={`${compact ? 'h-3 w-3' : 'h-4 w-4'} mr-2`} />;
    } else if (categoryLower.includes('care') || categoryLower.includes('daily')) {
      return <Tag className={`${compact ? 'h-3 w-3' : 'h-4 w-4'} mr-2`} />;
    } else if (categoryLower.includes('play') || categoryLower.includes('exercise')) {
      return <Heart className={`${compact ? 'h-3 w-3' : 'h-4 w-4'} mr-2`} />;
    } else {
      return <Folder className={`${compact ? 'h-3 w-3' : 'h-4 w-4'} mr-2`} />;
    }
  };

  return (
    <Tabs value={selectedCategory} onValueChange={handleCategoryChange} className="w-full">
      <TabsList className={`w-full justify-start overflow-auto ${compact ? 'h-8 p-1' : ''}`}>
        {categories.map(category => (
          <TabsTrigger 
            key={category} 
            value={category} 
            className={`flex items-center ${compact ? 'text-xs py-0.5 px-2' : ''}`}
          >
            {getCategoryIcon(category)}
            <span>{category}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default CategoryTabs;
