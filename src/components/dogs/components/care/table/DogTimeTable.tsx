
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DogCareStatus } from '@/types/dailyCare';
import TimeTableHeader from './components/TimeTableHeader';
import TimeTableContent from './components/TimeTableContent';
import TimeTableFooter from './components/TimeTableFooter';
import usePottyBreakTable from './hooks/usePottyBreakTable';
import SpecialConditionsAlert from './components/SpecialConditionsAlert';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import CareLogForm from '../CareLogForm';

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
  const [activeCategory, setActiveCategory] = useState('pottybreaks');
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);
  const [selectedDogName, setSelectedDogName] = useState<string>('');
  const [careDialogOpen, setCareDialogOpen] = useState(false);
  
  const {
    currentDate,
    isLoading,
    pottyBreaks,
    sortedDogs,
    hasPottyBreak,
    hasCareLogged,
    handleCellClick,
    handleRefresh
  } = usePottyBreakTable(dogsStatus, onRefresh, activeCategory);

  const handleCareLogClick = (dogId: string, dogName: string) => {
    setSelectedDogId(dogId);
    setSelectedDogName(dogName);
    setCareDialogOpen(true);
  };
  
  const handleCareLogSuccess = () => {
    setCareDialogOpen(false);
    if (onRefresh) {
      onRefresh();
    }
    handleRefresh();
  };

  return (
    <Card className="shadow-md overflow-hidden">
      <TimeTableHeader
        dogCount={sortedDogs.length}
        currentDate={currentDate}
        isLoading={isLoading}
        onRefresh={handleRefresh}
      />
      
      <CardContent className="p-0">
        {/* For now, we're only using pottybreaks, so removed tabs */}
        <div className="px-4 py-2 border-b">
          <h3 className="text-lg font-medium">Potty Breaks</h3>
          <p className="text-sm text-muted-foreground">Click on a cell to log or remove a potty break</p>
        </div>
        
        {/* Special conditions alert */}
        <SpecialConditionsAlert dogs={sortedDogs} />
        
        {/* Table content - main grid view */}
        <TimeTableContent
          sortedDogs={sortedDogs}
          timeSlots={timeSlots}
          hasPottyBreak={hasPottyBreak}
          hasCareLogged={hasCareLogged}
          onCellClick={handleCellClick}
          onCareLogClick={handleCareLogClick}
          activeCategory={activeCategory}
        />
        
        <TimeTableFooter />
        
        {/* Care log dialog */}
        <Dialog open={careDialogOpen} onOpenChange={setCareDialogOpen}>
          <DialogContent>
            {selectedDogId && (
              <CareLogForm 
                dogId={selectedDogId} 
                onSuccess={handleCareLogSuccess}
                initialCategory={activeCategory}
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default DogTimeTable;
