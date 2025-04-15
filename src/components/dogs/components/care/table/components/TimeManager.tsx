
import React from 'react';
import { format, formatDistanceToNow } from 'date-fns';

interface TimeManagerProps {
  lastTime: string | Date;
  frequency?: string;
  showTime?: boolean;
  showFrequency?: boolean;
  formatString?: string;
}

const TimeManager: React.FC<TimeManagerProps> = ({
  lastTime,
  frequency,
  showTime = false,
  showFrequency = true,
  formatString = 'MMM d, yyyy'
}) => {
  // Parse the date if it's a string
  const date = typeof lastTime === 'string' ? new Date(lastTime) : lastTime;
  
  // Format the date
  const formattedDate = format(date, formatString);
  
  // Get the relative time
  const relativeTime = formatDistanceToNow(date, { addSuffix: true });
  
  return (
    <div className="flex flex-col">
      <span className="text-sm">{formattedDate}</span>
      
      <div className="flex flex-col text-xs text-muted-foreground">
        <span>{relativeTime}</span>
        {showFrequency && frequency && (
          <span className="text-xs italic">Frequency: {frequency}</span>
        )}
      </div>
    </div>
  );
};

export default TimeManager;
