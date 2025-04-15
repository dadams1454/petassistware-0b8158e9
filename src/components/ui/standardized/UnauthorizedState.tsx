
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UnauthorizedStateProps {
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const UnauthorizedState: React.FC<UnauthorizedStateProps> = ({
  message = "You don't have permission to access this resource.",
  actionLabel = "Go Back",
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-destructive mb-4">
        <AlertTriangle className="h-12 w-12" />
      </div>
      <h2 className="text-xl font-semibold mb-2">Unauthorized Access</h2>
      <p className="text-center text-muted-foreground mb-6">
        {message}
      </p>
      {onAction && (
        <Button onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default UnauthorizedState;
