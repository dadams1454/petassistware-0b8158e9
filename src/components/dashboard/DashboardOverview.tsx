import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardData } from '@/services/dashboardService';
import StatCard from './StatCard';
import { useAuth } from '@/contexts/AuthProvider';
import GenerateTestDataButton from './GenerateTestDataButton';

interface DashboardOverviewProps {
  data: DashboardData;
  isLoading: boolean;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ data, isLoading }) => {
  const { user } = useAuth();
  
  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Overview</CardTitle>
        {user && <GenerateTestDataButton />}
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
      </CardContent>
    </Card>
  );
};

export default DashboardOverview;
