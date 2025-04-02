
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/standardized';
import PageContainer from '@/components/common/PageContainer';
import { Card, CardContent } from '@/components/ui/card';
import { WelpingStepper } from './components';
import { useWelping } from './hooks/useWelping';

const WelpingCreatePage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const { createWelping, isCreating } = useWelping();
  
  const handleWelpingCreated = (litterId: string) => {
    if (litterId) {
      navigate(`/welping/${litterId}`);
    }
  };
  
  return (
    <PageContainer>
      <div className="container mx-auto py-6 space-y-6">
        <PageHeader
          title="Create New Welping Record"
          subtitle="Set up a new welping session for your female dog"
        />
        
        <Card>
          <CardContent className="pt-6">
            <WelpingStepper 
              currentStep={currentStep} 
              setCurrentStep={setCurrentStep}
              onLitterCreated={handleWelpingCreated}
            />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default WelpingCreatePage;
