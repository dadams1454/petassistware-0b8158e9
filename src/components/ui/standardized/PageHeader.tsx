
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface PageHeaderProps {
  title: string;
  description?: string;
  subtitle?: string; // Add subtitle to support existing code
  actions?: ReactNode;
  action?: ReactNode; // Add action to support existing code
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  subtitle, // Support both description and subtitle
  actions,
  action, // Support both actions and action
  className
}) => {
  // Use subtitle as fallback for description
  const headerDescription = description || subtitle;
  // Use action as fallback for actions
  const headerActions = actions || action;
  
  return (
    <div className={cn("mb-6", className)}>
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {headerDescription && (
            <p className="text-muted-foreground mt-1">{headerDescription}</p>
          )}
        </div>
        {headerActions && <div className="flex gap-2">{headerActions}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
