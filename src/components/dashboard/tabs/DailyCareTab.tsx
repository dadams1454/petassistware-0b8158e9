
import React from 'react';
import { DailyCareProvider } from '@/contexts/dailyCare';
import EnhancedDailyCareTab from '@/components/dogs/components/care/EnhancedDailyCareTab';

interface DailyCareTabProps {
  dogId: string;
  dogName?: string;
}

const DailyCareTab: React.FC<DailyCareTabProps> = ({ dogId, dogName = 'Dog' }) => {
  return (
    <DailyCareProvider>
      <EnhancedDailyCareTab dogId={dogId} dogName={dogName} />
    </DailyCareProvider>
  );
};

export default DailyCareTab;
