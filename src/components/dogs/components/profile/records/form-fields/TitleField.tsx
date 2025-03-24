
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';

interface TitleFieldProps {
  form: UseFormReturn<any>;
  label?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
}

const TitleField: React.FC<TitleFieldProps> = ({ 
  form, 
  label = "Title", 
  placeholder = "Annual Check-up", 
  description,
  required = false,
  disabled = false
}) => {
  return (
    <FormField
      control={form.control}
      name="title"
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

export default TitleField;
