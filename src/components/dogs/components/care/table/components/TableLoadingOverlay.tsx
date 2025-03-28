
import React from 'react';

interface TableLoadingOverlayProps {
  isLoading: boolean;
}

const TableLoadingOverlay: React.FC<TableLoadingOverlayProps> = ({ isLoading }) => {
  if (!isLoading) return null;
  
  return (
    <div className="absolute inset-0 bg-white/80 dark:bg-black/60 flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-sm text-muted-foreground">Loading data...</p>
      </div>
    </div>
  );
};

export default TableLoadingOverlay;
