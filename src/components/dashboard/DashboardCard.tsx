
import React from 'react';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  className?: string;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  noPadding?: boolean;
  children: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  className,
  title,
  subtitle,
  icon,
  actions,
  noPadding = false,
  children,
}) => {
  return (
    <div
      className={cn(
        'rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800',
        'shadow-subtle overflow-hidden transition-all duration-300 hover:shadow-elevated',
        'animate-fade-in',
        className
      )}
    >
      {(title || subtitle || icon || actions) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                {icon}
              </div>
            )}
            <div>
              {title && (
                <h3 className="text-base font-medium text-slate-800 dark:text-slate-200">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {actions && <div>{actions}</div>}
        </div>
      )}
      <div className={cn(
        noPadding ? '' : 'p-6',
        'bg-white/50 dark:bg-transparent'
      )}>
        {children}
      </div>
    </div>
  );
};

export default DashboardCard;
