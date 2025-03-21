
import React, { useState, useCallback, useRef, useEffect } from 'react';
import MainLayout from '@/layouts/MainLayout';
import DogTimeTable from '@/components/dogs/components/care/table/DogTimeTable';
import { useDailyCare } from '@/contexts/dailyCare';
import { Card } from '@/components/ui/card';
import { Clock, Calendar } from 'lucide-react';
import PottyBreakReminderCard from '@/components/dogs/components/care/potty/PottyBreakReminderCard';
import { format, formatDistanceToNow } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

const DailyCare: React.FC = () => {
  const { loading, dogStatuses, fetchAllDogsWithCareStatus } = useDailyCare();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const midnightCheckRef = useRef<NodeJS.Timeout | null>(null);
  const autoRefreshRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  
  // Increase auto-refresh interval to reduce server load
  const AUTO_REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes in milliseconds

  // Setup midnight check to refresh data at midnight
  const setupMidnightCheck = useCallback(() => {
    // Clear any existing interval
    if (midnightCheckRef.current) {
      clearTimeout(midnightCheckRef.current);
    }
    
    // Get current time and calculate time until next midnight
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    // Time until midnight in milliseconds
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    
    console.log(`⏰ Setting up midnight check: ${timeUntilMidnight / 1000 / 60} minutes until midnight refresh`);
    
    // Set timeout for midnight reset
    midnightCheckRef.current = setTimeout(() => {
      console.log('🕛 Midnight reached - refreshing all dog data!');
      const newDate = new Date();
      setCurrentDate(newDate);
      
      // Force refresh at midnight
      fetchAllDogsWithCareStatus(newDate, true)
        .then(dogs => {
          console.log(`✅ Midnight refresh: ${dogs.length} dogs loaded for ${format(newDate, 'PP')}`);
          setLastRefresh(new Date());
        })
        .catch(error => {
          console.error('❌ Error during midnight refresh:', error);
        });
    }, timeUntilMidnight);
    
    return () => {
      if (midnightCheckRef.current) {
        clearTimeout(midnightCheckRef.current);
      }
    };
  }, [fetchAllDogsWithCareStatus]);

  // Set up auto-refresh with optimized interval
  useEffect(() => {
    const handleRefresh = async () => {
      console.log('🔄 Auto refresh triggered');
      
      try {
        const dogs = await fetchAllDogsWithCareStatus(currentDate, true);
        console.log(`✅ Auto refreshed: ${dogs.length} dogs loaded`);
        setLastRefresh(new Date());
      } catch (error) {
        console.error('❌ Error during auto refresh:', error);
      }
    };
    
    // Setup refresh interval
    autoRefreshRef.current = setInterval(handleRefresh, AUTO_REFRESH_INTERVAL);
    
    // Setup visibility change handler to refresh when user returns to tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('🔍 Page became visible - refreshing data');
        handleRefresh();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Clean up on unmount
    return () => {
      if (autoRefreshRef.current) {
        clearInterval(autoRefreshRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchAllDogsWithCareStatus, currentDate]);

  // Set up midnight check
  useEffect(() => {
    const cleanupMidnightCheck = setupMidnightCheck();
    return () => cleanupMidnightCheck();
  }, [setupMidnightCheck]);

  // Initial fetch only once on component mount
  useEffect(() => {
    console.log(`🚀 DailyCare page - initial fetch for ${format(currentDate, 'PP')}`);
    
    // Force a fetch on component mount to ensure we have data
    fetchAllDogsWithCareStatus(currentDate, true)
      .then(dogs => {
        console.log('✅ Initial fetch - dogs count:', dogs.length);
        setLastRefresh(new Date());
      })
      .catch(error => {
        console.error('❌ Error on initial fetch:', error);
      });
  }, [fetchAllDogsWithCareStatus, currentDate]);
  
  const formattedLastRefresh = lastRefresh ? format(lastRefresh, 'h:mm a') : '';
  const timeAgo = lastRefresh ? formatDistanceToNow(lastRefresh, { addSuffix: true }) : '';

  const content = (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Daily Care Time Table
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400 flex items-center flex-wrap">
          <span className="mr-2">Track potty breaks, feeding, medications and exercise</span>
          <span className="mr-2">{dogStatuses ? ` (${dogStatuses.length} dogs)` : ' (Loading...)'}</span>
          <span className="ml-2 text-xs flex items-center gap-1 text-slate-400">
            <Clock className="h-3 w-3" />
            Auto-refreshes every 30 minutes • Last refresh: {formattedLastRefresh} ({timeAgo})
          </span>
          <span className="ml-2 text-xs flex items-center gap-1 text-slate-400">
            <Calendar className="h-3 w-3" />
            {format(currentDate, 'PPPP')}
          </span>
        </p>
      </div>

      {dogStatuses && dogStatuses.length > 0 ? (
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
          
          {/* Time Table - no more refresh button */}
          <div id="dog-time-table">
            <DogTimeTable 
              dogsStatus={dogStatuses}
              currentDate={currentDate}
            />
          </div>
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No dogs found. Dogs will automatically appear here when added to the system.</p>
        </Card>
      )}
    </>
  );

  return <MainLayout>{content}</MainLayout>;
};

export default DailyCare;
