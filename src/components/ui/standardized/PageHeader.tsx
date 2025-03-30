
import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  children,
  className
}) => {
  return (
    <div className={cn("flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6", className)}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {children && (
        <div className="flex-shrink-0 flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {children}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
