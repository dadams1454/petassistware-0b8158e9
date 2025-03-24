
import React, { useState, useEffect, useRef, useMemo, useCallback, useTransition } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useDailyCare } from '@/contexts/dailyCare';
import PottyBreakReminderCard from '@/components/dogs/components/care/potty/PottyBreakReminderCard';
import DogTimeTable from '@/components/dogs/components/care/table/DogTimeTable';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useQueryWithRefresh } from '@/hooks/useQueryWithRefresh';
import { Loader2 } from 'lucide-react';
import { useRefresh } from '@/contexts/refreshContext';

interface DailyCareTabProps {
  currentDate?: Date;
}

const DailyCareTab: React.FC<DailyCareTabProps> = ({ 
  currentDate = new Date()
}) => {
  const { fetchAllDogsWithCareStatus } = useDailyCare();
  const [localRefreshing, setLocalRefreshing] = useState(false);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const unmountedRef = useRef<boolean>(false);
  // Add useTransition to prevent UI blocking
  const [isPending, startTransition] = useTransition();
  
  // Use the centralized refresh system
  const { isRefreshing: globalRefreshing, handleRefresh } = useRefresh('dailyCare');
  
  // Use React Query with our custom hook
  const { 
    data: dogStatuses, 
    isLoading, 
    isRefetching,
    manualRefresh,
    error 
  } = useQueryWithRefresh({
    queryKey: ['dogs', 'careStatus', currentDate.toISOString().split('T')[0]],
    queryFn: async () => {
      console.log('📊 Fetching dog care statuses via React Query');
      const dogs = await fetchAllDogsWithCareStatus(currentDate);
      console.log(`✅ Fetched ${dogs.length} dog statuses`);
      return dogs;
    },
    area: 'dailyCare',
    staleTime: 15 * 60 * 1000, // 15 minutes
    enableToasts: true,
    refreshLabel: 'dog care data',
  });
  
  // Create a proper refresh function that ensures both local and global state updates
  const handleTableRefresh = useCallback(() => {
    console.log('🔄 Table refresh triggered from DailyCareTab');
    setLocalRefreshing(true);
    
    // Call the centralized refresh handler
    handleRefresh(true);
    
    // Also trigger a manual refetch via React Query
    startTransition(() => {
      manualRefresh(true);
      
      // Clear refreshing state after a short delay
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      
      refreshTimeoutRef.current = setTimeout(() => {
        if (!unmountedRef.current) {
          setLocalRefreshing(false);
        }
      }, 1000);
    });
  }, [handleRefresh, manualRefresh]);
  
  // Use useMemo to compute combined loading state
  const isRefreshing = useMemo(() => 
    isLoading || isRefetching || globalRefreshing || localRefreshing || isPending,
    [isLoading, isRefetching, globalRefreshing, localRefreshing, isPending]
  );
  
  // Use useMemo to derive whether we have dog data to display
  const hasDogsData = useMemo(() => 
    dogStatuses && dogStatuses.length > 0,
    [dogStatuses]
  );
  
  // Error reset handler
  const handleErrorReset = useCallback(() => {
    console.log("Resetting after error in DailyCareTab");
    manualRefresh(false);
  }, [manualRefresh]);
  
  // Clean up timeout on unmount
  useEffect(() => {
    unmountedRef.current = false;
    
    return () => {
      unmountedRef.current = true;
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }
    };
  }, []);
  
  // Use useMemo for the empty state content
  const emptyStateContent = useMemo(() => (
    <Card className="p-8 text-center">
      <CardContent>
        <p className="text-muted-foreground mb-4">No dogs found. Please refresh or add dogs to the system.</p>
      </CardContent>
    </Card>
  ), []);
  
  // Use useMemo for the main content when we have dog data
  const mainContent = useMemo(() => (
    <div className="space-y-6">
      {/* Improved loading indicator for the entire component */}
      {isPending && (
        <div className="fixed bottom-4 right-4 z-50 bg-primary text-primary-foreground py-2 px-4 rounded-full shadow-lg flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Updating...</span>
        </div>
      )}
      
      {/* Reminder Card */}
      <PottyBreakReminderCard 
        dogs={dogStatuses || []}
        onLogPottyBreak={() => {
          // Just scroll to the timetable on click
          const timeTableSection = document.getElementById('dog-time-table');
          if (timeTableSection) {
            timeTableSection.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />
      
      {/* Time Table */}
      <div id="dog-time-table">
        <DogTimeTable 
          dogsStatus={dogStatuses || []} 
          isRefreshing={isRefreshing}
          currentDate={currentDate}
          onRefresh={handleTableRefresh}
        />
      </div>
    </div>
  ), [dogStatuses, isRefreshing, currentDate, isPending, handleTableRefresh]);
  
  return (
    <ErrorBoundary onReset={handleErrorReset}>
      <div className={`transition-opacity duration-200 ${isPending ? 'opacity-90' : 'opacity-100'}`}>
        {hasDogsData ? mainContent : emptyStateContent}
      </div>
    </ErrorBoundary>
  );
};

export default DailyCareTab;
