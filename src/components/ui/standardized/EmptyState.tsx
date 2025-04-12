
import React from 'react';
import { Button } from '@/components/ui/button';

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
      {icon && (
        <div className="mb-2 text-muted-foreground">
          {icon}
        </div>
      )}
      
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md">{description}</p>
      
      {action && (
        <Button 
          onClick={action.onClick}
          disabled={action.disabled}
          className="mt-4"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
