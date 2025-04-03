
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WeightUnit } from '@/types/health';
import { WeightEntryValues } from '../hooks/useWeightEntryForm';
import { weightUnits } from '@/components/litters/puppies/weight/weightUnits';

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
          <FormLabel>Unit</FormLabel>
          <Select
            value={field.value}
            onValueChange={field.onChange}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {weightUnits.map(unit => (
                <SelectItem key={unit.value} value={unit.value as WeightUnit}>
                  {unit.label}
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

export default WeightUnitSelect;
