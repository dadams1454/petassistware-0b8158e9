
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import PageContainer from '@/components/common/PageContainer';
import DashboardContent from '@/components/dashboard/DashboardContent';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import UpcomingEvents from '@/components/dashboard/UpcomingEvents';
import RecentActivities from '@/components/dashboard/RecentActivities';
import QuickActions from '@/components/dashboard/QuickActions';
import { fetchDashboardData } from '@/services/dashboardService';

const Dashboard: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: () => fetchDashboardData(),
  });

  const content = (
    <>
      <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6">
        <DashboardOverview 
          isLoading={isLoading}
          dogCount={data?.stats.dogCount || 0}
          puppyCount={data?.stats.puppyCount || 0}
          litterCount={data?.stats.litterCount || 0}
          customerCount={data?.stats.customerCount || 0}
        />

        <DashboardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <QuickActions />
              <RecentActivities 
                isLoading={isLoading}
                activities={data?.recentActivities || []}
              />
            </div>
            <div>
              <UpcomingEvents 
                isLoading={isLoading}
                events={data?.upcomingEvents || []}
              />
            </div>
          </div>
        </DashboardContent>
      </div>
    </>
  );

  return <PageContainer>{content}</PageContainer>;
};

export default Dashboard;
