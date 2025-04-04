
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';

interface TextareaInputProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
}

const TextareaInput = ({ form, name, label, placeholder, className }: TextareaInputProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder || `Enter ${label.toLowerCase()}`}
              className="min-h-24"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TextareaInput;
