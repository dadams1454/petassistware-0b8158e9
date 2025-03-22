
import React from 'react';
import PageContainer from '@/components/common/PageContainer';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { useDashboardData } from '@/components/dashboard/useDashboardData';

const Dashboard: React.FC = () => {
  // Use the hook to fetch all dashboard data
  const { isLoading, stats, events, activities } = useDashboardData();
  
  return (
    <PageContainer>
      <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6">
        <DashboardContent 
          isLoading={isLoading}
          stats={stats}
          events={events}
          activities={activities}
        />
      </div>
    </PageContainer>
  );
};

export default Dashboard;
