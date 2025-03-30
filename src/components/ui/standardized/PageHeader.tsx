
import React from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export interface PageHeaderProps {
  title: string;
  description?: string;
  subtitle?: string; // Added this property
  backLink?: string; // Added this property
  children?: React.ReactNode;
  className?: string;
  action?: React.ReactNode; // Added this property
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  subtitle,
  backLink,
  children,
  className,
  action
}) => {
  return (
    <div className={cn("flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6", className)}>
      <div>
        {backLink && (
          <Link to={backLink} className="flex items-center text-muted-foreground hover:text-foreground mb-2">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        )}
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-muted-foreground mt-1">{subtitle}</p>
        )}
        {description && !subtitle && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      
      {(children || action) && (
        <div className="flex-shrink-0 flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {action}
          {children}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
