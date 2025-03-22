
import React, { useState } from 'react';
import PageContainer from '@/components/common/PageContainer';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { useDashboardData } from '@/components/dashboard/useDashboardData';
import { useAutoRefresh } from '@/hooks/useAutoRefresh';

const Dashboard: React.FC = () => {
  // Use the hook for initial data fetching
  const { isLoading: initialLoading, stats, events, activities } = useDashboardData();
  
  // Store the data in state so we can update it with the auto-refresh
  const [dashboardStats, setDashboardStats] = useState(stats);
  const [dashboardEvents, setDashboardEvents] = useState(events);
  const [dashboardActivities, setDashboardActivities] = useState(activities);
  
  // Add auto-refresh functionality
  const { isRefreshing, handleRefresh, formatTimeRemaining } = useAutoRefresh({
    interval: 15 * 60 * 1000, // 15 minutes
    refreshLabel: 'dashboard data',
    refreshOnMount: false, // Don't refresh on mount since we already fetch data via useDashboardData
    onRefresh: async () => {
      console.log('🔄 Auto-refresh triggered in Dashboard');
      const { stats: newStats, events: newEvents, activities: newActivities } = await useDashboardData().refetchData();
      
      // Update the state with new data
      setDashboardStats(newStats);
      setDashboardEvents(newEvents);
      setDashboardActivities(newActivities);
      
      console.log('✅ Dashboard data refreshed');
      return { stats: newStats, events: newEvents, activities: newActivities };
    }
  });
  
  // Combine loading states
  const isLoading = initialLoading || isRefreshing;
  
  return (
    <PageContainer>
      <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6">
        <DashboardContent 
          isLoading={isLoading}
          stats={dashboardStats || stats}
          events={dashboardEvents || events}
          activities={dashboardActivities || activities}
          onRefresh={() => handleRefresh(true)}
          nextRefreshTime={formatTimeRemaining()}
        />
      </div>
    </PageContainer>
  );
};

export default Dashboard;
