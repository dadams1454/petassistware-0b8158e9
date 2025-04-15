
import React, { ReactNode } from 'react';
import { FolderSearch, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = <FolderSearch className="h-12 w-12 text-muted-foreground" />,
  action,
  className
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-10 text-center ${className || ''}`}>
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md mb-6">{description}</p>
      {action && (
        <Button onClick={action.onClick}>
          <Plus className="h-4 w-4 mr-2" />
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
