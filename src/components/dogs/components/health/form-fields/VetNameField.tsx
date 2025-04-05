
import React from 'react';
import { useFormContext, UseFormReturn } from 'react-hook-form';
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface VetNameFieldProps {
  disabled?: boolean;
  form: UseFormReturn<any>;
}

const VetNameField: React.FC<VetNameFieldProps> = ({ disabled = false, form }) => {
  return (
    <FormField
      control={form.control}
      name="vet_name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Veterinarian</FormLabel>
          <FormControl>
            <Input 
              placeholder="Enter veterinarian name"
              disabled={disabled}
              {...field}
              value={field.value || ''}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default VetNameField;
