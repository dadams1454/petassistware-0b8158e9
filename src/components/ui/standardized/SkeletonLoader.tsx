
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export interface SkeletonLoaderProps {
  count?: number;
  variant?: 'default' | 'card' | 'table' | 'text' | 'banner';
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  count = 3,
  variant = 'default'
}) => {
  const renderSkeleton = (index: number) => {
    switch (variant) {
      case 'card':
        return (
          <div key={index} className="rounded-lg border p-4 mb-4">
            <Skeleton className="h-4 w-1/3 mb-2" />
            <Skeleton className="h-4 w-2/3 mb-4" />
            <Skeleton className="h-20 w-full mb-2" />
            <div className="flex justify-end">
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        );
      case 'table':
        return (
          <div key={index} className="flex border-b py-4">
            <Skeleton className="h-5 w-1/6 mr-4" />
            <Skeleton className="h-5 w-4/6 mr-4" />
            <Skeleton className="h-5 w-1/6" />
          </div>
        );
      case 'text':
        return (
          <div key={index} className="mb-3">
            <Skeleton className="h-4 w-4/5 mb-2" />
            <Skeleton className="h-4 w-2/3 mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        );
      case 'banner':
        return (
          <div key={index} className="mb-4 rounded-lg">
            <Skeleton className="h-40 w-full" />
          </div>
        );
      default:
        return (
          <div key={index} className="py-2">
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      {Array.from({ length: count }).map((_, index) => renderSkeleton(index))}
    </div>
  );
};

export default SkeletonLoader;
