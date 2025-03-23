
import React, { useState, useEffect, useRef, useMemo, useCallback, useTransition } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useDailyCare } from '@/contexts/dailyCare';
import PottyBreakReminderCard from '@/components/dogs/components/care/potty/PottyBreakReminderCard';
import DogTimeTable from '@/components/dogs/components/care/table/DogTimeTable';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useQueryWithRefresh } from '@/hooks/useQueryWithRefresh';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';
import { Loader2 } from 'lucide-react';

interface DailyCareTabProps {
  onRefreshDogs?: () => void;
  isRefreshing?: boolean;
  currentDate?: Date;
}

const DailyCareTab: React.FC<DailyCareTabProps> = ({ 
  onRefreshDogs, 
  isRefreshing: externalRefreshing,
  currentDate = new Date()
}) => {
  const { fetchAllDogsWithCareStatus } = useDailyCare();
  const [localRefreshing, setLocalRefreshing] = useState(false);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const unmountedRef = useRef<boolean>(false);
  // Add useTransition to prevent UI blocking
  const [isPending, startTransition] = useTransition();
  
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
  
  // Use useMemo to compute combined loading state
  const isRefreshing = useMemo(() => 
    isLoading || isRefetching || externalRefreshing || localRefreshing || isPending,
    [isLoading, isRefetching, externalRefreshing, localRefreshing, isPending]
  );
  
  // Use useMemo to derive whether we have dog data to display
  const hasDogsData = useMemo(() => 
    dogStatuses && dogStatuses.length > 0,
    [dogStatuses]
  );
  
  // Debounced refresh handler to prevent rapid consecutive refreshes
  const debouncedHandleRefresh = useDebouncedCallback(() => {
    if (unmountedRef.current) return;
    
    setLocalRefreshing(true);
    console.log('DailyCareTab refresh triggered via debounced handler');
    
    // Start transition for UI updates
    startTransition(() => {
      // Use our manual refresh function
      manualRefresh(true);
      
      // Call external refresh if provided
      if (onRefreshDogs) {
        onRefreshDogs();
      }
    });
    
    // Ensure we show the loading state for at least 500ms to avoid flicker
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
    
    refreshTimeoutRef.current = setTimeout(() => {
      if (unmountedRef.current) return;
      setLocalRefreshing(false);
      refreshTimeoutRef.current = null;
    }, 500);
  }, 300); // Debounce for 300ms
  
  // Original non-debounced handler for places where we need immediate refresh
  const handleLocalRefresh = useCallback(() => {
    if (unmountedRef.current) return;
    
    setLocalRefreshing(true);
    console.log('DailyCareTab refresh triggered via React Query');
    
    // Start transition for UI updates
    startTransition(() => {
      // Use our manual refresh function
      manualRefresh(true);
      
      // Call external refresh if provided
      if (onRefreshDogs) {
        onRefreshDogs();
      }
    });
    
    // Ensure we show the loading state for at least 500ms to avoid flicker
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
    
    refreshTimeoutRef.current = setTimeout(() => {
      if (unmountedRef.current) return;
      setLocalRefreshing(false);
      refreshTimeoutRef.current = null;
    }, 500);
  }, [manualRefresh, onRefreshDogs]);
  
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
  
  // Error reset handler
  const handleErrorReset = useCallback(() => {
    console.log("Resetting after error in DailyCareTab");
    handleLocalRefresh();
  }, [handleLocalRefresh]);
  
  // Use useMemo for the empty state content
  const emptyStateContent = useMemo(() => (
    <Card className="p-8 text-center">
      <CardContent>
        <p className="text-muted-foreground mb-4">No dogs found. Please refresh or add dogs to the system.</p>
        <button 
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2"
          onClick={handleLocalRefresh} 
          disabled={isRefreshing}
          onMouseDown={(e) => e.preventDefault()}
        >
          {isRefreshing && <Loader2 className="h-4 w-4 animate-spin" />}
          {isRefreshing ? 'Refreshing...' : 'Refresh Dogs'}
        </button>
      </CardContent>
    </Card>
  ), [isRefreshing, handleLocalRefresh]);
  
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
          onRefresh={debouncedHandleRefresh} // Use debounced handler here
          isRefreshing={isRefreshing}
          currentDate={currentDate}
        />
      </div>
    </div>
  ), [dogStatuses, debouncedHandleRefresh, isRefreshing, currentDate, isPending]);
  
  return (
    <ErrorBoundary onReset={handleErrorReset}>
      <div className={`transition-opacity duration-200 ${isPending ? 'opacity-90' : 'opacity-100'}`}>
        {hasDogsData ? mainContent : emptyStateContent}
      </div>
    </ErrorBoundary>
  );
};

export default DailyCareTab;
