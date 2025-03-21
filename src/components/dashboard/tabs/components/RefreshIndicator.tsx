
import React from 'react';
import { Clock } from 'lucide-react';

interface RefreshIndicatorProps {
  refreshInterval?: number; // in minutes
}

const RefreshIndicator: React.FC<RefreshIndicatorProps> = ({ refreshInterval = 30 }) => {
  return (
    <div className="flex items-center justify-end">
      <span className="text-xs flex items-center gap-1 text-slate-500 dark:text-slate-400">
        <Clock className="h-3 w-3" />
        Auto-refreshes every {refreshInterval} minutes
      </span>
    </div>
  );
};

export default RefreshIndicator;
