
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface TimeTableHeaderProps {
  dogCount: number;
  currentDate: Date;
  isLoading: boolean;
  onRefresh: () => void;
  lastRefreshTime?: Date;
}

const TimeTableHeader: React.FC<TimeTableHeaderProps> = ({ 
  dogCount, 
  currentDate, 
  isLoading, 
  onRefresh,
  lastRefreshTime
}) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
      <div>
        <CardTitle className="text-xl flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Daily Care Time Table
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          {dogCount} dogs • {format(currentDate, 'EEEE, MMMM d, yyyy')}
          {lastRefreshTime && (
            <span className="ml-2 text-xs text-muted-foreground">
              Last updated: {format(lastRefreshTime, 'h:mm a')}
            </span>
          )}
        </p>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onRefresh}
        disabled={isLoading}
        className="gap-2"
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        {isLoading ? 'Refreshing...' : 'Refresh'}
      </Button>
    </CardHeader>
  );
};

export default TimeTableHeader;
