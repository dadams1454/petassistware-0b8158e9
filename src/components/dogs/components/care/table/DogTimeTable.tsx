
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DogCareStatus } from '@/types/dailyCare';
import TimeTableHeader from './components/TimeTableHeader';
import TimeTableContent from './components/TimeTableContent';
import TimeTableFooter from './components/TimeTableFooter';
import usePottyBreakTable from './hooks/usePottyBreakTable';

// Define time slots for the Excel-like grid
export const timeSlots = [
  '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'
];

interface DogTimeTableProps {
  dogsStatus: DogCareStatus[];
  onRefresh?: () => void;
}

const DogTimeTable: React.FC<DogTimeTableProps> = ({ dogsStatus, onRefresh }) => {
  const {
    currentDate,
    isLoading,
    pottyBreaks,
    sortedDogs,
    hasPottyBreak,
    handleCellClick,
    handleRefresh
  } = usePottyBreakTable(dogsStatus, onRefresh);

  return (
    <Card className="shadow-md overflow-hidden">
      <TimeTableHeader
        dogCount={sortedDogs.length}
        currentDate={currentDate}
        isLoading={isLoading}
        onRefresh={handleRefresh}
      />
      
      <CardContent className="p-0">
        <TimeTableContent
          sortedDogs={sortedDogs}
          timeSlots={timeSlots}
          hasPottyBreak={hasPottyBreak}
          onCellClick={handleCellClick}
        />
        
        <TimeTableFooter />
      </CardContent>
    </Card>
  );
};

export default DogTimeTable;
