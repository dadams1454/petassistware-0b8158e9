
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  message,
  onRetry
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full mb-4">
        <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
      </div>
      
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md mb-4">{message}</p>
      
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
