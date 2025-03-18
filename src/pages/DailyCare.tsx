
import React, { useEffect } from 'react';
import MainLayout from '@/layouts/MainLayout';
import DogTimeTable from '@/components/dogs/components/care/table/DogTimeTable';
import { useDailyCare } from '@/contexts/dailyCare';
import { Card } from '@/components/ui/card';
import { DogCareStatus } from '@/types/dailyCare';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const DailyCare: React.FC = () => {
  const { loading, dogStatuses, fetchAllDogsWithCareStatus } = useDailyCare();
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  // Manually trigger refresh function
  const handleManualRefresh = () => {
    console.log('🔄 Manual refresh triggered in DailyCare page');
    setRefreshTrigger(prev => prev + 1);
    // Force fetch with refresh flag
    fetchAllDogsWithCareStatus(new Date(), true)
      .then(dogs => {
        console.log(`✅ Manually refreshed: ${dogs.length} dogs loaded`);
      })
      .catch(error => {
        console.error('❌ Error during manual refresh:', error);
      });
  };

  // Fetch all dogs on component mount, when fetchAllDogsWithCareStatus changes,
  // or when refreshTrigger is updated
  useEffect(() => {
    console.log('🚀 DailyCare page mount or refresh triggered - fetching dogs data');
    
    // Force a fetch on component mount to ensure we have data
    fetchAllDogsWithCareStatus(new Date(), true)
      .then(dogs => {
        console.log('✅ Fetched dogs count:', dogs.length);
        if (dogs.length > 0) {
          console.log('🐕 Dog names:', dogs.map(d => d.dog_name).join(', '));
        } else {
          console.warn('⚠️ No dogs returned from API call');
        }
      })
      .catch(error => {
        console.error('❌ Error fetching dogs on DailyCare mount:', error);
      });
  }, [fetchAllDogsWithCareStatus, refreshTrigger]);

  return (
    <MainLayout>
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
        <Button onClick={handleManualRefresh} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh Dogs
        </Button>
      </div>

      {dogStatuses && dogStatuses.length > 0 ? (
        <DogTimeTable dogsStatus={dogStatuses} onRefresh={handleManualRefresh} />
      ) : (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No dogs found. Please refresh or add dogs to the system.</p>
          <Button onClick={handleManualRefresh} className="mt-4">Refresh Dogs</Button>
        </Card>
      )}
    </MainLayout>
  );
};

export default DailyCare;
