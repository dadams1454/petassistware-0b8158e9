
import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {icon && (
        <div className="mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold text-center">{title}</h3>
      <p className="mt-2 text-center text-muted-foreground max-w-sm">
        {description}
      </p>
      {action && (
        <Button
          onClick={action.onClick}
          className="mt-6"
          disabled={action.disabled}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};
