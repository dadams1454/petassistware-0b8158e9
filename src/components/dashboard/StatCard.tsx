
import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StatCardProps {
  className?: string;
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: number;
  changeText?: string;
  trend?: 'up' | 'down' | 'neutral';
  textColor?: string;
  linkTo?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  className,
  title,
  value,
  icon,
  change,
  changeText,
  trend = 'neutral',
  textColor,
  linkTo,
}) => {
  const trendColors = {
    up: 'text-green-600 bg-green-50 dark:bg-green-900/20',
    down: 'text-red-600 bg-red-50 dark:bg-red-900/20',
    neutral: 'text-slate-600 bg-slate-50 dark:bg-slate-700/20',
  };

  const cardContent = (
    <>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <h3 
            className={cn(
              'mt-2 text-2xl font-semibold tracking-tight',
              textColor || 'text-slate-800 dark:text-white'
            )}
          >
            {value}
          </h3>
        </div>
        {icon && (
          <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
            {icon}
          </div>
        )}
      </div>

      {(change !== undefined || changeText) && (
        <div className="mt-3 flex items-center">
          {change !== undefined && (
            <div 
              className={cn(
                'text-xs font-medium py-0.5 px-1.5 rounded-md flex items-center',
                trendColors[trend]
              )}
            >
              {trend === 'up' && <ArrowUp size={12} className="mr-0.5" />}
              {trend === 'down' && <ArrowDown size={12} className="mr-0.5" />}
              {change > 0 ? '+' : ''}{change}%
            </div>
          )}
          {changeText && (
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-1.5">
              {changeText}
            </span>
          )}
        </div>
      )}

      {linkTo && (
        <div className="mt-4 flex items-center text-primary text-sm font-medium">
          View details <ArrowRight className="ml-1 h-4 w-4" />
        </div>
      )}
    </>
  );

  const cardClasses = cn(
    'p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800',
    'shadow-subtle transition-all duration-300 hover:shadow-elevated',
    'overflow-hidden group',
    linkTo && 'hover:border-primary/50 cursor-pointer',
    className
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className={cardClasses}>
        {cardContent}
      </Link>
    );
  }

  return (
    <div className={cardClasses}>
      {cardContent}
    </div>
  );
};

export default StatCard;
