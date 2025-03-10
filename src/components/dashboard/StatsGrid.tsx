
import React from 'react';
import StatCard from '@/components/dashboard/StatCard';
import { Dog, Users, PawPrint, DollarSign } from 'lucide-react';
import { DashboardStats } from '@/services/dashboardService';

interface StatsGridProps {
  stats?: DashboardStats;
  isLoading: boolean;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const StatsGrid: React.FC<StatsGridProps> = ({ stats, isLoading }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-6 mb-8">
      <StatCard
        title="Active Dogs"
        value={isLoading ? '—' : String(stats?.dogsCount || 0)}
        icon={<Dog size={18} />}
        isLoading={isLoading}
        change={8.5}
        changeText="vs last month"
        trend="up"
      />
      <StatCard
        title="Current Litters"
        value={isLoading ? '—' : String(stats?.littersCount || 0)}
        icon={<PawPrint size={18} />}
        isLoading={isLoading}
        change={0}
        changeText="same as last month"
        trend="neutral"
      />
      <StatCard
        title="Reservations"
        value={isLoading ? '—' : String(stats?.reservationsCount || 0)}
        icon={<Users size={18} />}
        isLoading={isLoading}
        change={33}
        changeText="vs last month"
        trend="up"
      />
      <StatCard
        title="Revenue (Last 30 Days)"
        value={isLoading ? '—' : formatCurrency(stats?.revenue || 0)}
        icon={<DollarSign size={18} />}
        isLoading={isLoading}
        change={12.3}
        changeText="vs previous period"
        trend="up"
        textColor="text-emerald-600 dark:text-emerald-400"
      />
    </div>
  );
};

export default StatsGrid;
