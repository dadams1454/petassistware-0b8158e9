import React, { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardOverview from './DashboardOverview';
import { DashboardStats, UpcomingEvent, RecentActivity } from '@/services/dashboardService';
import { useDailyCare } from '@/contexts/dailyCare';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import DailyCareTab from './tabs/DailyCareTab';
import CareLogDialog from './dialogs/CareLogDialog';
import GroomingSchedule from '@/components/dogs/components/care/table/GroomingSchedule';
import ExerciseLog from '@/components/dogs/components/care/exercise/ExerciseLog';

interface DashboardContentProps {
  isLoading: boolean;
  stats: DashboardStats;
  events: UpcomingEvent[];
  activities: RecentActivity[];
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  isLoading,
  stats,
  events,
  activities,
}) => {
  const [activeTab, setActiveTab] = useState('care'); // Default to care tab
  const [careLogDialogOpen, setCareLogDialogOpen] = useState(false);
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);
  const { fetchAllDogsWithCareStatus, dogStatuses } = useDailyCare();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const initialFetchCompleted = useRef(false);

  // Force fetch all dogs on component mount, but only once
  useEffect(() => {
    if (!initialFetchCompleted.current) {
      console.log('🚀 DashboardContent mounted - initial dogs fetch');
      
      fetchAllDogsWithCareStatus(new Date(), true)
        .then(dogs => {
          console.log(`✅ Initial fetch: Loaded ${dogs.length} dogs`);
          initialFetchCompleted.current = true;
        })
        .catch(error => {
          console.error('❌ Error fetching dogs in DashboardContent:', error);
          toast({
            title: 'Error',
            description: 'Failed to load dogs. Please try refreshing the page.',
            variant: 'destructive',
          });
        });
    }
  }, [fetchAllDogsWithCareStatus, toast]);

  // Handler for manually refreshing the dog list
  const handleRefreshDogs = () => {
    console.log('🔄 Manual refresh triggered in DashboardContent');
    setIsRefreshing(true);
    fetchAllDogsWithCareStatus(new Date(), true)
      .then(dogs => {
        console.log(`✅ Manually refreshed: ${dogs.length} dogs loaded`);
        toast({
          title: 'Refresh Complete',
          description: `Successfully loaded ${dogs.length} dogs.`,
        });
      })
      .catch(error => {
        console.error('❌ Error during manual refresh:', error);
        toast({
          title: 'Error',
          description: 'Failed to refresh dogs. Please try again.',
          variant: 'destructive',
        });
      })
      .finally(() => {
        setIsRefreshing(false);
      });
  };

  const handleCareLogClick = () => {
    setCareLogDialogOpen(true);
  };

  const handleCareLogSuccess = () => {
    setCareLogDialogOpen(false);
    setSelectedDogId(null);
    // Refresh dog statuses
    fetchAllDogsWithCareStatus(new Date(), true);
  };

  const handleDogSelected = (dogId: string) => {
    setSelectedDogId(dogId);
  };

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="care">Daily Care</TabsTrigger>
            <TabsTrigger value="exercise">Exercise Log</TabsTrigger>
            <TabsTrigger value="grooming">Grooming</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>
          
          <Button 
            onClick={handleRefreshDogs} 
            disabled={isRefreshing}
            variant="outline"
            size="sm"
            className="gap-1"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            {isRefreshing ? 'Refreshing...' : 'Refresh Dogs'}
          </Button>
        </div>
        
        <TabsContent value="care">
          <DailyCareTab 
            onRefreshDogs={handleRefreshDogs} 
            isRefreshing={isRefreshing} 
          />
        </TabsContent>
        
        <TabsContent value="exercise">
          {dogStatuses && dogStatuses.length > 0 ? (
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg border border-indigo-200 dark:border-indigo-800 mb-4">
              <h3 className="text-lg font-medium text-indigo-800 dark:text-indigo-300">Daily Exercise Tracking</h3>
              <p className="text-sm text-indigo-600 dark:text-indigo-400">
                Monitor and log exercise activities for all dogs throughout the day.
              </p>
            </div>
          ) : null}
          {dogStatuses && dogStatuses.length > 0 ? (
            <ExerciseLog
              dogs={dogStatuses}
              onRefresh={handleRefreshDogs}
            />
          ) : (
            <div className="p-8 text-center border rounded-lg">
              <p className="text-muted-foreground">No dogs found. Please refresh or add dogs to the system.</p>
              <Button onClick={handleRefreshDogs} className="mt-4">Refresh Dogs</Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="grooming">
          <div className="mb-4 bg-pink-50 dark:bg-pink-900/20 p-3 rounded-lg border border-pink-200 dark:border-pink-800">
            <h3 className="text-lg font-medium text-pink-800 dark:text-pink-300">Monthly Grooming Schedule</h3>
            <p className="text-sm text-pink-600 dark:text-pink-400">
              Track and schedule grooming activities for all dogs throughout the month.
            </p>
          </div>
          {dogStatuses && dogStatuses.length > 0 ? (
            <GroomingSchedule dogs={dogStatuses} onRefresh={handleRefreshDogs} />
          ) : (
            <div className="p-8 text-center border rounded-lg">
              <p className="text-muted-foreground">No dogs found. Please refresh or add dogs to the system.</p>
              <Button onClick={handleRefreshDogs} className="mt-4">Refresh Dogs</Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="overview">
          <DashboardOverview 
            isLoading={isLoading}
            stats={stats}
            events={events}
            activities={activities}
            onCareLogClick={handleCareLogClick}
          />
        </TabsContent>
      </Tabs>

      {/* Daily Care Log Dialog */}
      <CareLogDialog 
        open={careLogDialogOpen}
        onOpenChange={setCareLogDialogOpen}
        selectedDogId={selectedDogId}
        onDogSelected={handleDogSelected}
        onSuccess={handleCareLogSuccess}
      />
    </>
  );
};

export default DashboardContent;
