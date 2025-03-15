
import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { useDashboardData } from '@/components/dashboard/useDashboardData';

const Dashboard: React.FC = () => {
  const { isLoading, stats, events, activities } = useDashboardData();

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Welcome back! Here's an overview of your breeding program.
        </p>
      </div>

      <DashboardContent 
        isLoading={isLoading}
        stats={stats}
        events={events}
        activities={activities}
      />
    </MainLayout>
  );
};

export default Dashboard;
