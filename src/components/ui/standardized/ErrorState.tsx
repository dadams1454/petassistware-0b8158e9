
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  description?: string; // Added for backward compatibility
  onRetry?: () => void;
  actionLabel?: string; // Added property
  onAction?: () => void; // Added for consistency with other components
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  description,
  onRetry,
  actionLabel = 'Try Again',
  onAction
}) => {
  // Use either message or description, preferring message if both are provided
  const displayMessage = message || description || 'There was an error loading the data. Please try again.';
  
  const handleAction = () => {
    if (onAction) {
      onAction();
    } else if (onRetry) {
      onRetry();
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed rounded-lg bg-destructive/10">
      <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
      <h3 className="text-lg font-medium text-destructive">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-md">{displayMessage}</p>
      
      {(onRetry || onAction) && (
        <Button 
          variant="outline"
          className="mt-4" 
          onClick={handleAction}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
