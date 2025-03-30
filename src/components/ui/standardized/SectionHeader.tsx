
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: ButtonProps['variant'];
    icon?: React.ReactNode;
  };
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  action
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      
      {action && (
        <Button
          onClick={action.onClick}
          variant={action.variant || "default"}
          className="sm:self-start"
        >
          {action.icon}
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default SectionHeader;
