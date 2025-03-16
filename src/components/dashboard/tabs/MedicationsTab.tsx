
import React from 'react';
import { Button } from '@/components/ui/button';
import { DogCareStatus } from '@/types/dailyCare';
import MedicationsLog from '@/components/dogs/components/care/medications/MedicationsLog';

interface MedicationsTabProps {
  dogStatuses: DogCareStatus[] | null;
  onRefreshDogs: () => void;
}

const MedicationsTab: React.FC<MedicationsTabProps> = ({ dogStatuses, onRefreshDogs }) => {
  return (
    <>
      {dogStatuses && dogStatuses.length > 0 ? (
        <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800 mb-4">
          <h3 className="text-lg font-medium text-purple-800 dark:text-purple-300">Medication Tracking</h3>
          <p className="text-sm text-purple-600 dark:text-purple-400">
            Track and log monthly preventative medications and daily treatments for all dogs.
          </p>
        </div>
      ) : null}
      
      {dogStatuses && dogStatuses.length > 0 ? (
        <MedicationsLog
          dogs={dogStatuses}
          onRefresh={onRefreshDogs}
        />
      ) : (
        <div className="p-8 text-center border rounded-lg">
          <p className="text-muted-foreground">No dogs found. Please refresh or add dogs to the system.</p>
          <Button onClick={onRefreshDogs} className="mt-4">Refresh Dogs</Button>
        </div>
      )}
    </>
  );
};

export default MedicationsTab;
