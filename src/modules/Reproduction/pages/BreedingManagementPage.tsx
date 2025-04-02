
import React from 'react';
import PageContainer from '@/components/common/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BreedingPrepTab from '../components/welping/BreedingPrepTab';
import BackButton from '@/components/common/BackButton';

const BreedingManagementPage: React.FC = () => {
  return (
    <PageContainer>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center mb-4">
          <BackButton fallbackPath="/reproduction" />
          <h1 className="text-2xl font-bold ml-2">Breeding Preparation</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Breeding Preparation</CardTitle>
          </CardHeader>
          <CardContent>
            <BreedingPrepTab />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default BreedingManagementPage;
