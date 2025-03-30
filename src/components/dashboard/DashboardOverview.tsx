
import React from 'react';
import { DashboardData } from '@/services/dashboardService';
import StatCard from './StatCard';
import { useAuth } from '@/contexts/AuthProvider';
import GenerateTestDataButton from './GenerateTestDataButton';

interface DashboardOverviewProps {
  data: DashboardData;
  isLoading: boolean;
  onCareLogClick?: () => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ data, isLoading, onCareLogClick }) => {
  const { user } = useAuth();
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Overview</h2>
        {user && <GenerateTestDataButton />}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Dogs"
          value={data.totalDogs}
          isLoading={isLoading}
        />
        <StatCard
          title="Active Dogs"
          value={data.activeDogs}
          isLoading={isLoading}
        />
        <StatCard
          title="Total Litters"
          value={data.totalLitters}
          isLoading={isLoading}
        />
        <StatCard
          title="Active Litters"
          value={data.activeLitters}
          isLoading={isLoading}
        />
        <StatCard
          title="Total Puppies"
          value={data.totalPuppies}
          isLoading={isLoading}
        />
        <StatCard
          title="Available Puppies"
          value={data.availablePuppies}
          isLoading={isLoading}
        />
        <StatCard
          title="Total Customers"
          value={data.totalCustomers}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default DashboardOverview;
