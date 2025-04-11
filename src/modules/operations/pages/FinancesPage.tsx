
import React from 'react';
import PageContainer from '@/components/common/PageContainer';
import { PageHeader } from '@/components/ui/standardized';

const FinancesPage = () => {
  return (
    <PageContainer>
      <div className="container mx-auto py-6">
        <PageHeader 
          title="Finances"
          subtitle="Track and manage your financial records" 
        />
        
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <p className="text-center text-gray-500">Finances feature is coming soon.</p>
        </div>
      </div>
    </PageContainer>
  );
};

export default FinancesPage;
