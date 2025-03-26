
import React from 'react';
import PageContainer from '@/components/common/PageContainer';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { useDashboardData } from '@/components/dashboard/useDashboardData';
import { DailyCareProvider } from '@/contexts/dailyCare';
import { PageHeader, LoadingState, ErrorState } from '@/components/ui/standardized';
import ErrorBoundary from '@/components/ErrorBoundary';

const Dashboard: React.FC = () => {
  // Use the hook to fetch all dashboard data - using the centralized refresh system
  const { isLoading, error, stats, events, activities } = useDashboardData();
  
  // Handle retry function
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <PageContainer>
      <PageHeader 
        title="Dashboard"
        subtitle="Overview of your kennel operations and dog care"
      />
      
      <div className="grid grid-cols-1 gap-6">
        <ErrorBoundary 
          name="DashboardMain"
          onReset={handleRetry}
          fallback={
            <ErrorState 
              title="Dashboard Error" 
              message="There was a problem loading the dashboard. Please try again." 
              onRetry={handleRetry}
            />
          }
        >
          <DailyCareProvider>
            {error ? (
              <ErrorState 
                title="Unable to load dashboard data" 
                message={error instanceof Error ? error.message : "An unknown error occurred"} 
                onRetry={handleRetry}
              />
            ) : isLoading ? (
              <LoadingState message="Loading dashboard data..." />
            ) : (
              <DashboardContent 
                isLoading={isLoading}
                stats={stats}
                events={events}
                activities={activities}
              />
            )}
          </DailyCareProvider>
        </ErrorBoundary>
      </div>
    </PageContainer>
  );
};

export default Dashboard;
