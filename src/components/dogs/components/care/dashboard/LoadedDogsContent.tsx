
import React, { useEffect } from 'react';
import CareTabsContent from '../CareTabsContent';
import { DogCareStatus } from '@/types/dailyCare';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface LoadedDogsContentProps {
  dogStatuses: DogCareStatus[];
  activeView: string;
  selectedCategory: string;
  selectedDogId: string | null;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  onLogCare: (dogId: string) => void;
  onCareLogSuccess: () => void;
}

const LoadedDogsContent: React.FC<LoadedDogsContentProps> = ({
  dogStatuses,
  activeView,
  selectedCategory,
  selectedDogId,
  dialogOpen,
  setDialogOpen,
  onLogCare,
  onCareLogSuccess
}) => {
  useEffect(() => {
    console.log(`🐕 LoadedDogsContent received ${dogStatuses.length} dogs`);
    if (dogStatuses.length > 0) {
      console.log('🐕 Dog names:', dogStatuses.map(d => d.dog_name).join(', '));
    }
  }, [dogStatuses]);

  return (
    <>
      <Alert className="mb-4 border-green-500 bg-green-50 dark:bg-green-900/20">
        <AlertTitle className="font-semibold text-green-700 dark:text-green-300">
          Dogs Loaded: {dogStatuses.length}
        </AlertTitle>
        <AlertDescription className="text-green-600 dark:text-green-400">
          {dogStatuses.length > 0 ? (
            <>
              <span className="font-medium">Available dogs:</span> {dogStatuses.map(d => d.dog_name).join(', ')}
            </>
          ) : (
            "No dogs available. Try refreshing the page or adding dogs to the system."
          )}
        </AlertDescription>
      </Alert>
      
      <CareTabsContent
        activeTab={activeView}
        dogsStatus={dogStatuses}
        onLogCare={onLogCare}
        selectedDogId={selectedDogId}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        onCareLogSuccess={onCareLogSuccess}
        selectedCategory={selectedCategory}
      />
    </>
  );
};

export default LoadedDogsContent;
