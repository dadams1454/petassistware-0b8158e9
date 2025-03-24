
import React from 'react';
import LoadingSpinner from '../LoadingSpinner';
import { Button } from '@/components/ui/button';

interface LoadingStateProps {
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

const LoadingState: React.FC<LoadingStateProps> = ({ isLoading, error, onRetry }) => {
  if (isLoading) {
    return (
      <div className="mt-4">
        <LoadingSpinner />
        <p className="text-center mt-2 text-gray-500">Loading dogs data...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-md">
        <p className="text-center text-red-600 dark:text-red-400">{error}</p>
        <div className="flex justify-center mt-4">
          <Button onClick={onRetry}>Try Again</Button>
        </div>
      </div>
    );
  }
  
  return null;
};

export default LoadingState;
