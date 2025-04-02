
import React from 'react';
import { 
  DashboardContent, 
  DashboardOverview, 
  DashboardTabs 
} from '@/components/dashboard';
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
