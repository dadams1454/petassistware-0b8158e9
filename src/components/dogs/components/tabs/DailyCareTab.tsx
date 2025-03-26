
import React from 'react';
import EnhancedDailyCareTab from '../care/EnhancedDailyCareTab';

interface DailyCareTabProps {
  dogId: string;
  dogName?: string;
}

const DailyCareTab: React.FC<DailyCareTabProps> = ({ dogId, dogName = 'Dog' }) => {
  return <EnhancedDailyCareTab dogId={dogId} dogName={dogName} />;
};

export default DailyCareTab;
