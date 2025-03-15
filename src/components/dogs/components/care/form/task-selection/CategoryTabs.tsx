
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Folder, Tag, Flag, List } from 'lucide-react';

interface CategoryTabsProps {
  categories: string[];
  selectedCategory: string;
  handleCategoryChange: (category: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ 
  categories, 
  selectedCategory, 
  handleCategoryChange 
}) => {
  // Get icon for category
  const getCategoryIcon = (category: string) => {
    const categoryLower = category.toLowerCase();
    
    if (categoryLower.includes('feeding') || categoryLower.includes('food')) {
      return <List className="h-4 w-4 mr-2" />;
    } else if (categoryLower.includes('health') || categoryLower.includes('medical')) {
      return <Flag className="h-4 w-4 mr-2" />;
    } else if (categoryLower.includes('grooming') || categoryLower.includes('care')) {
      return <Tag className="h-4 w-4 mr-2" />;
    } else {
      return <Folder className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <Tabs value={selectedCategory} onValueChange={handleCategoryChange} className="w-full">
      <TabsList className="w-full justify-start overflow-auto">
        {categories.map(category => (
          <TabsTrigger key={category} value={category} className="flex items-center">
            {getCategoryIcon(category)}
            <span>{category}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default CategoryTabs;
