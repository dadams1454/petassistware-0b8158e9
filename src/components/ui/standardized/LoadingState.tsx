
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  size = 'medium'
}) => {
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'h-5 w-5';
      case 'large':
        return 'h-12 w-12';
      case 'medium':
      default:
        return 'h-8 w-8';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Loader2 className={`${getSizeClass()} animate-spin text-primary mb-2`} />
      <p className="text-muted-foreground text-center">{message}</p>
    </div>
  );
};

export default LoadingState;
