
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingState: React.FC = () => {
  return (
    <div className="space-y-6">
      <Skeleton className="w-full h-10 mb-4" />
      <Skeleton className="w-full h-[300px]" />
    </div>
  );
};

export default LoadingState;
