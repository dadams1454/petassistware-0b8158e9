
import React, { useState, useEffect } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Dog } from 'lucide-react';
import TableDebugger from './TableDebugger';
import { format } from 'date-fns';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { timeSlots } from './dogGroupColors';
import { careCategories } from './CareCategories';
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
  const [activeCategory, setActiveCategory] = useState('pottybreaks'); // Default to pottybreaks for testing
  
  // Use the potty breaks hook for managing potty break state
  const { hasPottyBreak, handleCellClick: handlePottyBreakClick } = usePottyBreaks(onRefresh);
  
  // Use the care tracking hook for general care logging
  const { hasCareLogged, handleCellClick: handleCareLogClick } = useCareTracking(onRefresh);
  
  // Combined cell click handler
  const handleCellClick = (dogId: string, dogName: string, timeSlot: string, category: string) => {
    console.log(`Handling click for ${dogName} at ${timeSlot} for ${category}`);
    
    if (category === 'pottybreaks') {
      console.log('Delegating to potty break handler');
      handlePottyBreakClick(dogId, dogName, timeSlot, category);
    } else {
      console.log('Delegating to care log handler');
      handleCareLogClick(dogId, dogName, timeSlot, category);
    }
  };
  
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
    console.log(`📊 Changing category from ${activeCategory} to ${category}`);
    setActiveCategory(category);
  };

  useEffect(() => {
    console.log(`DogTimeTable rendered with ${sortedDogs.length} dogs and activeCategory: ${activeCategory}`);
  }, [activeCategory, sortedDogs.length]);

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
            {careCategories.map(category => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={activeCategory === category.id ? 'bg-primary/10' : ''}
              >
                {category.icon}
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="p-4">
            <pre className="text-xs text-muted-foreground mb-2">
              Debug: Active Category: {activeCategory}, Dogs: {sortedDogs.length}
            </pre>
            
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
        </div>
      </CardContent>
      
      {/* Hidden debugging component */}
      <TableDebugger dogsStatus={dogsStatus} selectedCategory={activeCategory} />
    </Card>
  );
};

export default DogTimeTable;
