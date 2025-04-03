
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

interface NotesFieldProps {
  form: any;
  name?: string;
  label?: string;
  placeholder?: string;
}

const NotesField: React.FC<NotesFieldProps> = ({ 
  form, 
  name = "record_notes", 
  label = "Notes",
  placeholder = "Enter any additional notes about the record"
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              className="resize-none min-h-[100px]"
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
