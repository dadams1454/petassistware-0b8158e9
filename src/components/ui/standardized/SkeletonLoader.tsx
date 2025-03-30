
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export interface SkeletonLoaderProps {
  count?: number;
  height?: number | string;
  width?: number | string;
  className?: string;
  circle?: boolean;
  variant?: 'default' | 'text' | 'banner' | 'card' | 'table';
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  count = 1,
  height = '1rem',
  width = '100%',
  className = '',
  circle = false,
  variant = 'default'
}) => {
  const items = Array(count).fill(null);
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'h-4 w-full max-w-sm';
      case 'banner':
        return 'h-24 w-full';
      case 'card':
        return 'h-40 w-full';
      case 'table':
        return 'h-10 w-full';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-2">
      {items.map((_, index) => (
        <Skeleton
          key={index}
          className={cn(
            getVariantClasses(),
            className,
            circle && 'rounded-full'
          )}
          style={{
            height: variant === 'default' ? height : undefined,
            width: variant === 'default' ? width : undefined
          }}
        />
      ))}
    </div>
  );
};

export default SkeletonLoader;
