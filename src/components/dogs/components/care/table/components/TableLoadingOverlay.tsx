
import React from 'react';
import { Loader2 } from 'lucide-react';

interface TableLoadingOverlayProps {
  isLoading: boolean;
  isPending?: boolean;
}

const TableLoadingOverlay: React.FC<TableLoadingOverlayProps> = ({ 
  isLoading,
  isPending = false
}) => {
  if (!isLoading && !isPending) return null;
  
  return (
    <div 
      className={`absolute inset-0 bg-background/50 backdrop-blur-[1px] z-10 flex items-center justify-center transition-opacity duration-200 ${
        isLoading ? 'opacity-100' : isPending ? 'opacity-75' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-background/90 rounded-lg shadow-lg p-4 flex items-center gap-3">
        <Loader2 className={`h-6 w-6 text-primary ${isLoading || isPending ? 'animate-spin' : ''}`} />
        <span className="text-sm font-medium">
          {isLoading ? 'Loading data...' : isPending ? 'Updating UI...' : ''}
        </span>
      </div>
    </div>
  );
};

export default TableLoadingOverlay;
