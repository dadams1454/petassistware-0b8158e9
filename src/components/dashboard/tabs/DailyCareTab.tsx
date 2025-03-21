
import React, { useCallback } from 'react';
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
  
  // Use our new auto-refresh hook
  const { handleRefresh } = useAutoRefresh({
    onRefresh: handleCombinedRefresh,
    isRefreshing,
    interval: 30 * 60 * 1000 // 30 minutes
  });
  
  if (!dogStatuses || dogStatuses.length === 0) {
    return <EmptyDogState onRefresh={handleRefresh} isRefreshing={isRefreshing} />;
  }
  
  return (
    <div className="space-y-6">
      <RefreshIndicator refreshInterval={30} />
      
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

export default DailyCareTab;
