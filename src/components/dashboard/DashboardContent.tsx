
import React, { useState, useRef } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import DashboardOverview from './DashboardOverview';
import { DashboardStats, UpcomingEvent, RecentActivity } from '@/services/dashboardService';
import { useDailyCare } from '@/contexts/dailyCare';
import { useToast } from '@/components/ui/use-toast';
import TabsList from './tabs/TabsList';
import DailyCareTab from './tabs/DailyCareTab';
import GroomingTab from './tabs/GroomingTab';
import CareLogDialog from './dialogs/CareLogDialog';
import { useRefresh } from '@/contexts/RefreshContext';

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
  const [activeTab, setActiveTab] = useState('overview'); // Default to overview tab
  const [careLogDialogOpen, setCareLogDialogOpen] = useState(false);
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);
  const { fetchAllDogsWithCareStatus, dogStatuses } = useDailyCare();
  const { toast } = useToast();
  const pendingRefreshRef = useRef(false);

  // Use the centralized refresh context
  const { 
    isRefreshing, 
    refreshSpecific,
    formatTimeRemaining,
    currentDate
  } = useRefresh();

  // Register dog refresh callback with the RefreshContext
  React.useEffect(() => {
    const refreshAllDogs = async () => {
      console.log('🔄 Auto-refresh triggered in DashboardContent');
      const dogs = await fetchAllDogsWithCareStatus(new Date(), true);
      console.log(`✅ Auto-refreshed: Loaded ${dogs.length} dogs`);
      return dogs;
    };
    
    // Register the callback with the RefreshContext
    refreshSpecific('allDogs', refreshAllDogs, false);
  }, [fetchAllDogsWithCareStatus, refreshSpecific]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // If we have a pending refresh and tab changes, refresh the data
    if (pendingRefreshRef.current) {
      setTimeout(() => {
        refreshSpecific('allDogs', async () => {
          return await fetchAllDogsWithCareStatus(new Date(), true);
        }, false);
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
      refreshSpecific('allDogs', async () => {
        return await fetchAllDogsWithCareStatus(new Date(), true);
      }, false);
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
    
    // Use the centralized refresh
    refreshSpecific('allDogs', async () => {
      return await fetchAllDogsWithCareStatus(new Date(), true);
    }, false);
  };

  return (
    <>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
        <TabsList 
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onRefreshDogs={handleManualRefresh}
          isRefreshing={isRefreshing}
          nextRefreshTime={formatTimeRemaining()}
        />
        
        <TabsContent value="overview">
          <DashboardOverview 
            isLoading={isLoading}
            stats={stats}
            events={events}
            activities={activities}
            onCareLogClick={handleCareLogClick}
          />
        </TabsContent>
        
        <TabsContent value="dailycare">
          <DailyCareTab 
            onRefreshDogs={handleManualRefresh} 
            isRefreshing={isRefreshing}
            currentDate={currentDate}
          />
        </TabsContent>
        
        <TabsContent value="grooming">
          <GroomingTab 
            dogStatuses={dogStatuses} 
            onRefreshDogs={handleManualRefresh}
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
