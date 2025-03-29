
import React, { useEffect } from 'react';
import MainLayout from '@/layouts/MainLayout';
import DogTimeTable from '@/components/dogs/components/care/table/DogTimeTable';
import { DailyCareProvider, useDailyCare } from '@/contexts/dailyCare';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Dog } from 'lucide-react';
import { useRefresh } from '@/contexts/RefreshContext';
import { useRefreshData } from '@/hooks/useRefreshData';
import { EmptyState } from '@/components/ui/standardized';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DogCareStatus } from '@/types/dailyCare';
import DailyCareTab from '@/components/dashboard/tabs/DailyCareTab';

// Create a wrapped component to use the context safely
const DailyCareContent: React.FC = () => {
  const { fetchAllDogsWithCareStatus } = useDailyCare();
  const { currentDate } = useRefresh();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'feeding';

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

  const handleNavigateToDogs = () => {
    navigate('/dogs');
  };

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Daily Care Time Table
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Track feeding, medications and exercise for all your dogs
            {dogStatuses ? ` (${dogStatuses.length} dogs)` : ' (Loading...)'}
          </p>
        </div>
        <Button onClick={() => handleRefresh(true)} className="gap-2" disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh Now
        </Button>
      </div>

      {isLoading ? (
        <Card className="p-8">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </Card>
      ) : dogStatuses && dogStatuses.length > 0 ? (
        <DailyCareTab 
          onRefreshDogs={handleRefresh}
          currentDate={currentDate}
          dogStatuses={dogStatuses}
          initialCategory={initialCategory as string}
        />
      ) : (
        <Card className="p-8">
          <EmptyState
            icon={<Dog className="h-12 w-12 text-muted-foreground" />}
            title="No Dogs Found"
            description="Add dogs to your kennel to start tracking their daily care activities."
            action={{
              label: "Add Dogs",
              onClick: handleNavigateToDogs
            }}
          />
        </Card>
      )}
    </>
  );
};

// Main component that provides the context
const DailyCare: React.FC = () => {
  return (
    <MainLayout>
      <DailyCareProvider>
        <DailyCareContent />
      </DailyCareProvider>
    </MainLayout>
  );
};

export default DailyCare;
