
import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  className
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 text-center ${className || ''}`}>
      {icon && (
        <div className="bg-muted/50 p-4 rounded-full mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4 max-w-md mx-auto">{description}</p>
      {action && (
        <Button 
          onClick={action.onClick}
          disabled={action.disabled}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
