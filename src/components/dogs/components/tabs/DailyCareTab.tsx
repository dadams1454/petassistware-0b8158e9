
import React from 'react';
import EnhancedDailyCareTab from '../care/EnhancedDailyCareTab';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ErrorState } from '@/components/ui/standardized';

interface DailyCareTabProps {
  dogId: string;
  dogName?: string;
}

const DailyCareTab: React.FC<DailyCareTabProps> = ({ dogId, dogName = 'Dog' }) => {
  return (
    <ErrorBoundary 
      name="DailyCareTab"
      fallback={
        <ErrorState 
          title="Error Loading Daily Care" 
          message={`We encountered an issue loading the daily care information for ${dogName}.`} 
          onRetry={() => window.location.reload()}
        />
      }
    >
      <EnhancedDailyCareTab dogId={dogId} dogName={dogName} />
    </ErrorBoundary>
  );
};

export default DailyCareTab;
