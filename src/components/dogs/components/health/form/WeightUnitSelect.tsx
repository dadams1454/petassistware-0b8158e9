
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { WeightUnit, weightUnits } from '@/types/common';

interface WeightUnitSelectProps {
  form: UseFormReturn<any>;
  label?: string;
  name?: string;
  defaultValue?: WeightUnit;
}

export const WeightUnitSelect: React.FC<WeightUnitSelectProps> = ({
  form,
  label = 'Unit',
  name = 'unit',
  defaultValue = 'lb'
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      defaultValue={defaultValue}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {weightUnits.map((unit) => (
                <SelectItem key={unit.code} value={unit.code}>
                  {unit.name}
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
