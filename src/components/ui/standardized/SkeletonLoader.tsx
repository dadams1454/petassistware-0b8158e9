
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface SkeletonLoaderProps {
  count?: number;
  height?: number;
  className?: string;
  variant?: 'default' | 'card' | 'list' | 'table';
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  count = 3,
  height = 20,
  className = '',
  variant = 'default'
}) => {
  const renderDefaultSkeletons = () => {
    return Array(count)
      .fill(0)
      .map((_, i) => (
        <Skeleton 
          key={`skeleton-${i}`} 
          className={`h-${height} w-full mb-2 ${className}`} 
        />
      ));
  };

  const renderCardSkeletons = () => {
    return Array(count)
      .fill(0)
      .map((_, i) => (
        <div key={`card-skeleton-${i}`} className="rounded-lg border p-4 shadow-sm">
          <Skeleton className="h-6 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6 mb-2" />
          <Skeleton className="h-10 w-1/3 mt-4" />
        </div>
      ));
  };

  const renderListSkeletons = () => {
    return Array(count)
      .fill(0)
      .map((_, i) => (
        <div key={`list-skeleton-${i}`} className="flex items-center py-2 border-b">
          <Skeleton className="h-10 w-10 rounded-full mr-3" />
          <div className="flex-1">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ));
  };

  const renderTableSkeletons = () => {
    return (
      <div className="w-full">
        <div className="flex border-b py-3">
          {Array(4).fill(0).map((_, i) => (
            <Skeleton key={`header-${i}`} className="h-6 flex-1 mr-2" />
          ))}
        </div>
        {Array(count).fill(0).map((_, i) => (
          <div key={`row-${i}`} className="flex border-b py-3">
            {Array(4).fill(0).map((_, j) => (
              <Skeleton key={`cell-${i}-${j}`} className="h-4 flex-1 mr-2" />
            ))}
          </div>
        ))}
      </div>
    );
  };

  switch (variant) {
    case 'card':
      return <div className="space-y-3">{renderCardSkeletons()}</div>;
    case 'list':
      return <div>{renderListSkeletons()}</div>;
    case 'table':
      return <div>{renderTableSkeletons()}</div>;
    default:
      return <div>{renderDefaultSkeletons()}</div>;
  }
};

export default SkeletonLoader;
