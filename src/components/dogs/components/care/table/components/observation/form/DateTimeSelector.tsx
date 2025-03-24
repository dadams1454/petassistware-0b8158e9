
import React, { memo } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DateTimeSelectorProps {
  observationDate: Date;
  setObservationDate: (date: Date) => void;
}

const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  observationDate,
  setObservationDate
}) => {
  // When a new date is selected from the calendar, preserve the time
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    // Create a new date with the selected date but preserve the current time
    const newDate = new Date(date);
    newDate.setHours(
      observationDate.getHours(),
      observationDate.getMinutes(),
      observationDate.getSeconds()
    );
    
    setObservationDate(newDate);
  };

  return (
    <div>
      <Label htmlFor="observation-date">Date</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="observation-date"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !observationDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(observationDate, 'MMMM d, yyyy')}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={observationDate}
            onSelect={handleDateSelect}
            initialFocus
            defaultMonth={observationDate}
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(DateTimeSelector);
