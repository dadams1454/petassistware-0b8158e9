
import React, { useState, useEffect } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Dog } from 'lucide-react';
import { format } from 'date-fns';
import { timeSlots } from './dogGroupColors';
import TableContainer from './components/TableContainer';
import { usePottyBreaks } from './components/usePottyBreaks';
import { useCareTracking } from './components/useCareTracking';
import SpecialConditionsAlert from './components/SpecialConditionsAlert';

interface DogTimeTableProps {
  dogsStatus: DogCareStatus[];
  onRefresh?: () => void;
}

const DogTimeTable: React.FC<DogTimeTableProps> = ({ dogsStatus, onRefresh }) => {
  const [currentDate] = useState(new Date());
  // We'll just have a single potty break view now - no categories
  const activeCategory = 'pottybreaks';
  
  // Use the potty breaks hook for managing potty break state
  const { hasPottyBreak, handleCellClick: handlePottyBreakClick } = usePottyBreaks(onRefresh);
  
  // Use the care tracking hook for general care logging
  const { hasCareLogged } = useCareTracking(onRefresh);
  
  const handleCellClick = (dogId: string, dogName: string, timeSlot: string) => {
    console.log(`Handling potty break for ${dogName} at ${timeSlot}`);
    handlePottyBreakClick(dogId, dogName, timeSlot, activeCategory);
  };
  
  // Filter out duplicate dog names
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

  useEffect(() => {
    console.log(`DogTimeTable rendered with ${sortedDogs.length} dogs`);
  }, [sortedDogs.length]);

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center">
            <Dog className="h-5 w-5 mr-2" />
            Dog Potty Break Log
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
        <div className="p-4">
          <p className="text-sm mb-4">
            Click on a cell to mark a potty break with an X. The X will remain visible throughout the day.
          </p>
          
          {/* Table container with content */}
          <TableContainer 
            dogs={sortedDogs}
            activeCategory={activeCategory}
            timeSlots={timeSlots}
            hasPottyBreak={hasPottyBreak}
            hasCareLogged={hasCareLogged}
            onCellClick={handleCellClick}
            onRefresh={onRefresh}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DogTimeTable;
