
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export interface DocumentUrlFieldProps {
  form: UseFormReturn<any>;
}

const DocumentUrlField: React.FC<DocumentUrlFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="document_url"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Document URL (optional)</FormLabel>
          <FormControl>
            <Input placeholder="Enter document URL" {...field} />
          </FormControl>
          <FormDescription>
            Upload related documents and paste the URL here
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DocumentUrlField;
