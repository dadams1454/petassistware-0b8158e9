
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { NewEvent } from '@/pages/Calendar';

interface RecurrenceOptionsProps {
  form: UseFormReturn<NewEvent>;
}

const RecurrenceOptions: React.FC<RecurrenceOptionsProps> = ({ form }) => {
  const recurrencePatterns = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Every two weeks' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Every three months' },
    { value: 'yearly', label: 'Yearly' }
  ];

  // Get is_recurring value from form
  const isRecurring = form.watch('is_recurring');

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="is_recurring"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <FormLabel>Recurring Event</FormLabel>
              <FormDescription>
                Does this event repeat on a schedule?
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {isRecurring && (
        <div className="space-y-4 border rounded-lg p-3">
          <FormField
            control={form.control}
            name="recurrence_pattern"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recurrence Pattern</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || ''}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pattern" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {recurrencePatterns.map(pattern => (
                      <SelectItem key={pattern.value} value={pattern.value}>
                        {pattern.label}
                      </SelectItem>
                    ))}
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
                  />
                </FormControl>
                <FormDescription>
                  Leave blank if the event recurs indefinitely
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
