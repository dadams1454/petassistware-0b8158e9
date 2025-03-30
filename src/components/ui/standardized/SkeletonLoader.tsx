
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface SkeletonLoaderProps {
  count?: number;
  height?: number | string;
  width?: number | string;
  className?: string;
  circle?: boolean;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  count = 1,
  height = '1rem',
  width = '100%',
  className = '',
  circle = false
}) => {
  const items = Array(count).fill(null);

  return (
    <div className="space-y-2">
      {items.map((_, index) => (
        <Skeleton
          key={index}
          className={cn(
            className,
            circle && 'rounded-full'
          )}
          style={{
            height,
            width
          }}
        />
      ))}
    </div>
  );
};

export default SkeletonLoader;
