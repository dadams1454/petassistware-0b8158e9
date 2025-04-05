
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';

interface VetNameFieldProps {
  form: UseFormReturn<any>;
}

const VetNameField: React.FC<VetNameFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="vet_name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Veterinarian</FormLabel>
          <FormControl>
            <Input placeholder="Veterinarian name" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default VetNameField;
