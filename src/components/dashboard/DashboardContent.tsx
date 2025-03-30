
import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import DashboardOverview from './DashboardOverview';
import { DashboardData, UpcomingEvent, RecentActivity } from '@/services/dashboardService';
import { useDailyCare } from '@/contexts/dailyCare';
import { useToast } from '@/components/ui/use-toast';
import TabsList from './tabs/TabsList';
import DailyCareTab from './tabs/DailyCareTab';
import DogLetOutTab from './tabs/DogLetOutTab';
import PuppiesTab from './tabs/PuppiesTab';
import FacilityTab from './tabs/FacilityTab';
import TrainingTab from './tabs/TrainingTab';
import { useRefresh } from '@/contexts/RefreshContext';
import { useRefreshData } from '@/hooks/useRefreshData';
import { LayoutDashboard, Calendar, Dog, Baby, GraduationCap, Building2, FileBarChart } from 'lucide-react';

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

  // Define tabs
  const tabs = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="h-4 w-4 mr-2" /> },
    { id: 'dailycare', label: 'Daily Care', icon: <Calendar className="h-4 w-4 mr-2" /> },
    { id: 'dogletout', label: 'Dog Let Out', icon: <Dog className="h-4 w-4 mr-2" /> },
    { id: 'puppies', label: 'Puppies', icon: <Baby className="h-4 w-4 mr-2" /> },
    { id: 'training', label: 'Training', icon: <GraduationCap className="h-4 w-4 mr-2" /> },
    { id: 'facility', label: 'Facility', icon: <Building2 className="h-4 w-4 mr-2" /> },
    { id: 'events', label: 'Events', icon: <Calendar className="h-4 w-4 mr-2" /> },
    { id: 'reports', label: 'Reports', icon: <FileBarChart className="h-4 w-4 mr-2" /> }
  ];

  return (
    <div>
      {/* Horizontal Tabs */}
      <div className="mb-6 border-b">
        <div className="flex overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 text-sm font-medium mr-2 rounded-t-md ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
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
