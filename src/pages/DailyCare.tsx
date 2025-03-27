
import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import { DailyCareProvider } from '@/contexts/dailyCare';
import ModularDailyCareWithProvider from '@/components/care/ModularDailyCare';

const DailyCare: React.FC = () => {
  return (
    <MainLayout>
      <DailyCareProvider>
        <ModularDailyCareWithProvider />
      </DailyCareProvider>
    </MainLayout>
  );
};

export default DailyCare;
