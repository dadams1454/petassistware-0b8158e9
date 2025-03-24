
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

interface LoadingStateProps {
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

const LoadingState: React.FC<LoadingStateProps> = ({ isLoading, error, onRetry }) => {
  if (!isLoading && !error) return null;

  return (
    <Card className="w-full">
      <CardContent className="py-6 flex flex-col items-center justify-center">
        {isLoading && (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading care dashboard...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center space-y-4">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <div className="text-center">
              <p className="text-destructive font-medium">Error loading data</p>
              <p className="text-muted-foreground text-sm mt-1">{error}</p>
            </div>
            <Button 
              variant="outline" 
              className="mt-2 gap-2"
              onClick={onRetry}
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LoadingState;
