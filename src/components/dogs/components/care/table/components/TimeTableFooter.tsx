
import React from 'react';
import { format } from 'date-fns';
import { Clock, Calendar } from 'lucide-react';

interface TimeTableFooterProps {
  lastUpdateTime?: string;
  currentDate?: Date;
}

const TimeTableFooter: React.FC<TimeTableFooterProps> = ({ 
  lastUpdateTime = new Date().toLocaleTimeString(),
  currentDate = new Date()
}) => {
  return (
    <div className="flex flex-wrap justify-between items-center text-xs text-gray-500 dark:text-gray-400">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>Last updated: {lastUpdateTime}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>Data for: {format(currentDate, 'MMMM d, yyyy')}</span>
        </div>
        {currentDate.toDateString() !== new Date().toDateString() && (
          <div className="text-amber-500 dark:text-amber-400 font-medium">
            Viewing data from a different date
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeTableFooter;
