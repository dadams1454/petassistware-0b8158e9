
import React from 'react';

interface TableContainerProps {
  children: React.ReactNode;
  activeCategory: string;
  dogsCount: number;
  isMobile?: boolean;
  onRefresh: () => void;
}

const TableContainer: React.FC<TableContainerProps> = ({ 
  children, 
  activeCategory,
  dogsCount,
  isMobile = false,
  onRefresh 
}) => {
  return (
    <div className="w-full overflow-auto border rounded-md relative">
      <div className="sticky left-0 z-10 bg-background px-4 py-2 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {activeCategory === 'pottybreaks' ? 'Potty Break Schedule' : 'Feeding Schedule'}
          </span>
          <span className="text-xs text-muted-foreground">{dogsCount} dogs</span>
        </div>
        {isMobile && (
          <button 
            onClick={onRefresh}
            className="text-xs text-primary"
          >
            Refresh
          </button>
        )}
      </div>
      <div className={`${isMobile ? 'overflow-x-auto' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default TableContainer;
