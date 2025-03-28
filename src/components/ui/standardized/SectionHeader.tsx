import React from 'react';
import { Button } from '@/components/ui/button';

interface ActionProps {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode | ActionProps;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  action,
  className = '',
}) => {
  const renderAction = () => {
    if (!action) return null;
    
    // Check if action is an object with label and onClick properties
    if (typeof action === 'object' && 'label' in action && 'onClick' in action) {
      const { label, onClick, icon, variant = 'outline' } = action as ActionProps;
      return (
        <Button variant={variant} onClick={onClick} size="sm" className="gap-2">
          {icon}
          {label}
        </Button>
      );
    }
    
    // Otherwise, render the action as is
    return action;
  };
  
  return (
    <div className={`flex flex-col sm:flex-row justify-between sm:items-center mb-4 ${className}`}>
      <div>
        <h3 className="text-lg font-semibold leading-tight">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {action && <div className="mt-2 sm:mt-0">{renderAction()}</div>}
    </div>
  );
};

export default SectionHeader;
