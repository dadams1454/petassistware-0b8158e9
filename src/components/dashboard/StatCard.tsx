
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  title: string;
  value: number | string;
  change?: number;
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  isLoading = false 
}) => {
  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm">
      {isLoading ? (
        <>
          <Skeleton className="h-5 w-24 mb-2" />
          <Skeleton className="h-8 w-16" />
        </>
      ) : (
        <>
          <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
          <p className="text-3xl font-bold">{value}</p>
          
          {change !== undefined && (
            <div className={`text-sm mt-2 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '+' : ''}{change}%
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StatCard;
