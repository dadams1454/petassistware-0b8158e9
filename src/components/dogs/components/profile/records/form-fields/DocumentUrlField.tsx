
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface DocumentUrlFieldProps {
  form: any;
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
            <Input
              placeholder="https://example.com/document.pdf"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DocumentUrlField;
