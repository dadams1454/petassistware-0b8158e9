
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';

interface DocumentUrlFieldProps {
  form: UseFormReturn<any>;
}

const DocumentUrlField: React.FC<DocumentUrlFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="document_url"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Document URL</FormLabel>
          <FormControl>
            <Input placeholder="Link to document or image" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DocumentUrlField;
