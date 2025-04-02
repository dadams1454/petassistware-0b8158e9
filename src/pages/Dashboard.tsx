
import React from 'react';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import DashboardContent from '@/components/dashboard/DashboardContent';
import PageContainer from '@/components/common/PageContainer';

const Dashboard = () => {
  return (
    <PageContainer>
      <div className="container mx-auto py-6 space-y-6">
        <DashboardOverview />
        <DashboardTabs />
        <DashboardContent />
      </div>
    </PageContainer>
  );
};

export default Dashboard;
