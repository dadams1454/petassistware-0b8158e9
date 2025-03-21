
import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useDailyCare } from '@/contexts/dailyCare';
import PottyBreakReminderCard from '@/components/dogs/components/care/potty/PottyBreakReminderCard';
import DogTimeTable from '@/components/dogs/components/care/table/DogTimeTable';
import { useToast } from '@/components/ui/use-toast';
import { useAutoRefresh } from './hooks/useAutoRefresh';
import EmptyDogState from './components/EmptyDogState';
import RefreshIndicator from './components/RefreshIndicator';

interface DailyCareTabProps {
  onRefreshDogs: () => void;
  isRefreshing: boolean;
}

const DailyCareTab: React.FC<DailyCareTabProps> = React.memo(({ onRefreshDogs, isRefreshing }) => {
  const { dogStatuses, fetchAllDogsWithCareStatus } = useDailyCare();
  const { toast } = useToast();
  const [visible, setVisible] = useState(false);
  
  // Combined refresh function that handles both parent and local refresh
  const handleCombinedRefresh = useCallback(async () => {
    console.log('🔄 Combined refresh triggered in DailyCareTab');
    
    // First call the parent refresh
    onRefreshDogs();
    
    // Then do our own refresh for feeding status
    await fetchAllDogsWithCareStatus(new Date(), true);
    
    // Display toast about feeding functionality
    toast({
      title: "Daily Care Management",
      description: "Switch to the Feeding tab to manage dog feeding records.",
    });
  }, [onRefreshDogs, fetchAllDogsWithCareStatus, toast]);
  
  // Memoize dog statuses to prevent unnecessary renders
  const memoizedDogStatuses = useMemo(() => dogStatuses, [dogStatuses]);
  
  // Use our auto-refresh hook with increased interval to reduce frequency
  const { handleRefresh } = useAutoRefresh({
    onRefresh: handleCombinedRefresh,
    isRefreshing,
    interval: 60 * 60 * 1000 // Increased to 60 minutes to reduce refreshes
  });
  
  // Add a smooth fade-in effect when the component mounts
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);
  
  if (!memoizedDogStatuses || memoizedDogStatuses.length === 0) {
    return <EmptyDogState onRefresh={handleRefresh} isRefreshing={isRefreshing} />;
  }
  
  return (
    <div className={`space-y-6 transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <RefreshIndicator refreshInterval={60} />
      
      {/* Reminder Card */}
      <PottyBreakReminderCard 
        dogs={memoizedDogStatuses}
        onLogPottyBreak={() => {
          // Just scroll to the timetable on click
          const timeTableSection = document.getElementById('dog-time-table');
          if (timeTableSection) {
            timeTableSection.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />
      
      {/* Time Table (now the main and only component) */}
      <div id="dog-time-table">
        <DogTimeTable 
          dogsStatus={memoizedDogStatuses} 
          onRefresh={handleRefresh} 
        />
      </div>
    </div>
  );
});

DailyCareTab.displayName = 'DailyCareTab';

export default DailyCareTab;
