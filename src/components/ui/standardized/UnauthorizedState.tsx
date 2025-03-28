
import React from 'react';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UnauthorizedStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const UnauthorizedState: React.FC<UnauthorizedStateProps> = ({
  title = "Access Denied",
  description = "You don't have permission to access this resource.",
  actionLabel = "Go Back",
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-destructive/10 p-3 rounded-full mb-4">
        <Shield className="h-10 w-10 text-destructive" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mb-6">{description}</p>
      {onAction && (
        <Button onClick={onAction} variant="outline">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default UnauthorizedState;
