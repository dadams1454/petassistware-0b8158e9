
import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface TimeTableFooterProps {
  isLoading?: boolean;
  onRefresh?: (() => void) | null;
  currentDate?: Date;
  lastUpdateTime?: string;
}

const TimeTableFooter: React.FC<TimeTableFooterProps> = ({ 
  isLoading = false, 
  onRefresh, 
  currentDate = new Date(),
  lastUpdateTime
}) => {
  return (
    <div className="flex flex-wrap justify-between items-center text-xs text-gray-500 dark:text-gray-400 p-2 border-t">
      <div className="flex items-center gap-4">
        {currentDate.toDateString() !== new Date().toDateString() && (
          <div className="text-amber-500 dark:text-amber-400 font-medium">
            Viewing data from a different date
          </div>
        )}
      </div>
      
      {onRefresh && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="text-xs"
        >
          <RefreshCw className={`h-3 w-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      )}
    </div>
  );
};

export default TimeTableFooter;
