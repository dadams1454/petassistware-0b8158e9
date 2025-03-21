
import React from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { Clock, Calendar } from 'lucide-react';

interface DailyCareHeaderProps {
  dogCount: number;
  isLoading: boolean;
  lastRefresh: Date;
  currentDate: Date;
}

const DailyCareHeader: React.FC<DailyCareHeaderProps> = ({
  dogCount,
  isLoading,
  lastRefresh,
  currentDate
}) => {
  const formattedLastRefresh = format(lastRefresh, 'h:mm a');
  const timeAgo = formatDistanceToNow(lastRefresh, { addSuffix: true });

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
        Daily Care Time Table
      </h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400 flex items-center flex-wrap">
        <span className="mr-2">Track potty breaks, feeding, medications and exercise</span>
        <span className="mr-2">{isLoading ? ' (Loading...)' : ` (${dogCount} dogs)`}</span>
        <span className="ml-2 text-xs flex items-center gap-1 text-slate-400">
          <Clock className="h-3 w-3" />
          Auto-refreshes every 30 minutes • Last refresh: {formattedLastRefresh} ({timeAgo})
        </span>
        <span className="ml-2 text-xs flex items-center gap-1 text-slate-400">
          <Calendar className="h-3 w-3" />
          {format(currentDate, 'PPPP')}
        </span>
      </p>
    </div>
  );
};

export default DailyCareHeader;
