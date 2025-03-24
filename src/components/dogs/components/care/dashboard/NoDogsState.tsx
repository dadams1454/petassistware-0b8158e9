
import React from 'react';
import { Button } from '@/components/ui/button';
import { useRefresh } from '@/contexts/refreshContext';

interface NoDogsStateProps {}

const NoDogsState: React.FC<NoDogsStateProps> = () => {
  const { handleRefresh, isRefreshing } = useRefresh('dogs');
  
  return (
    <div className="p-8 text-center border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-950">
      <h2 className="text-xl font-semibold mb-2">No Dogs Found</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Add dogs to your kennel to start tracking their daily care.
      </p>
      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          disabled={isRefreshing}
          onClick={() => handleRefresh(true)}
        >
          Refresh
        </Button>
        <Button>Add Dogs</Button>
      </div>
    </div>
  );
};

export default NoDogsState;
