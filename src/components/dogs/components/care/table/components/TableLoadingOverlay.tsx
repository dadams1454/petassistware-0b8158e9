
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface TableLoadingOverlayProps {
  isLoading: boolean;
}

const TableLoadingOverlay: React.FC<TableLoadingOverlayProps> = ({ isLoading }) => {
  if (!isLoading) return null;
  
  return (
    <div className="absolute inset-0 bg-white/20 dark:bg-black/20 backdrop-blur-[0.5px] z-30 flex items-center justify-center transition-all duration-500 opacity-90">
      <div className="flex flex-col items-center space-y-4 p-4 rounded-lg bg-white/90 dark:bg-slate-900/90 shadow-sm">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-sm font-medium text-muted-foreground">Updating data...</p>
      </div>
    </div>
  );
};

export default TableLoadingOverlay;
