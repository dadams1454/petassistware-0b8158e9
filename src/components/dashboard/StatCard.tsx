
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export interface StatCardProps {
  title: string;
  value: number;
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, isLoading = false }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>
          
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {value.toLocaleString()}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
