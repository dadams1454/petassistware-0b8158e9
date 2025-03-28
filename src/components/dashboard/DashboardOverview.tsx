
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Overview</CardTitle>
        {user && <GenerateTestDataButton />}
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          stat={{
            title: "Total Dogs",
            value: data.totalDogs,
          }}
          isLoading={isLoading}
        />
        <StatCard
          stat={{
            title: "Active Dogs",
            value: data.activeDogs,
          }}
          isLoading={isLoading}
        />
        <StatCard
          stat={{
            title: "Total Litters",
            value: data.totalLitters,
          }}
          isLoading={isLoading}
        />
        <StatCard
          stat={{
            title: "Active Litters",
            value: data.activeLitters,
          }}
          isLoading={isLoading}
        />
        <StatCard
          stat={{
            title: "Total Puppies",
            value: data.totalPuppies,
          }}
          isLoading={isLoading}
        />
        <StatCard
          stat={{
            title: "Available Puppies",
            value: data.availablePuppies,
          }}
          isLoading={isLoading}
        />
         <StatCard
          stat={{
            title: "Total Customers",
            value: data.totalCustomers,
          }}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
};

export default DashboardOverview;
