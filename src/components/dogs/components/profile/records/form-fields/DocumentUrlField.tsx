
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';

interface DocumentUrlFieldProps {
  form: UseFormReturn<any>;
  name?: string;
  label?: string;
  placeholder?: string;
}

const DocumentUrlField: React.FC<DocumentUrlFieldProps> = ({ 
  form,
  name = "document_url",
  label = "Document URL",
  placeholder = "https://example.com/document.pdf"
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              {...field}
              value={field.value || ''}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DocumentUrlField;
