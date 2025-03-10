
import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import { useDashboard } from '@/hooks/useDashboard';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import QuickActions from '@/components/dashboard/QuickActions';
import StatsGrid from '@/components/dashboard/StatsGrid';
import MainContent from '@/components/dashboard/MainContent';
import BreedingAnalytics from '@/components/dashboard/BreedingAnalytics';

const Dashboard: React.FC = () => {
  const { 
    stats, 
    events, 
    activities, 
    isStatsLoading, 
    isEventsLoading, 
    isActivitiesLoading 
  } = useDashboard();

  return (
    <MainLayout>
      <DashboardHeader 
        title="Dashboard" 
        subtitle="Welcome back! Here's an overview of your breeding program."
      />

      <QuickActions />
      
      <StatsGrid stats={stats} isLoading={isStatsLoading} />
      
      <MainContent 
        events={events}
        activities={activities}
        isEventsLoading={isEventsLoading}
        isActivitiesLoading={isActivitiesLoading}
      />
      
      <BreedingAnalytics />
    </MainLayout>
  );
};

export default Dashboard;
