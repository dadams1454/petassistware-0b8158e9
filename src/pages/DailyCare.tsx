import React, { useState, useEffect, useCallback } from 'react';
import PageContainer from '@/components/common/PageContainer';
import CareTracker from '@/components/dogs/components/care/CareTracker';
import { DogCareStatus } from '@/types/dailyCare';
import { fetchDogCareStatus } from '@/services/dailyCare/dogCareService';
import { addDays, format, subDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';

// Update CareTrackerComponent to include onRefreshDogs prop
interface CareTrackerComponentProps {
  onRefreshDogs?: (showLoading?: boolean) => Promise<any>;
}

const DailyCare: React.FC = () => {
  const [dogsStatus, setDogsStatus] = useState<DogCareStatus[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const handleRefreshDogs = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setIsRefreshing(true);
    }
    
    try {
      const formattedDate = format(currentDate, 'yyyy-MM-dd');
      const status = await fetchDogCareStatus(formattedDate);
      setDogsStatus(status);
      return status;
    } catch (error) {
      console.error('Error refreshing dog status:', error);
      return [];
    } finally {
      if (showLoading) {
        setIsRefreshing(false);
      }
    }
  }, [currentDate]);

  useEffect(() => {
    handleRefreshDogs();
  }, [handleRefreshDogs]);

  const handlePreviousDay = () => {
    setCurrentDate(prevDate => subDays(prevDate, 1));
  };

  const handleNextDay = () => {
    setCurrentDate(prevDate => addDays(prevDate, 1));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setCurrentDate(date);
      setIsDatePickerOpen(false);
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  return (
    <PageContainer>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Daily Care</h1>
        
        {/* Date Navigation */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={handlePreviousDay}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="relative">
              <Button
                variant={isToday(currentDate) ? "default" : "outline"}
                onClick={() => setIsDatePickerOpen(true)}
                className="min-w-[180px]"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {format(currentDate, 'MMMM d, yyyy')}
                {isToday(currentDate) && " (Today)"}
              </Button>
              
              <DatePicker
                date={currentDate}
                onSelect={handleDateChange}
                open={isDatePickerOpen}
                onOpenChange={setIsDatePickerOpen}
              />
            </div>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleNextDay}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => handleRefreshDogs(true)}
            disabled={isRefreshing}
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
        
        {/* Care Tracker Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CareTracker 
              dogsStatus={dogsStatus}
              onRefresh={handleRefreshDogs}
              isRefreshing={isRefreshing}
              currentDate={currentDate}
            />
          </div>
          
          <div className="space-y-6">
            <div>
              {/* A component that doesn't need onRefreshDogs */}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default DailyCare;
