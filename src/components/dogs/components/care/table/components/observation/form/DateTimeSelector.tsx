
import React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  
  // Handle hour selection
  const handleHourChange = (value: string) => {
    const hour = parseInt(value, 10);
    const newDate = new Date(observationDate);
    newDate.setHours(hour);
    setObservationDate(newDate);
  };
  
  // Handle minute selection
  const handleMinuteChange = (value: string) => {
    const minute = parseInt(value, 10);
    const newDate = new Date(observationDate);
    newDate.setMinutes(minute);
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
          <PopoverContent className="flex w-auto p-4" align="start">
            <div className="flex gap-2">
              {/* Hour selector */}
              <Select value={observationDate.getHours().toString()} onValueChange={handleHourChange}>
                <SelectTrigger className="w-20">
                  <SelectValue placeholder="Hour" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {i.toString().padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <span className="flex items-center">:</span>
              
              {/* Minute selector */}
              <Select 
                value={observationDate.getMinutes().toString()} 
                onValueChange={handleMinuteChange}
              >
                <SelectTrigger className="w-20">
                  <SelectValue placeholder="Min" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 60 }, (_, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {i.toString().padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DateTimeSelector;
