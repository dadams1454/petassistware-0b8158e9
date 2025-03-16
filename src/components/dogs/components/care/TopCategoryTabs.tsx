
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  UtensilsCrossed, Flag, Bath, Pill, Tag, Heart, Folder, 
  Dumbbell, Coffee, Sun, Moon, Sparkles, Dog, CheckCircle 
} from 'lucide-react';

interface TopCategoryTabsProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const TopCategoryTabs: React.FC<TopCategoryTabsProps> = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}) => {
  // Get icon for category
  const getCategoryIcon = (category: string) => {
    const categoryLower = category.toLowerCase();
    
    if (categoryLower.includes('feeding') || categoryLower.includes('food')) {
      return <UtensilsCrossed className="h-4 w-4 mr-2" />;
    } else if (categoryLower.includes('health') || categoryLower.includes('medical')) {
      return <Flag className="h-4 w-4 mr-2" />;
    } else if (categoryLower.includes('grooming') || categoryLower.includes('bath')) {
      return <Bath className="h-4 w-4 mr-2" />;
    } else if (categoryLower.includes('medication') || categoryLower.includes('medicine')) {
      return <Pill className="h-4 w-4 mr-2" />;
    } else if (categoryLower.includes('care') || categoryLower.includes('daily')) {
      return <Tag className="h-4 w-4 mr-2" />;
    } else if (categoryLower.includes('play')) {
      return <Heart className="h-4 w-4 mr-2" />;
    } else if (categoryLower.includes('exercise')) {
      return <Dumbbell className="h-4 w-4 mr-2" />;
    } else if (categoryLower.includes('morning')) {
      return <Sun className="h-4 w-4 mr-2" />;
    } else if (categoryLower.includes('evening')) {
      return <Moon className="h-4 w-4 mr-2" />;
    } else if (categoryLower.includes('training')) {
      return <CheckCircle className="h-4 w-4 mr-2" />;
    } else if (categoryLower.includes('special')) {
      return <Sparkles className="h-4 w-4 mr-2" />;
    } else if (categoryLower.includes('walk')) {
      return <Dog className="h-4 w-4 mr-2" />;
    } else {
      return <Folder className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <Tabs value={selectedCategory} onValueChange={onCategoryChange} className="w-full">
      <TabsList className="w-full justify-start overflow-auto p-1 bg-background border-b">
        {categories.map(category => (
          <TabsTrigger 
            key={category} 
            value={category} 
            className="flex items-center data-[state=active]:bg-muted"
          >
            {getCategoryIcon(category)}
            <span>{category}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default TopCategoryTabs;
