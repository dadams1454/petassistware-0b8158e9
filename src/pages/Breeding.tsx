
import React from 'react';
import { useParams } from 'react-router-dom';
import PageContainer from '@/components/common/PageContainer';
import BreedingPlanForm from '@/components/mating/BreedingPlanForm';

const Breeding: React.FC = () => {
  const { damId, sireId } = useParams<{ damId?: string; sireId?: string }>();
  
  return (
    <PageContainer>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6">Breeding Management</h1>
        
        <BreedingPlanForm 
          initialDamId={damId} 
          initialSireId={sireId} 
        />
      </div>
    </PageContainer>
  );
};

export default Breeding;
