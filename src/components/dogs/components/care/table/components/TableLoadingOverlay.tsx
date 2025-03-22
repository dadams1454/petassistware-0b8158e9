
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface TableLoadingOverlayProps {
  isLoading: boolean;
}

const TableLoadingOverlay: React.FC<TableLoadingOverlayProps> = ({ isLoading }) => {
  if (!isLoading) return null;
  
  return (
    <div className="absolute inset-0 bg-white/70 dark:bg-black/70 backdrop-blur-sm z-30 flex items-center justify-center transition-opacity duration-300">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        <p className="text-sm font-medium text-muted-foreground">Refreshing data...</p>
        <div className="grid grid-cols-3 gap-2 w-36">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-2 w-full rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableLoadingOverlay;
