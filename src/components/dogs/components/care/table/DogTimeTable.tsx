
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DogCareStatus } from '@/types/dailyCare';
import TimeTableHeader from './components/TimeTableHeader';
import TimeTableContent from './components/TimeTableContent';
import TimeTableFooter from './components/TimeTableFooter';
import usePottyBreakTable from './hooks/usePottyBreakTable';
import SpecialConditionsAlert from './components/SpecialConditionsAlert';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import CareLogForm from '../CareLogForm';
import { generateTimeSlots } from './dogGroupColors';

interface DogTimeTableProps {
  dogsStatus: DogCareStatus[];
  onRefresh?: () => void;
}

const DogTimeTable: React.FC<DogTimeTableProps> = ({ dogsStatus, onRefresh }) => {
  const [activeCategory, setActiveCategory] = useState('pottybreaks');
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);
  const [selectedDogName, setSelectedDogName] = useState<string>('');
  const [careDialogOpen, setCareDialogOpen] = useState(false);
  const [timeSlots, setTimeSlots] = useState<string[]>(generateTimeSlots());
  const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());
  
  // Function to refresh time slots and data
  const refreshTimeTable = () => {
    const now = new Date();
    setTimeSlots(generateTimeSlots(now));
    setLastRefreshTime(now);
    if (handleRefresh) {
      handleRefresh();
    }
  };
  
  // Auto-refresh logic - check every minute if the hour has changed
  useEffect(() => {
    const checkHourChange = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const lastHour = lastRefreshTime.getHours();
      
      // If the hour has changed, refresh the time slots
      if (currentHour !== lastHour) {
        console.log('Hour changed, refreshing time table');
        refreshTimeTable();
      }
    };
    
    // Set up interval to check for hour changes (every minute)
    const intervalId = setInterval(checkHourChange, 60000);
    
    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, [lastRefreshTime]);
  
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
    refreshTimeTable();
  };

  // Initial load
  useEffect(() => {
    refreshTimeTable();
  }, []);

  return (
    <Card className="shadow-md overflow-hidden">
      <TimeTableHeader
        dogCount={sortedDogs.length}
        currentDate={currentDate}
        isLoading={isLoading}
        onRefresh={refreshTimeTable}
        lastRefreshTime={lastRefreshTime}
      />
      
      <CardContent className="p-0">
        {/* For now, we're only using pottybreaks, so removed tabs */}
        <div className="px-4 py-2 border-b">
          <h3 className="text-lg font-medium">Potty Breaks</h3>
          <p className="text-sm text-muted-foreground">
            Click on a cell to log or remove a potty break. 
            <span className="ml-1 font-medium">
              Showing 8-hour window from {timeSlots[0]} to {timeSlots[timeSlots.length - 1]}
            </span>
          </p>
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
          currentHour={new Date().getHours()}
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
