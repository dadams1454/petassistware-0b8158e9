
import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import CareDashboard from '@/components/dogs/components/care/CareDashboard';
import { useDailyCare } from '@/contexts/dailyCare';

const DailyCare: React.FC = () => {
  const { loading, dogStatuses } = useDailyCare();

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Daily Care
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Track and log daily care activities for all your dogs
          {dogStatuses ? ` (${dogStatuses.length} dogs)` : ''}
        </p>
      </div>

      <CareDashboard />
    </MainLayout>
  );
};

export default DailyCare;
