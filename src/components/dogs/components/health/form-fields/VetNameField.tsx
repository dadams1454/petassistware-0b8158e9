
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
  form?: UseFormReturn<any>;
  required?: boolean;
  className?: string;
}

const VetNameField: React.FC<VetNameFieldProps> = ({
  disabled = false,
  form,
  required = false,
  className
}) => {
  const formContext = useFormContext();
  const formToUse = form || formContext;

  return (
    <FormField
      control={formToUse.control}
      name="vet_name"
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{required ? "Veterinarian*" : "Veterinarian"}</FormLabel>
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
