
import React from 'react';
import { DailyCareProvider } from '@/contexts/dailyCare';
import EnhancedDailyCareTab from '../care/EnhancedDailyCareTab';
import { DailyCareTabProps } from '../profile/DogProfileTabs';

const DailyCareTab: React.FC<DailyCareTabProps> = ({ dogId, dogName = 'Dog' }) => {
  return (
    <DailyCareProvider>
      <EnhancedDailyCareTab dogId={dogId} dogName={dogName} />
    </DailyCareProvider>
  );
};

export default DailyCareTab;
