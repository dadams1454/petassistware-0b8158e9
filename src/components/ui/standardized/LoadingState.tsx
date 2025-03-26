
import React from 'react';
import { Loader2 } from 'lucide-react';
import SkeletonLoader from './SkeletonLoader';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  fullPage?: boolean;
  showSkeleton?: boolean;
  skeletonCount?: number;
  skeletonVariant?: 'default' | 'card' | 'table' | 'text' | 'banner';
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading data...', 
  size = 'medium',
  fullPage = false,
  showSkeleton = false,
  skeletonCount = 3,
  skeletonVariant = 'default'
}) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  const container = fullPage 
    ? "fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50"
    : "flex flex-col items-center justify-center p-6 h-full";

  return (
    <div className={container}>
      {showSkeleton ? (
        <div className="w-full max-w-3xl">
          <SkeletonLoader 
            count={skeletonCount} 
            variant={skeletonVariant} 
          />
          {message && <p className="text-sm text-muted-foreground mt-4 text-center">{message}</p>}
        </div>
      ) : (
        <>
          <Loader2 className={`animate-spin text-primary ${sizeClasses[size]}`} />
          <p className="text-sm text-muted-foreground mt-4">{message}</p>
        </>
      )}
    </div>
  );
};

export default LoadingState;
