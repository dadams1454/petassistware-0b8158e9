
import React from 'react';
import { Button } from '@/components/ui/button';
import { DogCareStatus } from '@/types/dailyCare';
import GroomingSchedule from '@/components/dogs/components/care/table/GroomingSchedule';

interface GroomingTabProps {
  dogStatuses: DogCareStatus[] | null;
  onRefreshDogs: () => void;
}

const GroomingTab: React.FC<GroomingTabProps> = ({ dogStatuses, onRefreshDogs }) => {
  return (
    <>
      <div className="mb-4 bg-pink-50 dark:bg-pink-900/20 p-3 rounded-lg border border-pink-200 dark:border-pink-800">
        <h3 className="text-lg font-medium text-pink-800 dark:text-pink-300">Monthly Grooming Schedule</h3>
        <p className="text-sm text-pink-600 dark:text-pink-400">
          Track and schedule grooming activities for all dogs throughout the month.
        </p>
      </div>
      
      {dogStatuses && dogStatuses.length > 0 ? (
        <GroomingSchedule dogs={dogStatuses} onRefresh={onRefreshDogs} />
      ) : (
        <div className="p-8 text-center border rounded-lg">
          <p className="text-muted-foreground">No dogs found. Please refresh or add dogs to the system.</p>
          <Button onClick={onRefreshDogs} className="mt-4">Refresh Dogs</Button>
        </div>
      )}
    </>
  );
};

export default GroomingTab;
