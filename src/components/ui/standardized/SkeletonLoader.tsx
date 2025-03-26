
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export interface SkeletonLoaderProps {
  count?: number;
  className?: string;
  height?: string;
  width?: string;
  rounded?: string;
  variant?: 'default' | 'card' | 'table' | 'text' | 'banner';
}

/**
 * A standardized skeleton loader component for consistent loading states
 */
const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  count = 1,
  className = '',
  height = 'h-12',
  width = 'w-full',
  rounded = 'rounded-md',
  variant = 'default'
}) => {
  // Different variants for different use cases
  const getVariantClasses = (): string => {
    switch (variant) {
      case 'card':
        return 'h-[180px] w-full rounded-lg';
      case 'table':
        return 'h-8 w-full rounded';
      case 'text':
        return 'h-4 w-3/4 rounded';
      case 'banner':
        return 'h-24 w-full rounded-lg';
      default:
        return `${height} ${width} ${rounded}`;
    }
  };

  const baseClasses = variant === 'default' 
    ? `${height} ${width} ${rounded} ${className}`
    : `${getVariantClasses()} ${className}`;

  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} className={baseClasses} />
      ))}
    </div>
  );
};

export default SkeletonLoader;
