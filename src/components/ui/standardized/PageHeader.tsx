
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  backLink?: string;
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  action,
  backLink,
  actions
}) => {
  return (
    <div className="flex flex-col gap-4 mb-6">
      {backLink && (
        <div>
          <Button variant="ghost" size="sm" asChild className="pl-0 hover:bg-transparent">
            <Link to={backLink} className="flex items-center text-muted-foreground">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back
            </Link>
          </Button>
        </div>
      )}
      
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-slate-500 dark:text-slate-400">{subtitle}</p>
          )}
        </div>
        {action && (
          <div>{action}</div>
        )}
        {actions && (
          <div>{actions}</div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
