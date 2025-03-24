
import React from 'react';
import { format, differenceInDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { RefreshCw, Info, AlertTriangle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TimeTableFooterProps {
  isLoading?: boolean;
  onRefresh?: (() => void) | null;
  currentDate?: Date;
  lastUpdateTime?: string;
  activeDogsCount?: number;
  upcomingHealthChecks?: number;
  specialHandlingCount?: number;
}

const TimeTableFooter: React.FC<TimeTableFooterProps> = ({ 
  isLoading = false, 
  onRefresh, 
  currentDate = new Date(),
  lastUpdateTime,
  activeDogsCount = 0,
  upcomingHealthChecks = 0,
  specialHandlingCount = 0
}) => {
  const dateDifference = differenceInDays(new Date(), currentDate);
  const isHistoricalView = dateDifference > 0;
  const isFutureView = dateDifference < 0;
  
  return (
    <div className="flex flex-wrap justify-between items-center text-xs text-gray-500 dark:text-gray-400 p-2 border-t">
      <div className="flex flex-wrap items-center gap-4">
        {isHistoricalView && (
          <div className="text-amber-500 dark:text-amber-400 font-medium flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            <span>Viewing historical data ({dateDifference} {dateDifference === 1 ? 'day' : 'days'} ago)</span>
          </div>
        )}
        
        {isFutureView && (
          <div className="text-blue-500 dark:text-blue-400 font-medium flex items-center gap-1">
            <Info className="h-3 w-3" />
            <span>Viewing future data ({Math.abs(dateDifference)} {Math.abs(dateDifference) === 1 ? 'day' : 'days'} ahead)</span>
          </div>
        )}
        
        {activeDogsCount > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1">
                <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                  {activeDogsCount} active {activeDogsCount === 1 ? 'dog' : 'dogs'}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Total number of active dogs in the system</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {upcomingHealthChecks > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1">
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-0.5 rounded-full">
                  {upcomingHealthChecks} upcoming {upcomingHealthChecks === 1 ? 'health check' : 'health checks'}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Health checks scheduled in the next 7 days</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {specialHandlingCount > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1">
                <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 px-2 py-0.5 rounded-full">
                  {specialHandlingCount} {specialHandlingCount === 1 ? 'dog' : 'dogs'} need special handling
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Dogs that require special attention or care</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        {lastUpdateTime && (
          <span className="text-xs opacity-75">
            Last updated: {format(new Date(lastUpdateTime), 'h:mm a')}
          </span>
        )}
        
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
    </div>
  );
};

export default TimeTableFooter;
