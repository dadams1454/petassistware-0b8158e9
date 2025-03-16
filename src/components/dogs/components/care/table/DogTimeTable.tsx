
import React, { useState } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Dog } from 'lucide-react';
import TableDebugger from './TableDebugger';
import { format } from 'date-fns';
import { TabsList } from '@/components/ui/tabs';
import { timeSlots } from './dogGroupColors';
import CareCategories, { careCategories } from './CareCategories';
import SpecialConditionsAlert from './components/SpecialConditionsAlert';
import TableContainer from './components/TableContainer';
import { usePottyBreaks } from './components/usePottyBreaks';
import { useCareTracking } from './components/useCareTracking';

interface DogTimeTableProps {
  dogsStatus: DogCareStatus[];
  onRefresh?: () => void;
}

const DogTimeTable: React.FC<DogTimeTableProps> = ({ dogsStatus, onRefresh }) => {
  const [currentDate] = useState(new Date());
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Use the potty breaks hook for managing potty break state
  const { hasPottyBreak } = usePottyBreaks(onRefresh);
  
  // Use the care tracking hook for general care logging
  const { hasCareLogged, handleCellClick } = useCareTracking(onRefresh);
  
  // Filter out duplicate dog names to avoid confusion in the table
  const uniqueDogs = dogsStatus.reduce((acc: DogCareStatus[], current) => {
    const isDuplicate = acc.find((dog) => dog.dog_name.toLowerCase() === current.dog_name.toLowerCase());
    if (!isDuplicate) {
      acc.push(current);
    }
    return acc;
  }, []);
  
  // Sort dogs alphabetically by name
  const sortedDogs = [...uniqueDogs].sort((a, b) => 
    a.dog_name.toLowerCase().localeCompare(b.dog_name.toLowerCase())
  );

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center">
            <Dog className="h-5 w-5 mr-2" />
            Dog Care Schedule
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({sortedDogs.length} dogs)
            </span>
          </CardTitle>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">
              Date: {format(currentDate, 'MM/dd/yyyy')}
            </span>
          </div>
        </div>
      </CardHeader>
      
      {/* Special conditions alert */}
      <SpecialConditionsAlert dogs={sortedDogs} />
      
      <CardContent className="p-0">
        <div className="w-full">
          <TabsList className="w-full justify-start px-4 pt-2 bg-muted/50 rounded-none border-b">
            <CareCategories 
              activeCategory={activeCategory} 
              onCategoryChange={handleCategoryChange}
            />
          </TabsList>
          
          {/* Table container with tabs content */}
          <TableContainer 
            dogs={sortedDogs}
            activeCategory={activeCategory}
            timeSlots={timeSlots}
            hasPottyBreak={hasPottyBreak}
            hasCareLogged={hasCareLogged}
            onCellClick={handleCellClick}
            onRefresh={onRefresh}
            careCategories={careCategories}
          />
        </div>
      </CardContent>
      
      {/* Hidden debugging component */}
      <TableDebugger dogsStatus={dogsStatus} selectedCategory={activeCategory} />
    </Card>
  );
};

export default DogTimeTable;
