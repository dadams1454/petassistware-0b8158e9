
import React from 'react';
import PageContainer from '@/components/common/PageContainer';
import { PageHeader } from '@/components/ui/standardized';

const Litters: React.FC = () => {
  return (
    <PageContainer>
      <div className="container mx-auto py-6 px-4">
        <PageHeader 
          title="Litters"
          subtitle="Manage your litters and puppies"
          className="mb-6"
        />
        
        <div className="bg-white rounded-lg shadow p-6">
          <p>Litter management interface will be displayed here.</p>
        </div>
      </div>
    </PageContainer>
  );
};

export default Litters;
