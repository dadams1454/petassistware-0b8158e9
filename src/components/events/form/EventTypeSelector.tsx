
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EVENT_TYPES } from '@/pages/Calendar';
import { FormComponentProps } from './types';

const EventTypeSelector: React.FC<FormComponentProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="event_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Event Type</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {EVENT_TYPES.map(type => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default EventTypeSelector;
