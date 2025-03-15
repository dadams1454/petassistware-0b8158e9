
import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import { DailyCareProvider } from '@/contexts/DailyCareProvider';
import CareDashboard from '@/components/dogs/components/care/CareDashboard';

const DailyCare: React.FC = () => {
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Daily Care
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Track and log daily care activities for all your dogs.
        </p>
      </div>

      <DailyCareProvider>
        <CareDashboard />
      </DailyCareProvider>
    </MainLayout>
  );
};

export default DailyCare;
