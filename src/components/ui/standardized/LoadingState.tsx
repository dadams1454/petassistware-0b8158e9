
import React from 'react';
import { PawPrint } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  fullPage?: boolean;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  size = 'medium',
  fullPage = false
}) => {
  const sizeMap = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  const container = fullPage 
    ? 'fixed inset-0 flex items-center justify-center bg-background/80 z-50'
    : 'flex flex-col items-center justify-center py-8';

  return (
    <div className={container}>
      <div className="animate-pulse">
        <PawPrint className={`${sizeMap[size]} text-primary`} />
      </div>
      {message && (
        <p className="text-center text-muted-foreground mt-2">{message}</p>
      )}
    </div>
  );
};

export default LoadingState;
