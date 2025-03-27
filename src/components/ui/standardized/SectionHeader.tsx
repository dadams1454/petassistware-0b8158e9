
import React from 'react';
import { Button } from '@/components/ui/button';

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  action
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      
      {action && (
        <Button 
          size="sm" 
          onClick={action.onClick}
        >
          {action.icon && <span className="mr-2">{action.icon}</span>}
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default SectionHeader;
