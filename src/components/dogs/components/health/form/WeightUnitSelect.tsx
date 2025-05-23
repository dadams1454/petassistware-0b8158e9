
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { WeightUnit, weightUnitInfos } from '@/types/weight-units';

interface WeightUnitSelectProps {
  form: UseFormReturn<any>;
  label?: string;
  name?: string;
  defaultValue?: WeightUnit;
}

export const WeightUnitSelect: React.FC<WeightUnitSelectProps> = ({
  form,
  label = 'Unit',
  name = 'weight_unit', // Changed from 'unit' to 'weight_unit' to match our types
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
              {weightUnitInfos.map((info) => (
                <SelectItem key={info.id} value={info.id}>
                  {info.label}
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
