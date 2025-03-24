
import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useDailyCare } from '@/contexts/dailyCare';
import PottyBreakReminderCard from '@/components/dogs/components/care/potty/PottyBreakReminderCard';
import DogTimeTable from '@/components/dogs/components/care/table/DogTimeTable';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useRefresh } from '@/contexts/RefreshContext';

interface DailyCareTabProps {
  onRefreshDogs: () => void;
  isRefreshing: boolean;
  currentDate?: Date;
}

const DailyCareTab: React.FC<DailyCareTabProps> = ({ 
  onRefreshDogs, 
  isRefreshing,
  currentDate = new Date() // Default to current date if not provided
}) => {
  const { dogStatuses } = useDailyCare();
  const [localRefreshing, setLocalRefreshing] = useState(false);
  const unmountedRef = useRef<boolean>(false);
  
  // Handle local refresh state to show a smoother UI
  const handleLocalRefresh = () => {
    if (unmountedRef.current) return;
    
    // Don't set refresh state if we're already refreshing
    if (isRefreshing || localRefreshing) return;
    
    setLocalRefreshing(true);
    
    console.log('DailyCareTab refresh triggered');
    
    // Actual refresh
    onRefreshDogs();
    
    // Reset local refreshing state if the parent refresh is complete
    if (!isRefreshing) {
      setLocalRefreshing(false);
    }
  };
  
  // Clean up on unmount
  React.useEffect(() => {
    unmountedRef.current = false;
    
    return () => {
      unmountedRef.current = true;
    };
  }, []);
  
  // Update local refreshing state based on prop
  React.useEffect(() => {
    if (!isRefreshing && localRefreshing && !unmountedRef.current) {
      setLocalRefreshing(false);
    }
  }, [isRefreshing, localRefreshing]);

  // Error reset handler
  const handleErrorReset = () => {
    console.log("Resetting after error in DailyCareTab");
    handleLocalRefresh();
  };
  
  if (!dogStatuses || dogStatuses.length === 0) {
    return (
      <Card className="p-8 text-center">
        <CardContent>
          <p className="text-muted-foreground mb-4">No dogs found. Please refresh or add dogs to the system.</p>
          <button 
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            onClick={handleLocalRefresh} 
            disabled={localRefreshing || isRefreshing}
            onMouseDown={(e) => e.preventDefault()}
          >
            {localRefreshing || isRefreshing ? 'Refreshing...' : 'Refresh Dogs'}
          </button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <ErrorBoundary onReset={handleErrorReset} name="DailyCareTab">
      <div className="space-y-6">
        {/* Reminder Card */}
        <PottyBreakReminderCard 
          dogs={dogStatuses}
          onLogPottyBreak={() => {
            // Just scroll to the timetable on click
            const timeTableSection = document.getElementById('dog-time-table');
            if (timeTableSection) {
              timeTableSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />
        
        {/* Time Table - use the centralized refresh from parent */}
        <div id="dog-time-table">
          <DogTimeTable 
            dogsStatus={dogStatuses} 
            onRefresh={handleLocalRefresh}
            isRefreshing={localRefreshing || isRefreshing}
            currentDate={currentDate}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default DailyCareTab;
