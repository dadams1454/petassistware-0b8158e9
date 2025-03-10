
import React from 'react';
import { BarChart3 } from 'lucide-react';
import DashboardCard from '@/components/dashboard/DashboardCard';

const BreedingAnalytics: React.FC = () => {
  return (
    <DashboardCard
      title="Breeding Analytics"
      subtitle="Overview of your breeding program performance"
      icon={<BarChart3 size={18} />}
    >
      <div className="h-64 flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Breeding statistics and charts will appear here
        </p>
      </div>
    </DashboardCard>
  );
};

export default BreedingAnalytics;
