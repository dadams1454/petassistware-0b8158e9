
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dog, Utensils, Pill, Scissors, FileText, Building2, PawPrint } from 'lucide-react';

interface CareCategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CareCategoryTabs: React.FC<CareCategoryTabsProps> = ({ 
  activeCategory, 
  onCategoryChange 
}) => {
  return (
    <Tabs value={activeCategory} onValueChange={onCategoryChange} className="w-full">
      <TabsList className="grid grid-cols-3 md:grid-cols-7 w-full">
        <TabsTrigger value="feeding" className="flex items-center">
          <Utensils className="h-4 w-4 mr-2" />
          <span className="hidden md:inline">Feeding</span>
          <span className="md:hidden">Feed</span>
        </TabsTrigger>
        <TabsTrigger value="dogletout" className="flex items-center">
          <PawPrint className="h-4 w-4 mr-2" />
          <span className="hidden md:inline">Dog Let Out</span>
          <span className="md:hidden">Let Out</span>
        </TabsTrigger>
        <TabsTrigger value="medication" className="flex items-center">
          <Pill className="h-4 w-4 mr-2" />
          <span className="hidden md:inline">Medication</span>
          <span className="md:hidden">Meds</span>
        </TabsTrigger>
        <TabsTrigger value="grooming" className="flex items-center">
          <Scissors className="h-4 w-4 mr-2" />
          <span className="hidden md:inline">Grooming</span>
          <span className="md:hidden">Groom</span>
        </TabsTrigger>
        <TabsTrigger value="notes" className="flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          <span>Notes</span>
        </TabsTrigger>
        <TabsTrigger value="facility" className="flex items-center">
          <Building2 className="h-4 w-4 mr-2" />
          <span>Facility</span>
        </TabsTrigger>
        <TabsTrigger value="puppies" className="flex items-center">
          <Dog className="h-4 w-4 mr-2" />
          <span>Puppies</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default CareCategoryTabs;
