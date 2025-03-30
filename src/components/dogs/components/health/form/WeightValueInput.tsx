
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { WeightEntryValues } from '../hooks/useWeightEntryForm';

interface WeightValueInputProps {
  form: UseFormReturn<WeightEntryValues>;
}

const WeightValueInput: React.FC<WeightValueInputProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="weight"
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormLabel>Weight</FormLabel>
          <FormControl>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="Enter weight"
              {...field}
              onChange={(e) => {
                const value = e.target.value ? parseFloat(e.target.value) : '';
                field.onChange(value);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default WeightValueInput;
