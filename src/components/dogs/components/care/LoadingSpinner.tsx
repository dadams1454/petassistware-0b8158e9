
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col space-y-3 w-full">
      <div className="flex items-center justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-md" />
        ))}
      </div>
    </div>
  );
};

export default LoadingSpinner;
