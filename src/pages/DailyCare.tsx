
import React, { useCallback, useRef } from 'react';
import MainLayout from '@/layouts/MainLayout';
import DogTimeTable from '@/components/dogs/components/care/table/DogTimeTable';
import { useDailyCare } from '@/contexts/dailyCare';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Clock, Calendar } from 'lucide-react';
import PottyBreakReminderCard from '@/components/dogs/components/care/potty/PottyBreakReminderCard';
import { format } from 'date-fns';
import { useAutoRefresh } from '@/hooks/useAutoRefresh';

const DailyCare: React.FC = () => {
  const { dogStatuses, fetchAllDogsWithCareStatus } = useDailyCare();
  
  // Use the enhanced auto-refresh system with midnightReset
  const { 
    isRefreshing,
    handleRefresh,
    formatTimeRemaining,
    currentDate
  } = useAutoRefresh({
    interval: 15 * 60 * 1000, // 15 minutes
    refreshLabel: 'dog care data',
    midnightReset: true,
    onRefresh: async () => {
      console.log('🔄 Auto-refresh triggered in DailyCare page');
      const dogs = await fetchAllDogsWithCareStatus(currentDate, true);
      console.log(`✅ Auto-refreshed: Loaded ${dogs.length} dogs`);
      return dogs;
    }
  });

  const content = (
    <>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Daily Care Time Table
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400 flex items-center">
            Track potty breaks, feeding, medications and exercise for all your dogs
            {dogStatuses ? ` (${dogStatuses.length} dogs)` : ' (Loading...)'}
            <span className="ml-2 text-xs flex items-center gap-1 text-slate-400">
              <Clock className="h-3 w-3" />
              Next refresh: {formatTimeRemaining()}
            </span>
            <span className="ml-2 text-xs flex items-center gap-1 text-slate-400">
              <Calendar className="h-3 w-3" />
              {format(currentDate, 'PPPP')}
            </span>
          </p>
        </div>
        <Button onClick={() => handleRefresh(true)} className="gap-2" disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh Dogs
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
          
          {/* Time Table */}
          <div id="dog-time-table">
            <DogTimeTable 
              dogsStatus={dogStatuses} 
              onRefresh={() => handleRefresh(true)} 
              isRefreshing={isRefreshing}
              currentDate={currentDate}
            />
          </div>
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No dogs found. Please refresh or add dogs to the system.</p>
          <Button 
            onClick={() => handleRefresh(true)} 
            className="mt-4"
            disabled={isRefreshing}
          >
            {isRefreshing ? "Refreshing..." : "Refresh Dogs"}
          </Button>
        </Card>
      )}
    </>
  );

  return <MainLayout>{content}</MainLayout>;
};

export default DailyCare;
