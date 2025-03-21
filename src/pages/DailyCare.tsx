
import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import { useDailyCare } from '@/contexts/dailyCare';
import { useDailyCareRefresh } from './hooks/useDailyCareRefresh';
import DailyCareHeader from './components/DailyCareHeader';
import DailyCareContent from './components/DailyCareContent';

const DailyCare: React.FC = () => {
  const { dogStatuses } = useDailyCare();
  const { currentDate, lastRefresh, loading } = useDailyCareRefresh();
  
  return (
    <MainLayout>
      <DailyCareHeader 
        dogCount={dogStatuses?.length || 0}
        isLoading={loading}
        lastRefresh={lastRefresh}
        currentDate={currentDate}
      />
      
      <DailyCareContent 
        dogStatuses={dogStatuses}
        currentDate={currentDate}
      />
    </MainLayout>
  );
};

export default DailyCare;
