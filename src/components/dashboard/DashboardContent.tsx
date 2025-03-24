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
import { useRefreshData } from '@/hooks/useRefreshData';

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
  const { fetchAllDogsWithCareStatus } = useDailyCare();
  const { toast } = useToast();
  const pendingRefreshRef = useRef(false);

  // Use the centralized refresh context
  const { 
    formatTimeRemaining,
    currentDate
  } = useRefresh();
  
  // Use the refresh data hook for dogs
  const { 
    data: dogStatuses, 
    isLoading: isRefreshing, 
    refresh: handleRefreshDogs 
  } = useRefreshData({
    key: 'allDogs',
    fetchData: async () => {
      return await fetchAllDogsWithCareStatus(currentDate, true);
    },
    dependencies: [currentDate],
    loadOnMount: true
  });

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
    handleRefreshDogs(false);
  };

  return (
    <>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
        <TabsList 
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onRefreshDogs={handleManualRefresh}
          isRefreshing={isRefreshing}
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
            dogStatuses={dogStatuses || []} 
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
