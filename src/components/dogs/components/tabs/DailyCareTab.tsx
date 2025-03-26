
import React from 'react';
import EnhancedDailyCareTab from '../care/EnhancedDailyCareTab';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ErrorState } from '@/components/ui/standardized';
import { useToast } from '@/hooks/use-toast';

interface DailyCareTabProps {
  dogId: string;
  dogName?: string;
}

const DailyCareTab: React.FC<DailyCareTabProps> = ({ dogId, dogName = 'Dog' }) => {
  const { toast } = useToast();
  
  const handleErrorReset = () => {
    toast({
      title: "Recovered from error",
      description: "Refreshing dog care information",
    });
  };
  
  return (
    <ErrorBoundary 
      name="DailyCareTab"
      onReset={handleErrorReset}
      fallback={
        <ErrorState 
          title="Error Loading Daily Care" 
          message={`We encountered an issue loading the daily care information for ${dogName}. Please try again.`} 
          onRetry={() => window.location.reload()}
        />
      }
    >
      <EnhancedDailyCareTab dogId={dogId} dogName={dogName} />
    </ErrorBoundary>
  );
};

export default DailyCareTab;
