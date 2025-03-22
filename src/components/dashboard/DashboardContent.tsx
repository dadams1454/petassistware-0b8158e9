
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
import { useAutoRefresh } from '@/hooks/useAutoRefresh';

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

  // Set up auto-refresh with our enhanced hook
  const { 
    isRefreshing, 
    handleRefresh: refreshDogs,
    formatTimeRemaining,
    currentDate
  } = useAutoRefresh({
    interval: 15 * 60 * 1000, // 15 minutes
    refreshLabel: 'dog data',
    midnightReset: true,
    onRefresh: async () => {
      console.log('🔄 Auto-refresh triggered in DashboardContent');
      const dogs = await fetchAllDogsWithCareStatus(new Date(), true);
      console.log(`✅ Auto-refreshed: Loaded ${dogs.length} dogs`);
      return dogs;
    }
  });

  const handleCareLogClick = () => {
    setCareLogDialogOpen(true);
  };

  const handleCareLogSuccess = () => {
    setCareLogDialogOpen(false);
    setSelectedDogId(null);
    // Refresh dog statuses
    refreshDogs(true);
  };

  const handleDogSelected = (dogId: string) => {
    setSelectedDogId(dogId);
  };

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onRefreshDogs={() => refreshDogs(true)}
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
            onRefreshDogs={() => refreshDogs(true)} 
            isRefreshing={isRefreshing}
            currentDate={currentDate}
          />
        </TabsContent>
        
        <TabsContent value="grooming">
          <GroomingTab 
            dogStatuses={dogStatuses} 
            onRefreshDogs={() => refreshDogs(true)} 
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
