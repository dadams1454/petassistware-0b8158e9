
import React from 'react';
import { DashboardData } from '@/services/dashboard/types';
import StatCard from './StatCard';

interface DashboardOverviewProps {
  data: DashboardData;
  isLoading: boolean;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ data, isLoading }) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
