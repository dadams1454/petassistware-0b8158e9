
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { DatePicker } from '@/components/ui/date-picker';

export interface NextDueDateFieldProps {
  form: UseFormReturn<any>;
}

const NextDueDateField: React.FC<NextDueDateFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="next_due_date"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Next Due Date (optional)</FormLabel>
          <DatePicker
            value={field.value}
            onChange={field.onChange}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default NextDueDateField;
