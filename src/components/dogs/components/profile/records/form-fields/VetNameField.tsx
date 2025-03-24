
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';

interface VetNameFieldProps {
  form: UseFormReturn<any>;
  label?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
}

const VetNameField: React.FC<VetNameFieldProps> = ({ 
  form, 
  label = "Veterinarian", 
  placeholder = "Dr. Smith", 
  description,
  required = false,
  disabled = false
}) => {
  return (
    <FormField
      control={form.control}
      name="vet_name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}{required && <span className="text-destructive ml-1">*</span>}</FormLabel>
          <FormControl>
            <Input 
              placeholder={placeholder} 
              {...field} 
              disabled={disabled}
              className={disabled ? "opacity-70 cursor-not-allowed" : ""}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default VetNameField;
