
import React, { useEffect } from 'react';
import MainLayout from '@/layouts/MainLayout';
import CareDashboard from '@/components/dogs/components/care/CareDashboard';
import { useDailyCare } from '@/contexts/dailyCare';

const DailyCare: React.FC = () => {
  const { loading, dogStatuses, fetchAllDogsWithCareStatus } = useDailyCare();

  // Add debugging effect to check when this component loads and what data it receives
  useEffect(() => {
    console.log('🔍 DailyCare page mounted');
    console.log('🐕 Initial dogStatuses:', dogStatuses?.length || 0);
    
    // Force a fetch on component mount to ensure we have data
    fetchAllDogsWithCareStatus(new Date(), true)
      .then(dogs => {
        console.log('🐕 Fetched dogs count:', dogs.length);
        console.log('🐕 First dog sample:', dogs[0] || 'No dogs returned');
      })
      .catch(error => {
        console.error('❌ Error fetching dogs on DailyCare mount:', error);
      });
  }, [fetchAllDogsWithCareStatus]);

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Daily Care
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Track and log daily care activities for all your dogs
          {dogStatuses ? ` (${dogStatuses.length} dogs)` : ' (Loading...)'}
        </p>
      </div>

      <CareDashboard />
    </MainLayout>
  );
};

export default DailyCare;
