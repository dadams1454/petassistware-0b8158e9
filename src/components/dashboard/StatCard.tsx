
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface StatCardProps {
  stat: {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    description?: string;
  };
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ stat, isLoading = false }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {stat.title}
            </p>
            {stat.icon && (
              <div className="opacity-70">
                {stat.icon}
              </div>
            )}
          </div>
          
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {stat.value}
            </p>
          )}
          
          {stat.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {stat.description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
