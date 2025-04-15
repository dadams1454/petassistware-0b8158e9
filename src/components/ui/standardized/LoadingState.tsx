
import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  fullPage?: boolean;
  className?: string;
  showSkeleton?: boolean;
  skeletonVariant?: 'card' | 'table' | 'default';
  skeletonCount?: number;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading...', 
  size = 'medium',
  fullPage = false,
  className,
  showSkeleton = false,
  skeletonVariant = 'default',
  skeletonCount = 3
}) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-10 w-10'
  };

  const containerClasses = fullPage 
    ? "flex flex-col items-center justify-center min-h-screen bg-background"
    : cn("flex flex-col items-center justify-center py-12", className);

  return (
    <div className={containerClasses}>
      <Loader2 className={`${sizeClasses[size]} text-primary animate-spin mb-4`} />
      <p className="text-lg text-muted-foreground">{message}</p>
    </div>
  );
};

export default LoadingState;
