
import React from 'react';
import PageContainer from '@/components/common/PageContainer';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { useDashboardData } from '@/components/dashboard/useDashboardData';
import { DailyCareProvider } from '@/contexts/dailyCare';
import { PageHeader } from '@/components/ui/standardized';

const Dashboard: React.FC = () => {
  // Use the hook to fetch all dashboard data - using the centralized refresh system
  const { isLoading, error, stats, events, activities, refresh } = useDashboardData();
  
  return (
    <PageContainer>
      <div className="container mx-auto py-6 px-4">
        <PageHeader 
          title="Dashboard"
          subtitle="Overview of your kennel operations and dog care"
          className="mb-6"
        />
        
        <DailyCareProvider>
          <DashboardContent 
            isLoading={isLoading}
            stats={stats}
            events={events}
            activities={activities}
          />
        </DailyCareProvider>
      </div>
    </PageContainer>
  );
};

export default Dashboard;
