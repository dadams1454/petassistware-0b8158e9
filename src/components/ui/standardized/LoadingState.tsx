
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  fullPage?: boolean;
  className?: string;
}

/**
 * LoadingState - A standardized loading indicator component
 */
const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading...",
  size = 'medium',
  fullPage = false,
  className = ""
}) => {
  const sizeMap = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };
  
  const containerClass = fullPage 
    ? 'fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50'
    : 'flex flex-col items-center justify-center py-8';
    
  return (
    <div className={`${containerClass} ${className}`}>
      <Loader2 className={`animate-spin text-primary mb-4 ${sizeMap[size]}`} />
      {message && <p className="text-muted-foreground">{message}</p>}
    </div>
  );
};

export default LoadingState;
