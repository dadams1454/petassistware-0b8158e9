
import React, { useState, useEffect } from 'react';
import MainLayout from '@/layouts/MainLayout';
import DogTimeTable from '@/components/dogs/components/care/table/DogTimeTable';
import { useDailyCare } from '@/contexts/dailyCare';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Dog, PlusCircle } from 'lucide-react';
import PottyBreakReminderCard from '@/components/dogs/components/care/potty/PottyBreakReminderCard';
import { useRefresh } from '@/contexts/RefreshContext';
import { useRefreshData } from '@/hooks/useRefreshData';
import { EmptyState } from '@/components/ui/standardized';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const DailyCare: React.FC = () => {
  const { fetchAllDogsWithCareStatus } = useDailyCare();
  const { currentDate } = useRefresh();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoadingDogs, setIsLoadingDogs] = useState(false);
  
  // Quick check to see if any dogs exist in the database
  const [dogsExist, setDogsExist] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkForDogs = async () => {
      try {
        const { count, error } = await supabase
          .from('dogs')
          .select('*', { count: 'exact', head: true });
          
        if (error) throw error;
        setDogsExist(count !== null && count > 0);
      } catch (error) {
        console.error('Error checking for dogs:', error);
        setDogsExist(false);
      }
    };
    
    checkForDogs();
  }, []);

  // Use the centralized refresh hook
  const { 
    data: dogStatuses, 
    isLoading, 
    refresh: handleRefresh,
    error
  } = useRefreshData({
    key: 'dogCare',
    fetchData: async () => {
      setIsLoadingDogs(true);
      try {
        return await fetchAllDogsWithCareStatus(currentDate, true);
      } finally {
        setIsLoadingDogs(false);
      }
    },
    dependencies: [currentDate],
    loadOnMount: true
  });

  const handleNavigateToDogs = () => {
    navigate('/dogs');
  };
  
  const handleCreateDog = () => {
    navigate('/dogs/new');
  };

  // If there's an error fetching dogs, show a toast
  useEffect(() => {
    if (error) {
      toast({
        title: 'Error Loading Data',
        description: 'There was a problem loading care data. Please try refreshing.',
        variant: 'destructive'
      });
    }
  }, [error, toast]);

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
        <div className="flex gap-2">
          {dogsExist === false && (
            <Button onClick={handleCreateDog} className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Dog
            </Button>
          )}
          <Button onClick={() => handleRefresh(true)} className="gap-2" disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh Now
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Card className="p-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </Card>
      ) : dogStatuses && dogStatuses.length > 0 ? (
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
            icon={<Dog className="h-12 w-12 text-muted-foreground" />}
            title={dogsExist === false ? "No Dogs Found" : "No Care Records"}
            description={
              dogsExist === false 
                ? "Add dogs to your kennel to start tracking their daily care activities."
                : "No care activities have been recorded for your dogs yet."
            }
            action={{
              label: dogsExist === false ? "Add Dogs" : "Refresh",
              onClick: dogsExist === false ? handleCreateDog : () => handleRefresh(true)
            }}
          />
        </Card>
      )}
    </>
  );

  return <MainLayout>{content}</MainLayout>;
};

export default DailyCare;
