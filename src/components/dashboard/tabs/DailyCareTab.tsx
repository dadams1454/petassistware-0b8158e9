
import React, { useCallback, useMemo } from 'react';
import { useDailyCare } from '@/contexts/dailyCare';
import PottyBreakReminderCard from '@/components/dogs/components/care/potty/PottyBreakReminderCard';
import DogTimeTable from '@/components/dogs/components/care/table/DogTimeTable';
import { useToast } from '@/components/ui/use-toast';
import { useAutoRefresh } from './hooks/useAutoRefresh';
import EmptyDogState from './components/EmptyDogState';
import RefreshIndicator from './components/RefreshIndicator';

const DailyCareTab: React.FC = () => {
  const { dogStatuses, fetchAllDogsWithCareStatus } = useDailyCare();
  const { toast } = useToast();
  
  // Combined refresh function with improved error handling
  const handleCombinedRefresh = useCallback(async (): Promise<boolean> => {
    console.log('🔄 Auto refresh triggered in DailyCareTab');
    
    try {
      // Call the parent refresh (no need for onRefreshDogs prop anymore)
      await fetchAllDogsWithCareStatus(new Date(), true);
      
      return true;
    } catch (error) {
      console.error('Error during refresh:', error);
      return false;
    }
  }, [fetchAllDogsWithCareStatus]);
  
  // Use auto-refresh hook with longer interval (1 hour)
  const { lastRefresh } = useAutoRefresh({
    onRefresh: handleCombinedRefresh,
    isRefreshing: false,
    interval: 60 * 60 * 1000 // 60 minutes
  });
  
  // Memoize the empty state component
  const emptyState = useMemo(() => (
    <EmptyDogState />
  ), []);
  
  if (!dogStatuses || dogStatuses.length === 0) {
    return emptyState;
  }
  
  return (
    <div className="space-y-6">
      <RefreshIndicator refreshInterval={60} lastRefresh={lastRefresh} />
      
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
      
      {/* Time Table (now without manual refresh button) */}
      <div id="dog-time-table">
        <DogTimeTable 
          dogsStatus={dogStatuses}
        />
      </div>
    </div>
  );
};

export default React.memo(DailyCareTab);
