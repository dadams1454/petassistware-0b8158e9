
import React from 'react';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  fullPage?: boolean;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading data...', 
  size = 'medium',
  fullPage = false
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
      <div className={`animate-spin rounded-full border-b-2 border-primary ${sizeClasses[size]}`}></div>
      <p className="text-sm text-muted-foreground mt-4">{message}</p>
    </div>
  );
};

export default LoadingState;
