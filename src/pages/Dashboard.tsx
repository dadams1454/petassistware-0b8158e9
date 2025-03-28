
import React from 'react';
import PageContainer from '@/components/common/PageContainer';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { useDashboardData } from '@/components/dashboard/useDashboardData';
import { DailyCareProvider } from '@/contexts/dailyCare';
import { PageHeader, LoadingState, ErrorState } from '@/components/ui/standardized';
import { Users, BarChart, DollarSign, UserRound } from 'lucide-react';

const Dashboard: React.FC = () => {
  // Use the hook to fetch all dashboard data - using the centralized refresh system
  const { isLoading, error, stats, events, activities, refresh } = useDashboardData();
  
  // Convert stats object to array format expected by DashboardContent
  const statsArray = stats ? [
    {
      title: 'Dogs',
      value: String(stats.activeDogs),
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      description: 'Active dogs in your kennel'
    },
    {
      title: 'Litters',
      value: String(stats.activeLitters),
      icon: <BarChart className="h-4 w-4 text-muted-foreground" />,
      description: 'Current litters'
    },
    {
      title: 'Puppies',
      value: String(stats.availablePuppies),
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
      description: 'Available puppies'
    },
    {
      title: 'Customers',
      value: String(stats.totalCustomers),
      icon: <UserRound className="h-4 w-4 text-muted-foreground" />,
      description: 'Total customers'
    }
  ] : [];
  
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
              stats={statsArray}
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
