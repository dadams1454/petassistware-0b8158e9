
import React from 'react';
import PageContainer from '@/components/common/PageContainer';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { useDashboardData } from '@/components/dashboard/useDashboardData';
import { DailyCareProvider } from '@/contexts/dailyCare';
import { PageHeader, LoadingState, ErrorState } from '@/components/ui/standardized';

const Dashboard: React.FC = () => {
  // Use the hook to fetch all dashboard data - using the centralized refresh system
  const { isLoading, error, stats, events, activities, refresh } = useDashboardData();
  
  return (
    <PageContainer>
      <PageHeader 
        title="Dashboard"
        subtitle="Overview of your kennel operations and dog care"
      />
      
      <div className="grid grid-cols-1 gap-6">
        <DailyCareProvider>
          {isLoading ? (
            <LoadingState 
              message="Loading dashboard data..." 
              showSkeleton={true}
              skeletonCount={4}
              skeletonVariant="card"
            />
          ) : error ? (
            <ErrorState 
              title="Error Loading Dashboard" 
              message={typeof error === 'string' ? error : "There was a problem loading the dashboard data. Please try again."}
              onRetry={refresh}
            />
          ) : (
            <DashboardContent 
              isLoading={isLoading}
              stats={stats || []}
              events={events || []}
              activities={activities || []}
            />
          )}
        </DailyCareProvider>
      </div>
    </PageContainer>
  );
};

export default Dashboard;
