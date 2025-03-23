
import React from 'react';
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
  return (
    <div>
      <Label htmlFor="observation-date">Date & Time</Label>
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
            {observationDate ? format(observationDate, 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={observationDate}
            onSelect={(date) => date && setObservationDate(date)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateTimeSelector;
