
import React, { useCallback, useTransition } from 'react';
import MainLayout from '@/layouts/MainLayout';
import DogTimeTable from '@/components/dogs/components/care/table/DogTimeTable';
import { useDailyCare } from '@/contexts/dailyCare';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Clock, Calendar, Loader2 } from 'lucide-react';
import PottyBreakReminderCard from '@/components/dogs/components/care/potty/PottyBreakReminderCard';
import { format } from 'date-fns';
import { useAutoRefresh } from '@/hooks/useAutoRefresh';

const DailyCare: React.FC = () => {
  const { dogStatuses, fetchAllDogsWithCareStatus } = useDailyCare();
  // Add useTransition to prevent UI blocking
  const [isPending, startTransition] = useTransition();
  
  // Use the enhanced auto-refresh system with midnightReset
  const { 
    isRefreshing,
    handleRefresh,
    formatTimeRemaining,
    currentDate
  } = useAutoRefresh({
    area: 'dailyCare',
    interval: 15 * 60 * 1000, // 15 minutes
    refreshLabel: 'dog care data',
    midnightReset: true,
    onRefresh: async (date = new Date(), force = false) => {
      console.log('🔄 Auto-refresh triggered in DailyCare page');
      const dogs = await fetchAllDogsWithCareStatus(date, force);
      console.log(`✅ Auto-refreshed: Loaded ${dogs.length} dogs`);
      return dogs;
    }
  });

  // Enhanced refresh handler with useTransition
  const handleRefreshWithTransition = useCallback(() => {
    startTransition(() => {
      handleRefresh(true);
    });
  }, [handleRefresh]);

  // Combined loading state
  const isLoading = isRefreshing || isPending;

  const content = (
    <>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Daily Care Time Table
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400 flex items-center flex-wrap gap-2">
            <span>Track potty breaks, feeding, medications and exercise for all your dogs
            {dogStatuses ? ` (${dogStatuses.length} dogs)` : ' (Loading...)'}</span>
            <span className="text-xs flex items-center gap-1 text-slate-400">
              <Clock className="h-3 w-3" />
              Next refresh: {formatTimeRemaining()}
            </span>
            <span className="text-xs flex items-center gap-1 text-slate-400">
              <Calendar className="h-3 w-3" />
              {format(currentDate, 'PPPP')}
            </span>
          </p>
        </div>
        <Button 
          onClick={handleRefreshWithTransition} 
          className="gap-2" 
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {isLoading ? "Refreshing..." : "Refresh Dogs"}
        </Button>
      </div>

      {dogStatuses && dogStatuses.length > 0 ? (
        <div className={`space-y-6 transition-opacity duration-200 ${isPending ? 'opacity-90' : 'opacity-100'}`}>
          {/* Pending state indicator */}
          {isPending && (
            <div className="fixed bottom-4 right-4 z-50 bg-primary text-primary-foreground py-2 px-4 rounded-full shadow-lg flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Updating...</span>
            </div>
          )}
          
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
          
          {/* Time Table */}
          <div id="dog-time-table">
            <DogTimeTable 
              dogsStatus={dogStatuses} 
              onRefresh={handleRefreshWithTransition} 
              isRefreshing={isLoading}
              currentDate={currentDate}
            />
          </div>
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No dogs found. Please refresh or add dogs to the system.</p>
          <Button 
            onClick={handleRefreshWithTransition} 
            className="mt-4 gap-2"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading ? "Refreshing..." : "Refresh Dogs"}
          </Button>
        </Card>
      )}
    </>
  );

  return <MainLayout>{content}</MainLayout>;
};

export default DailyCare;
