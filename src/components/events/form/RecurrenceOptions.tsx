
import React, { useState, useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { FormComponentProps } from './types';

interface RecurrenceOptionsProps extends FormComponentProps {}

const RecurrenceOptions: React.FC<RecurrenceOptionsProps> = ({ form }) => {
  const [isRecurring, setIsRecurring] = useState(form.getValues('is_recurring') || false);
  
  // Enable/disable recurrence fields based on switch value
  useEffect(() => {
    if (!isRecurring) {
      form.setValue('recurrence_pattern', null);
      form.setValue('recurrence_end_date', null);
    } else if (!form.getValues('recurrence_pattern')) {
      form.setValue('recurrence_pattern', 'weekly');
    }
  }, [isRecurring, form]);

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="is_recurring"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Recurring Event</FormLabel>
              <FormDescription>
                Set this event to repeat on a schedule
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  setIsRecurring(checked);
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {isRecurring && (
        <div className="border rounded-md p-4 space-y-4">
          <FormField
            control={form.control}
            name="recurrence_pattern"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recurrence Pattern</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || 'weekly'}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pattern" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="recurrence_end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    value={field.value || ''}
                    min={form.getValues('event_date')}
                  />
                </FormControl>
                <FormDescription>
                  Leave blank for indefinite recurrence
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default RecurrenceOptions;
