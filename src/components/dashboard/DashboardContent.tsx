
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardOverview from './DashboardOverview';
import { DashboardStats, UpcomingEvent, RecentActivity } from '@/services/dashboardService';
import { useDailyCare } from '@/contexts/dailyCare';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import DailyCareTab from './tabs/DailyCareTab';
import CareLogDialog from './dialogs/CareLogDialog';

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
  const { fetchAllDogsWithCareStatus } = useDailyCare();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Force fetch all dogs on component mount
  useEffect(() => {
    console.log('🚀 DashboardContent mounted - fetching all dogs');
    fetchAllDogsWithCareStatus(new Date(), true)
      .then(dogs => {
        console.log(`✅ DashboardContent: Fetched ${dogs.length} dogs successfully`);
        if (dogs.length === 0) {
          console.warn('⚠️ No dogs were returned from the API');
        }
      })
      .catch(error => {
        console.error('❌ Error fetching dogs in DashboardContent:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dogs. Please try refreshing the page.',
          variant: 'destructive',
        });
      });
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
