
import React from 'react';
import PageContainer from '@/components/common/PageContainer';
import { PageHeader } from '@/components/ui/standardized';

const Customers: React.FC = () => {
  return (
    <PageContainer>
      <div className="container mx-auto py-6 px-4">
        <PageHeader 
          title="Customers"
          subtitle="Manage your customer relationships"
          className="mb-6"
        />
        
        <div className="bg-white rounded-lg shadow p-6">
          <p>Customer management interface will be displayed here.</p>
        </div>
      </div>
    </PageContainer>
  );
};

export default Customers;
