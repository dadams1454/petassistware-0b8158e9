
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Clock } from 'lucide-react';

interface TimeTableFooterProps {
  isLoading?: boolean;
  onRefresh?: () => void;
  lastUpdateTime?: string;
}

const TimeTableFooter: React.FC<TimeTableFooterProps> = ({ 
  isLoading = false, 
  onRefresh,
  lastUpdateTime = new Date().toLocaleTimeString()
}) => {
  return (
    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
      <div className="flex items-center gap-2">
        <Clock className="h-3 w-3" />
        <span>Last updated: {lastUpdateTime}</span>
      </div>
      
      {onRefresh && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onRefresh}
          disabled={isLoading}
          className="text-xs h-7 px-2"
        >
          <RefreshCw className={`h-3 w-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      )}
    </div>
  );
};

export default TimeTableFooter;
