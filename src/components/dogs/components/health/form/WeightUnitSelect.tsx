
import React from 'react';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { WeightEntryValues } from './useWeightEntryForm';
import { weightUnits } from '@/types/common';

interface WeightUnitSelectProps {
  form: UseFormReturn<WeightEntryValues>;
}

const WeightUnitSelect: React.FC<WeightUnitSelectProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="unit"
      render={({ field }) => (
        <FormItem className="w-1/3">
          <FormControl>
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                {weightUnits.map((unit) => (
                  <SelectItem key={unit.code} value={unit.code}>
                    {unit.name} ({unit.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default WeightUnitSelect;
