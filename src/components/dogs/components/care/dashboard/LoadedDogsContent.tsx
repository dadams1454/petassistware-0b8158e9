
import React, { useEffect } from 'react';
import CareTabsContent from '../CareTabsContent';
import { DogCareStatus } from '@/types/dailyCare';

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
  // Add debug useEffect to log when dog data changes
  useEffect(() => {
    console.log(`🐕 LoadedDogsContent received ${dogStatuses.length} dogs`);
    if (dogStatuses.length > 0) {
      console.log('🐕 First few dog names:', dogStatuses.slice(0, 5).map(d => d.dog_name).join(', '));
    }
  }, [dogStatuses]);

  return (
    <>
      <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-md mb-2">
        <p className="text-sm text-green-600 dark:text-green-400">
          ✅ Loaded {dogStatuses.length} dogs successfully: {dogStatuses.slice(0, 5).map(d => d.dog_name).join(', ')}
          {dogStatuses.length > 5 ? ` and ${dogStatuses.length - 5} more` : ''}
        </p>
      </div>
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
