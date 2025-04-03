
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import WelpingRecordForm from './WelpingRecordForm';
import WelpingObservationForm from './WelpingObservationForm';
import PostpartumCareForm from './PostpartumCareForm';

interface WelpingStepperProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  onLitterCreated: (litterId: string) => void;
}

const WelpingStepper: React.FC<WelpingStepperProps> = ({ 
  currentStep, 
  setCurrentStep, 
  onLitterCreated 
}) => {
  const [createdLitter, setCreatedLitter] = useState<any>(null);

  const handleLitterCreated = (litter: any) => {
    setCreatedLitter(litter);
    
    // Use id instead of litterId
    if (litter && litter.id) {
      onLitterCreated(litter.id);
      setCurrentStep(2);
    }
  };

  return (
    <Tabs defaultValue={`step-${currentStep}`} className="w-full">
      <TabsList className="grid grid-cols-3">
        <TabsTrigger value="step-1">Litter Details</TabsTrigger>
        <TabsTrigger value="step-2" disabled={!createdLitter}>Welping Record</TabsTrigger>
        <TabsTrigger value="step-3" disabled={!createdLitter}>Postpartum Care</TabsTrigger>
      </TabsList>

      <TabsContent value="step-1">
        <WelpingRecordForm onSuccess={handleLitterCreated} />
      </TabsContent>

      <TabsContent value="step-2">
        {createdLitter && (
          <WelpingObservationForm litterId={createdLitter.id} />
        )}
      </TabsContent>

      <TabsContent value="step-3">
        {createdLitter && (
          <PostpartumCareForm litterId={createdLitter.id} />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default WelpingStepper;
