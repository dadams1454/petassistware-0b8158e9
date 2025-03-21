
import React, { useCallback, useMemo } from 'react';
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

const DailyCareTab: React.FC<DailyCareTabProps> = ({ onRefreshDogs, isRefreshing }) => {
  const { dogStatuses, fetchAllDogsWithCareStatus } = useDailyCare();
  const { toast } = useToast();
  
  // Combined refresh function with improved error handling
  const handleCombinedRefresh = useCallback(async (): Promise<boolean> => {
    console.log('🔄 Combined refresh triggered in DailyCareTab');
    
    try {
      // First call the parent refresh
      onRefreshDogs();
      
      // Then do our own refresh for feeding status
      await fetchAllDogsWithCareStatus(new Date(), true);
      
      // Display toast about feeding functionality - but only once per session
      const feedingToastShown = sessionStorage.getItem('feedingToastShown');
      if (!feedingToastShown) {
        toast({
          title: "Daily Care Management",
          description: "Switch to the Feeding tab to manage dog feeding records.",
        });
        sessionStorage.setItem('feedingToastShown', 'true');
      }
      
      return true;
    } catch (error) {
      console.error('Error during combined refresh:', error);
      toast({
        title: "Refresh failed",
        description: "Could not refresh dog data. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  }, [onRefreshDogs, fetchAllDogsWithCareStatus, toast]);
  
  // Use auto-refresh hook with longer interval (1 hour)
  const { handleRefresh } = useAutoRefresh({
    onRefresh: handleCombinedRefresh,
    isRefreshing,
    interval: 60 * 60 * 1000 // 60 minutes - reduce server load
  });
  
  // Memoize the empty state component
  const emptyState = useMemo(() => (
    <EmptyDogState onRefresh={handleRefresh} isRefreshing={isRefreshing} />
  ), [handleRefresh, isRefreshing]);
  
  if (!dogStatuses || dogStatuses.length === 0) {
    return emptyState;
  }
  
  return (
    <div className="space-y-6">
      <RefreshIndicator refreshInterval={60} />
      
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
      
      {/* Time Table (now the main and only component) */}
      <div id="dog-time-table">
        <DogTimeTable 
          dogsStatus={dogStatuses} 
          onRefresh={handleRefresh} 
        />
      </div>
    </div>
  );
};

export default React.memo(DailyCareTab);
