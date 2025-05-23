
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface StatCardProps {
  title: string;
  value: number | string;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  isLoading = false,
  icon
}) => {
  return (
    <Card className="bg-card text-card-foreground border-0">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          {isLoading ? (
            <Skeleton className="h-12 w-16 mt-2" />
          ) : (
            <p className="text-4xl font-bold mt-1 text-foreground">{value}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
