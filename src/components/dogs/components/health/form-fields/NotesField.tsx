
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

export interface NotesFieldProps {
  form: UseFormReturn<any>;
}

const NotesField: React.FC<NotesFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="record_notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Notes</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Enter any additional notes or observations" 
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default NotesField;
