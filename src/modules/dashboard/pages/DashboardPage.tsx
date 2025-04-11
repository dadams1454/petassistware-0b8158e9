
import React from 'react';
import PageContainer from '@/components/common/PageContainer';
import { PageHeader } from '@/components/ui/standardized';

const DashboardPage = () => {
  return (
    <PageContainer>
      <div className="container mx-auto py-6">
        <PageHeader 
          title="Dashboard"
          subtitle="Welcome to PetAssistWare" 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-lg mb-2">Dogs</h3>
            <p className="text-muted-foreground">Manage your dogs</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-lg mb-2">Litters</h3>
            <p className="text-muted-foreground">Manage breeding and litters</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-lg mb-2">Customers</h3>
            <p className="text-muted-foreground">Manage customer information</p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default DashboardPage;
