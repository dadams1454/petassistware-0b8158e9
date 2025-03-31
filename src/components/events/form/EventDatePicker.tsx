
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FormComponentProps } from './types';

const EventDatePicker: React.FC<FormComponentProps> = ({ form }) => {
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
