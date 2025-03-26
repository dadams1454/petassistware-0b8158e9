
import React, { useState, useRef } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import DashboardOverview from './DashboardOverview';
import { DashboardData, UpcomingEvent, RecentActivity } from '@/services/dashboardService';
import { useDailyCare } from '@/contexts/dailyCare';
import { useToast } from '@/hooks/use-toast';
import TabsList from './tabs/TabsList';
import DailyCareTab from './tabs/DailyCareTab';
import GroomingTab from './tabs/GroomingTab';
import CareLogDialog from './dialogs/CareLogDialog';
import { useRefresh } from '@/contexts/RefreshContext';
import { useRefreshData } from '@/hooks/useRefreshData';
import ErrorBoundary from '@/components/ErrorBoundary';
import { AlertTriangle } from 'lucide-react';

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

  const handleErrorReset = () => {
    console.log('Resetting tab after error');
    handleRefreshDogs(true);
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
          <ErrorBoundary 
            name="DashboardOverview" 
            onReset={handleErrorReset}
            fallback={
              <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800 my-4">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  <h3 className="font-semibold">Error in Dashboard Overview</h3>
                </div>
                <p className="text-sm mb-2">There was a problem loading the dashboard overview.</p>
                <button 
                  onClick={handleErrorReset}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200"
                >
                  Try Again
                </button>
              </div>
            }
          >
            <DashboardOverview 
              data={stats}
              isLoading={isLoading}
              onCareLogClick={handleCareLogClick}
            />
          </ErrorBoundary>
        </TabsContent>
        
        <TabsContent value="dailycare">
          <ErrorBoundary 
            name="DailyCareTab" 
            onReset={handleErrorReset}
            fallback={
              <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800 my-4">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  <h3 className="font-semibold">Error in Daily Care Tab</h3>
                </div>
                <p className="text-sm mb-2">There was a problem loading the daily care information.</p>
                <button 
                  onClick={handleErrorReset}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200"
                >
                  Try Again
                </button>
              </div>
            }
          >
            <DailyCareTab 
              onRefreshDogs={handleManualRefresh} 
              isRefreshing={isRefreshing}
              currentDate={currentDate}
            />
          </ErrorBoundary>
        </TabsContent>
        
        <TabsContent value="grooming">
          <ErrorBoundary 
            name="GroomingTab" 
            onReset={handleErrorReset}
            fallback={
              <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800 my-4">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  <h3 className="font-semibold">Error in Grooming Tab</h3>
                </div>
                <p className="text-sm mb-2">There was a problem loading the grooming information.</p>
                <button 
                  onClick={handleErrorReset}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200"
                >
                  Try Again
                </button>
              </div>
            }
          >
            <GroomingTab 
              dogStatuses={dogStatuses || []} 
              onRefreshDogs={handleManualRefresh}
            />
          </ErrorBoundary>
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
