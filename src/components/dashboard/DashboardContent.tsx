
import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import OverviewTab from './tabs/OverviewTab';
import DogLetOutTab from './tabs/DogLetOutTab';
import EventsTab from './tabs/EventsTab';
import ReportsTab from './tabs/ReportsTab';
import DailyCareTab from './tabs/DailyCareTab';
import TabsList from './tabs/TabsList';
import { useDailyCare } from '@/contexts/dailyCare';

// Define prop types
interface DashboardContentProps {
  isLoading: boolean;
  stats: any[];
  events: any[];
  activities: any[];
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  isLoading,
  stats,
  events,
  activities
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { fetchAllDogsWithCareStatus, dogStatuses } = useDailyCare();
  const [refreshingDogs, setRefreshingDogs] = useState(false);
  
  // Handle refreshing dogs data
  const handleRefreshDogs = async () => {
    try {
      setRefreshingDogs(true);
      await fetchAllDogsWithCareStatus(new Date(), true);
    } catch (error) {
      console.error('Error refreshing dogs:', error);
    } finally {
      setRefreshingDogs(false);
    }
  };
  
  return (
    <Tabs value={activeTab} className="space-y-4">
      <TabsList 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onRefreshDogs={handleRefreshDogs}
        isRefreshing={refreshingDogs}
      />
      
      <TabsContent value="overview" className="mt-6">
        <OverviewTab 
          stats={stats} 
          activities={activities} 
          events={events} 
          isLoading={isLoading} 
        />
      </TabsContent>
      
      <TabsContent value="dailycare" className="mt-6">
        <DailyCareTab 
          onRefreshDogs={handleRefreshDogs}
          dogStatuses={dogStatuses}
        />
      </TabsContent>
      
      <TabsContent value="dogletout" className="mt-6">
        <DogLetOutTab 
          onRefreshDogs={handleRefreshDogs}
          dogStatuses={dogStatuses}
        />
      </TabsContent>
      
      <TabsContent value="events" className="mt-6">
        <EventsTab events={events} isLoading={isLoading} />
      </TabsContent>
      
      <TabsContent value="reports" className="mt-6">
        <ReportsTab onRefresh={handleRefreshDogs} />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardContent;
