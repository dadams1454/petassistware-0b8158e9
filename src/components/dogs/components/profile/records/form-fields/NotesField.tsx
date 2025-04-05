
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';

interface NotesFieldProps {
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
              placeholder="Add any relevant notes or observations" 
              className="min-h-[100px]"
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
