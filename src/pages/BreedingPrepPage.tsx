
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import BreedingPreparation from '@/components/breeding/BreedingPreparation';
import PageContainer from '@/components/common/PageContainer';
import BackButton from '@/components/common/BackButton';

const BreedingPrepPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const dogId = searchParams.get('dogId') || undefined;
  
  return (
    <PageContainer>
      <div className="container mx-auto py-6 space-y-6">
        <BackButton fallbackPath="/litters" />
        <BreedingPreparation dogId={dogId} />
      </div>
    </PageContainer>
  );
};

export default BreedingPrepPage;
