
import React, { useEffect, useState, useCallback, useRef } from 'react';
import MainLayout from '@/layouts/MainLayout';
import DogTimeTable from '@/components/dogs/components/care/table/DogTimeTable';
import { useDailyCare } from '@/contexts/dailyCare';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Clock, Calendar } from 'lucide-react';
import PottyBreakReminderCard from '@/components/dogs/components/care/potty/PottyBreakReminderCard';
import { startOfDay, format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

const DailyCare: React.FC = () => {
  const { loading, dogStatuses, fetchAllDogsWithCareStatus } = useDailyCare();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [lastAutoRefresh, setLastAutoRefresh] = useState<Date>(new Date());
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const midnightCheckRef = useRef<NodeJS.Timeout | null>(null);
  const isManualRefreshingRef = useRef(false);
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
      setRefreshTrigger(prev => prev + 1);
      
      // Force refresh at midnight
      fetchAllDogsWithCareStatus(newDate, true)
        .then(dogs => {
          console.log(`✅ Midnight refresh: ${dogs.length} dogs loaded for ${format(newDate, 'PP')}`);
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

  // Optimized manual refresh function with debounce pattern
  const handleManualRefresh = useCallback(() => {
    // Prevent multiple simultaneous refreshes
    if (isManualRefreshingRef.current) {
      toast({
        title: "Refresh in progress",
        description: "Please wait for the current refresh to complete.",
      });
      return;
    }
    
    console.log('🔄 Manual refresh triggered in DailyCare page');
    isManualRefreshingRef.current = true;
    setRefreshTrigger(prev => prev + 1);
    setLastAutoRefresh(new Date());
    
    // Force fetch with refresh flag
    fetchAllDogsWithCareStatus(currentDate, true)
      .then(dogs => {
        console.log(`✅ Manually refreshed: ${dogs.length} dogs loaded`);
        toast({
          title: "Data refreshed",
          description: `Successfully loaded ${dogs.length} dogs.`,
        });
      })
      .catch(error => {
        console.error('❌ Error during manual refresh:', error);
        toast({
          title: "Refresh failed",
          description: "Could not refresh data. Please try again.",
          variant: "destructive"
        });
      })
      .finally(() => {
        // Reset refreshing state after a short delay to prevent rapid re-clicks
        setTimeout(() => {
          isManualRefreshingRef.current = false;
        }, 1000);
      });
  }, [fetchAllDogsWithCareStatus, currentDate, toast]);

  // Set up auto-refresh with optimized interval
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Skip if a manual refresh is in progress
      if (isManualRefreshingRef.current) {
        console.log('🔄 Auto refresh skipped - manual refresh in progress');
        return;
      }
      
      console.log('🔄 Auto refresh triggered');
      setRefreshTrigger(prev => prev + 1);
      setLastAutoRefresh(new Date());
      
      fetchAllDogsWithCareStatus(currentDate, true)
        .then(dogs => {
          console.log(`✅ Auto refreshed: ${dogs.length} dogs loaded`);
        })
        .catch(error => {
          console.error('❌ Error during auto refresh:', error);
        });
    }, AUTO_REFRESH_INTERVAL);
    
    // Clean up on unmount
    return () => clearInterval(intervalId);
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
      })
      .catch(error => {
        console.error('❌ Error on initial fetch:', error);
      });
  }, [fetchAllDogsWithCareStatus, currentDate]);

  const content = (
    <>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Daily Care Time Table
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400 flex items-center flex-wrap">
            <span className="mr-2">Track potty breaks, feeding, medications and exercise</span>
            <span className="mr-2">{dogStatuses ? ` (${dogStatuses.length} dogs)` : ' (Loading...)'}</span>
            <span className="ml-2 text-xs flex items-center gap-1 text-slate-400">
              <Clock className="h-3 w-3" />
              Auto-refreshes every 30 minutes
            </span>
            <span className="ml-2 text-xs flex items-center gap-1 text-slate-400">
              <Calendar className="h-3 w-3" />
              {format(currentDate, 'PPPP')}
            </span>
          </p>
        </div>
        {/* Single refresh button for the page */}
        <Button 
          onClick={handleManualRefresh} 
          disabled={isManualRefreshingRef.current}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isManualRefreshingRef.current ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
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
          
          {/* Time Table - pass the handleManualRefresh function instead of creating a new one */}
          <div id="dog-time-table">
            <DogTimeTable 
              dogsStatus={dogStatuses} 
              onRefresh={handleManualRefresh} 
              currentDate={currentDate}
            />
          </div>
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No dogs found. Please refresh or add dogs to the system.</p>
          <Button onClick={handleManualRefresh} className="mt-4">Refresh Dogs</Button>
        </Card>
      )}
    </>
  );

  return <MainLayout>{content}</MainLayout>;
};

export default DailyCare;
