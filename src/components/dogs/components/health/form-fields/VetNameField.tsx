
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export interface VetNameFieldProps {
  form: UseFormReturn<any>;
}

const VetNameField: React.FC<VetNameFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="vet_name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Veterinarian Name</FormLabel>
          <FormControl>
            <Input placeholder="Enter veterinarian name" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default VetNameField;
