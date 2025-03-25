
import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import DogTimeTable from '@/components/dogs/components/care/table/DogTimeTable';
import { useDailyCare } from '@/contexts/dailyCare';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import PottyBreakReminderCard from '@/components/dogs/components/care/potty/PottyBreakReminderCard';
import { useRefresh } from '@/contexts/RefreshContext';
import { useRefreshData } from '@/hooks/useRefreshData';
import { EmptyState } from '@/components/ui/standardized';

const DailyCare: React.FC = () => {
  const { fetchAllDogsWithCareStatus } = useDailyCare();
  const { currentDate } = useRefresh();

  // Use the centralized refresh hook
  const { 
    data: dogStatuses, 
    isLoading, 
    refresh: handleRefresh 
  } = useRefreshData({
    key: 'dogCare',
    fetchData: async () => {
      return await fetchAllDogsWithCareStatus(currentDate, true);
    },
    dependencies: [currentDate],
    loadOnMount: true
  });

  const content = (
    <>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Daily Care Time Table
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Track potty breaks, feeding, medications and exercise for all your dogs
            {dogStatuses ? ` (${dogStatuses.length} dogs)` : ' (Loading...)'}
          </p>
        </div>
        <Button onClick={() => handleRefresh(true)} className="gap-2" disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh Now
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
              isRefreshing={isLoading}
              currentDate={currentDate}
            />
          </div>
        </div>
      ) : (
        <Card className="p-8">
          <EmptyState
            title="No Dogs Found"
            description="No dogs found. Please refresh or add dogs to the system."
            action={{
              label: isLoading ? "Refreshing..." : "Refresh Dogs",
              onClick: () => handleRefresh(true)
            }}
          />
        </Card>
      )}
    </>
  );

  return <MainLayout>{content}</MainLayout>;
};

export default DailyCare;
