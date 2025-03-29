
import React, { useState, useRef, useEffect } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import DashboardOverview from './DashboardOverview';
import { DashboardData, UpcomingEvent, RecentActivity } from '@/services/dashboardService';
import { useDailyCare } from '@/contexts/dailyCare';
import { useToast } from '@/components/ui/use-toast';
import TabsList from './tabs/TabsList';
import DailyCareTab from './tabs/DailyCareTab';
import DogLetOutTab from './tabs/DogLetOutTab';
import CareLogDialog from './dialogs/CareLogDialog';
import { useRefresh } from '@/contexts/RefreshContext';
import { useRefreshData } from '@/hooks/useRefreshData';

interface DashboardContentProps {
  isLoading: boolean;
  stats: DashboardData;
  events: UpcomingEvent[];
  activities: RecentActivity[];
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  isLoading,
  stats,
  events,
  activities,
}) => {
  const [activeTab, setActiveTab] = useState('overview'); // Default to overview tab
  const [careLogDialogOpen, setCareLogDialogOpen] = useState(false);
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);
  const { fetchAllDogsWithCareStatus } = useDailyCare();
  const { toast } = useToast();
  const pendingRefreshRef = useRef(false);
  const initialMount = useRef(true);

  // Use the centralized refresh context
  const { 
    formatTimeRemaining,
    currentDate
  } = useRefresh();
  
  // Use the refresh data hook for dogs
  const { 
    data: dogStatuses, 
    isLoading: isRefreshing, 
    refresh: handleRefreshDogs,
    error: dogsError
  } = useRefreshData({
    key: 'allDogs',
    fetchData: async () => {
      return await fetchAllDogsWithCareStatus(currentDate, true);
    },
    dependencies: [currentDate],
    loadOnMount: true
  });

  // Handle initial mount with controlled animation delay
  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
    }
  }, []);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // If we have a pending refresh and tab changes, refresh the data
    if (pendingRefreshRef.current) {
      setTimeout(() => {
        handleRefreshDogs(false);
        pendingRefreshRef.current = false;
      }, 100);
    }
  };

  const handleCareLogClick = () => {
    setCareLogDialogOpen(true);
  };

  const handleCareLogSuccess = () => {
    setCareLogDialogOpen(false);
    setSelectedDogId(null);
    
    // Instead of immediate refresh, set a flag for next tab change or use debounce
    pendingRefreshRef.current = true;
    
    // Schedule a delayed silent refresh to catch changes
    setTimeout(() => {
      handleRefreshDogs(false);
      pendingRefreshRef.current = false;
    }, 1000);
  };

  const handleDogSelected = (dogId: string) => {
    setSelectedDogId(dogId);
  };
  
  // Handler for manual refresh with UI feedback
  const handleManualRefresh = () => {
    // Show toast for feedback
    toast({
      title: 'Refreshing data...',
      description: 'Updating the latest dog care information',
      duration: 2000,
    });
    
    // Use the refresh function from the hook
    handleRefreshDogs(true);
  };

  return (
    <div className={`transition-opacity duration-300 ${initialMount.current ? 'opacity-0' : 'opacity-100'}`}>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
        <TabsList 
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onRefreshDogs={handleManualRefresh}
          isRefreshing={isRefreshing}
        />
        
        <TabsContent value="overview">
          <DashboardOverview 
            data={stats}
            isLoading={isLoading}
            onCareLogClick={handleCareLogClick}
          />
        </TabsContent>
        
        <TabsContent value="dailycare">
          <DailyCareTab 
            dogId=""
            dogName="All Dogs"
          />
        </TabsContent>
        
        <TabsContent value="dogletout">
          <DogLetOutTab 
            onRefreshDogs={handleManualRefresh}
            dogStatuses={dogStatuses || []}
          />
        </TabsContent>
        
        <TabsContent value="events">
          <div className="text-center p-12 border rounded-md">
            <h3 className="text-xl font-medium mb-2">Events Feature Coming Soon</h3>
            <p className="text-muted-foreground">
              This section will show upcoming events and allow event management.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="reports">
          <div className="text-center p-12 border rounded-md">
            <h3 className="text-xl font-medium mb-2">Reports Feature Coming Soon</h3>
            <p className="text-muted-foreground">
              This section will provide reports on dog care activities and other metrics.
            </p>
          </div>
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
    </div>
  );
};

export default DashboardContent;
