
import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

// Define the action prop type for EmptyState
export interface EmptyStateAction {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: EmptyStateAction | React.ReactElement;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-background">
      {icon && <div className="mb-4">{icon}</div>}
      <h3 className="text-lg font-medium">{title}</h3>
      {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
      {action && (
        <div className="mt-4">
          {React.isValidElement(action) ? (
            action
          ) : (
            <Button
              onClick={(action as EmptyStateAction).onClick}
              disabled={(action as EmptyStateAction).disabled}
              variant={(action as EmptyStateAction).variant || 'default'}
            >
              {(action as EmptyStateAction).label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    disabled?: boolean;
  };
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  action
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {action && (
        <Button 
          onClick={action.onClick} 
          variant={action.variant || 'default'}
          disabled={action.disabled}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};
