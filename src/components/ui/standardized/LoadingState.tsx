
import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LoadingStateProps {
  message?: string;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading...', 
  className,
  size = 'medium'
}) => {
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-10 w-10',
    large: 'h-16 w-16'
  };

  return (
    <div className={cn("flex flex-col items-center justify-center py-12", className)}>
      <Loader2 className={cn(sizeClasses[size], "text-primary animate-spin mb-4")} />
      <p className="text-lg text-muted-foreground">{message}</p>
    </div>
  );
};

export default LoadingState;
