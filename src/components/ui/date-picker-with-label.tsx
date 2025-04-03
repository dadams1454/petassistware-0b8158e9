
import React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Calendar } from './calendar';
import { Label } from './label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './popover';

interface DatePickerWithLabelProps {
  label: string;
  date?: Date;
  onSelect: (date: Date) => void;
  placeholder?: string;
  error?: string;
}

export const DatePickerWithLabel: React.FC<DatePickerWithLabelProps> = ({
  label,
  date,
  onSelect,
  placeholder = "Select a date",
  error,
}) => {
  const pickerId = label.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className="space-y-2">
      <Label htmlFor={pickerId}>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={pickerId}
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
              error && "border-red-500"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
