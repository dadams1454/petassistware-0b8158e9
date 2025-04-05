
import React from 'react';
import { useFormContext, UseFormReturn } from 'react-hook-form';
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface TitleFieldProps {
  disabled?: boolean;
  form: UseFormReturn<any>;
}

const TitleField: React.FC<TitleFieldProps> = ({ disabled = false, form }) => {
  return (
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Title</FormLabel>
          <FormControl>
            <Input 
              placeholder="Enter a title for this record"
              disabled={disabled}
              {...field}
              value={field.value || ''}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default TitleField;
