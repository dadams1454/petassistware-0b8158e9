
import React from 'react';
import { Clock } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface RefreshIndicatorProps {
  refreshInterval: number;
  lastRefresh?: Date;
}

const RefreshIndicator: React.FC<RefreshIndicatorProps> = ({ 
  refreshInterval,
  lastRefresh = new Date() 
}) => {
  const formattedRefreshTime = lastRefresh ? format(lastRefresh, 'h:mm a') : '';
  const timeAgo = lastRefresh ? formatDistanceToNow(lastRefresh, { addSuffix: true }) : '';
  
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-md px-3 py-1.5 w-fit">
      <Clock className="h-3 w-3" />
      <span>Auto-refreshes every {refreshInterval} minutes</span>
      {lastRefresh && (
        <>
          <span className="mx-1">•</span>
          <span>Last refreshed: {formattedRefreshTime} ({timeAgo})</span>
        </>
      )}
    </div>
  );
};

export default RefreshIndicator;
