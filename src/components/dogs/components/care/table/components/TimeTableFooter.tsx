
import React from 'react';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';

interface TimeTableFooterProps {
  isLoading: boolean;
  onRefresh: () => void;
  lastUpdateTime: string;
  currentDate: Date;
}

/**
 * Footer for the time table with refresh status
 */
const TimeTableFooter: React.FC<TimeTableFooterProps> = ({
  isLoading,
  onRefresh,
  lastUpdateTime,
  currentDate
}) => {
  return (
    <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 px-1">
      <div className="flex items-center gap-1">
        <Info className="h-3 w-3" />
        <span className="hidden sm:inline">
          {isLoading ? 'Refreshing data...' : `Last updated: ${lastUpdateTime}`}
        </span>
        <span className="sm:hidden">
          {isLoading ? 'Refreshing...' : `Updated: ${lastUpdateTime}`}
        </span>
      </div>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-6 text-xs"
        onClick={onRefresh}
      >
        Manual Refresh
      </Button>
    </div>
  );
};

export default TimeTableFooter;
