
import React from 'react';
import { Button } from '@/components/ui/button';

export interface PageHeaderProps {
  title: string;
  description?: string;
  subtitle?: string; // Added to fix TypeScript errors
  backLink?: string;
  className?: string;
  action?: React.ReactNode;
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    disabled?: boolean;
    icon?: React.ReactNode; // Add icon support
  };
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  subtitle, // Added to support subtitle
  backLink,
  className = '',
  action,
  actions
}) => {
  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 ${className}`}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
        {description && <p className="text-muted-foreground mt-1">{description}</p>}
        {backLink && (
          <a href={backLink} className="text-sm text-primary hover:underline mt-1 inline-block">
            ← Back
          </a>
        )}
      </div>
      
      <div className="flex items-center gap-2 mt-4 sm:mt-0">
        {action}
        {actions && (
          <Button
            onClick={actions.onClick}
            variant={actions.variant || 'default'}
            disabled={actions.disabled}
          >
            {actions.icon && <span className="mr-2">{actions.icon}</span>}
            {actions.label}
          </Button>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
