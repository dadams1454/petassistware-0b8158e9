
import React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { TimePickerDemo } from '@/components/ui/time-picker';

interface DateTimeSelectorProps {
  observationDate: Date;
  setObservationDate: (date: Date) => void;
}

const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  observationDate,
  setObservationDate
}) => {
  // Handle date change from calendar
  const handleDateChange = (date: Date | undefined) => {
    if (!date) return;
    
    // Preserve the current time when changing the date
    const newDate = new Date(date);
    newDate.setHours(
      observationDate.getHours(),
      observationDate.getMinutes(),
      observationDate.getSeconds(),
      observationDate.getMilliseconds()
    );
    
    setObservationDate(newDate);
  };
  
  // Handle time change from time picker
  const handleTimeChange = (hours: number, minutes: number) => {
    const newDate = new Date(observationDate);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    setObservationDate(newDate);
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor="observation-date">Date & Time</Label>
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="observation-date"
              variant="outline"
              className={cn(
                "flex-1 justify-start text-left font-normal",
                !observationDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {observationDate ? format(observationDate, 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={observationDate}
              onSelect={handleDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[120px] justify-start text-left font-normal",
                !observationDate && "text-muted-foreground"
              )}
            >
              <Clock className="mr-2 h-4 w-4" />
              {format(observationDate, 'h:mm a')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4" align="start">
            <TimePickerDemo 
              setHours={(hours) => handleTimeChange(hours, observationDate.getMinutes())}
              setMinutes={(minutes) => handleTimeChange(observationDate.getHours(), minutes)}
              date={observationDate}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DateTimeSelector;
