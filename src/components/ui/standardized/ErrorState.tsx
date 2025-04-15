
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../button';
import { cn } from '@/lib/utils';

export interface ErrorStateProps {
  title?: string;
  description?: string;
  message?: string; // Alternative name for description
  retryAction?: () => void;
  onRetry?: () => void; // Alternative name for retryAction
  className?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'An error occurred',
  description,
  message,
  retryAction,
  onRetry,
  className
}) => {
  const errorMessage = description || message || 'Failed to load the requested data.';
  const retryHandler = retryAction || onRetry;

  return (
    <div className={cn("flex flex-col items-center justify-center py-8 text-center", className)}>
      <AlertTriangle className="h-10 w-10 text-destructive mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{errorMessage}</p>
      {retryHandler && (
        <Button onClick={retryHandler} variant="default">
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
