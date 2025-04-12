
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { DatePicker } from '@/components/ui/date-picker';

export interface VisitDateFieldProps {
  form: UseFormReturn<any>;
}

const VisitDateField: React.FC<VisitDateFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="visit_date"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Visit Date</FormLabel>
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

export default VisitDateField;
