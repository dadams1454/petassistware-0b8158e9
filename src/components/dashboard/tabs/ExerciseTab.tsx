
import React from 'react';
import { Button } from '@/components/ui/button';
import { DogCareStatus } from '@/types/dailyCare';
import ExerciseLog from '@/components/dogs/components/care/exercise/ExerciseLog';

interface ExerciseTabProps {
  dogStatuses: DogCareStatus[] | null;
  onRefreshDogs: () => void;
}

const ExerciseTab: React.FC<ExerciseTabProps> = ({ dogStatuses, onRefreshDogs }) => {
  return (
    <>
      {dogStatuses && dogStatuses.length > 0 ? (
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg border border-indigo-200 dark:border-indigo-800 mb-4">
          <h3 className="text-lg font-medium text-indigo-800 dark:text-indigo-300">Daily Exercise Tracking</h3>
          <p className="text-sm text-indigo-600 dark:text-indigo-400">
            Monitor and log exercise activities for all dogs throughout the day.
          </p>
        </div>
      ) : null}
      
      {dogStatuses && dogStatuses.length > 0 ? (
        <ExerciseLog
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

export default ExerciseTab;
