
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message: string;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No data found',
  message,
  icon = <AlertCircle className="h-12 w-12 text-muted-foreground/50" />
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center bg-muted/20 rounded-md">
      <div className="mb-4">
        {icon}
      </div>
      {title && <h3 className="text-lg font-medium mb-2">{title}</h3>}
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
};

export default EmptyState;
