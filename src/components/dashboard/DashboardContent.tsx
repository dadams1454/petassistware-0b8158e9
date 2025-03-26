
import React from 'react';
import { Tabs } from '@/components/ui/tabs';
import { DashboardData, UpcomingEvent, RecentActivity } from '@/services/dashboardService';
import TabsList from './tabs/TabsList';
import CareLogDialog from './dialogs/CareLogDialog';
import TabContent from './content/TabContent';
import { useDashboardState } from './hooks/useDashboardState';

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
  const {
    activeTab,
    careLogDialogOpen,
    setCareLogDialogOpen,
    selectedDogId,
    dogStatuses,
    isRefreshing,
    handleTabChange,
    handleDogSelected,
    handleCareLogSuccess,
    handleManualRefresh,
    handleErrorReset,
    currentDate
  } = useDashboardState();

  return (
    <>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
        <TabsList 
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onRefreshDogs={handleManualRefresh}
          isRefreshing={isRefreshing}
        />
        
        <TabContent 
          activeTab={activeTab}
          stats={stats}
          events={events}
          activities={activities}
          isLoading={isLoading}
          onRefreshDogs={handleManualRefresh}
          isRefreshing={isRefreshing}
          dogStatuses={dogStatuses}
          handleErrorReset={handleErrorReset}
          currentDate={currentDate}
        />
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
