
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { NewEvent } from '@/pages/Calendar';

interface EventDatePickerProps {
  form: UseFormReturn<NewEvent>;
}

const EventDatePicker: React.FC<EventDatePickerProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="event_date"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Event Date</FormLabel>
          <FormControl>
            <Input type="date" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default EventDatePicker;
