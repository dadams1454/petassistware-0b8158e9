
import React from 'react';
import { format, parse } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';

interface DatePickerProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
}

const DatePicker = ({ form, name, label }: DatePickerProps) => {
  const handleCalendarSelect = (date: Date | undefined) => {
    form.setValue(`${name}`, date || null);
    if (date) {
      form.setValue(`${name}Str`, format(date, 'MM/dd/yyyy'));
    }
  };

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let dateStr = e.target.value;
    
    // Remove any non-digit characters
    const digitsOnly = dateStr.replace(/\D/g, '');
    
    // Format with slashes
    if (digitsOnly.length <= 2) {
      // Just the month part
      dateStr = digitsOnly;
    } else if (digitsOnly.length <= 4) {
      // Month and day part
      dateStr = `${digitsOnly.substring(0, 2)}/${digitsOnly.substring(2)}`;
    } else {
      // Full date
      dateStr = `${digitsOnly.substring(0, 2)}/${digitsOnly.substring(2, 4)}/${digitsOnly.substring(4, 8)}`;
    }
    
    form.setValue(`${name}Str`, dateStr);
    
    try {
      // Only try to parse when we have enough digits for a full date
      if (digitsOnly.length >= 8) {
        const parsedDate = parse(dateStr, 'MM/dd/yyyy', new Date());
        if (!isNaN(parsedDate.getTime())) {
          form.setValue(`${name}`, parsedDate);
        }
      } else if (dateStr === '') {
        form.setValue(`${name}`, null);
      }
    } catch (error) {
      console.error("Error parsing date:", error);
    }
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <div className="flex space-x-2">
            <FormField
              control={form.control}
              name={`${name}Str`}
              render={({ field: dateStrField }) => (
                <FormControl>
                  <Input 
                    placeholder="MM/DD/YYYY" 
                    value={dateStrField.value || ''}
                    onChange={handleDateInputChange}
                  />
                </FormControl>
              )}
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  type="button"
                  className="px-2"
                >
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50" align="start">
                <Calendar
                  mode="single"
                  selected={field.value || undefined}
                  onSelect={handleCalendarSelect}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DatePicker;
