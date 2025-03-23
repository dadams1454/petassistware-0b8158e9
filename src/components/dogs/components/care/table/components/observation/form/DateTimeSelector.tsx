
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DateTimeSelectorProps {
  observationDate: Date;
  setObservationDate: (date: Date) => void;
}

const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  observationDate,
  setObservationDate
}) => {
  // Format time for display
  const formatTimeForDisplay = (date: Date) => {
    return format(date, 'h:mm a');
  };

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const newDate = new Date(date);
      // Preserve the current time
      const hours = observationDate.getHours();
      const minutes = observationDate.getMinutes();
      newDate.setHours(hours, minutes);
      setObservationDate(newDate);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <div>
        <Label htmlFor="observation-date">Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="observation-date"
              className={cn(
                "w-full justify-start text-left font-normal",
                !observationDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(observationDate, 'MMM d, yyyy')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={observationDate}
              onSelect={handleDateSelect}
              initialFocus
              defaultMonth={observationDate}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Label htmlFor="observation-time">Time</Label>
        <Button
          variant="outline"
          id="observation-time"
          className="w-full justify-start text-left font-normal"
          onClick={() => {
            // Use current time on click
            const now = new Date();
            const newDate = new Date(observationDate);
            newDate.setHours(now.getHours(), now.getMinutes());
            setObservationDate(newDate);
          }}
        >
          <Clock className="mr-2 h-4 w-4" />
          {formatTimeForDisplay(observationDate)}
        </Button>
      </div>
    </div>
  );
};

export default DateTimeSelector;
