
import React from 'react';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import DashboardContent from '@/components/dashboard/DashboardContent';
import PageContainer from '@/components/common/PageContainer';
import { useDashboardData } from '@/components/dashboard/useDashboardData';

const Dashboard = () => {
  const { stats, events, activities, isLoading } = useDashboardData();
  
  return (
    <PageContainer>
      <div className="container mx-auto py-6 space-y-6">
        <DashboardOverview 
          data={stats}
          isLoading={isLoading}
        />
        <DashboardTabs />
        <DashboardContent 
          stats={stats}
          events={events}
          activities={activities}
          isLoading={isLoading}
        />
      </div>
    </PageContainer>
  );
};

export default Dashboard;
