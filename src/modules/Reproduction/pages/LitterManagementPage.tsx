
import React from 'react';
import PageContainer from '@/components/common/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LitterOverviewTab from '../components/welping/LitterOverviewTab';
import BackButton from '@/components/common/BackButton';

const LitterManagementPage: React.FC = () => {
  return (
    <PageContainer>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center mb-4">
          <BackButton fallbackPath="/reproduction" />
          <h1 className="text-2xl font-bold ml-2">Litter Management</h1>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <LitterOverviewTab />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default LitterManagementPage;
