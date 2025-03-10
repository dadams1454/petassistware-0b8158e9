
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';

interface TextInputProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
}

const TextInput = ({ form, name, label, placeholder, required = false, type = 'text' }: TextInputProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}{required && '*'}</FormLabel>
          <FormControl>
            <Input type={type} placeholder={placeholder || label} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TextInput;
