
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Dog, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

interface TimeTableHeaderProps {
  dogCount: number;
  currentDate: Date;
  isLoading: boolean;
  onRefresh: () => void;
}

const TimeTableHeader: React.FC<TimeTableHeaderProps> = ({ 
  dogCount, 
  currentDate, 
  isLoading, 
  onRefresh 
}) => {
  return (
    <CardHeader className="pb-2">
      <div className="flex justify-between items-center">
        <CardTitle className="text-xl flex items-center">
          <Dog className="h-5 w-5 mr-2" />
          Dog Potty Break Log
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({dogCount} dogs)
          </span>
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">
              {format(currentDate, 'MM/dd/yyyy')}
            </span>
          </div>
          <Button 
            size="sm"
            variant="outline"
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </Button>
        </div>
      </div>
    </CardHeader>
  );
};

export default TimeTableHeader;
