
import React, { useState } from 'react';
import DashboardOverview from './DashboardOverview';
import { DashboardData, UpcomingEvent, RecentActivity } from '@/services/dashboardService';
import { useDailyCare } from '@/contexts/dailyCare';
import { useToast } from '@/components/ui/use-toast';
import { useRefresh } from '@/contexts/RefreshContext';
import { useRefreshData } from '@/hooks/useRefreshData';
import { Button } from '@/components/ui/button';
import TabsList from './tabs/TabsList';
import DailyCareTab from './tabs/DailyCareTab';
import DogLetOutTab from './tabs/DogLetOutTab';
import PuppiesTab from './tabs/PuppiesTab';
import TrainingTab from './tabs/TrainingTab';
import FacilityTab from './tabs/FacilityTab';
import KennelTab from './tabs/KennelTab';

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
  const [activeTab, setActiveTab] = useState('overview');
  const { fetchAllDogsWithCareStatus } = useDailyCare();
  const { toast } = useToast();

  // Use the centralized refresh context
  const { currentDate } = useRefresh();
  
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

  // Handler for manual refresh with UI feedback
  const handleManualRefresh = () => {
    toast({
      title: 'Refreshing data...',
      description: 'Updating the latest dog care information',
      duration: 2000,
    });
    
    handleRefreshDogs(true);
  };

  return (
    <div className="w-full">
      {/* Use the TabsList component for consistent tab styling */}
      <TabsList 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onRefreshDogs={handleManualRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <DashboardOverview 
            data={stats}
            isLoading={isLoading}
          />
        )}
        
        {activeTab === 'dailycare' && (
          <DailyCareTab 
            dogId=""
            dogName="All Dogs"
          />
        )}
        
        {activeTab === 'dogletout' && (
          <DogLetOutTab 
            onRefreshDogs={handleManualRefresh}
            dogStatuses={dogStatuses || []}
          />
        )}
        
        {activeTab === 'puppies' && (
          <PuppiesTab 
            onRefresh={handleManualRefresh}
          />
        )}
        
        {activeTab === 'training' && (
          <TrainingTab 
            onRefresh={handleManualRefresh}
          />
        )}
        
        {activeTab === 'facility' && (
          <FacilityTab 
            onRefreshData={handleManualRefresh}
            dogStatuses={dogStatuses || []}
          />
        )}
        
        {activeTab === 'kennels' && (
          <KennelTab 
            onRefreshData={handleManualRefresh}
          />
        )}
        
        {activeTab === 'events' && (
          <div className="text-center p-12 border rounded-md">
            <h3 className="text-xl font-medium mb-2">Events Feature Coming Soon</h3>
            <p className="text-muted-foreground">
              This section will show upcoming events and allow event management.
            </p>
          </div>
        )}
        
        {activeTab === 'reports' && (
          <div className="text-center p-12 border rounded-md">
            <h3 className="text-xl font-medium mb-2">Reports Feature Coming Soon</h3>
            <p className="text-muted-foreground">
              This section will provide reports on dog care activities and other metrics.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardContent;
