
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
  form?: UseFormReturn<any>;
  required?: boolean;
  className?: string;
}

const TitleField: React.FC<TitleFieldProps> = ({ 
  disabled = false, 
  form,
  required = false,
  className
}) => {
  const formContext = useFormContext();
  const formToUse = form || formContext;
  
  return (
    <FormField
      control={formToUse.control}
      name="title"
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{required ? "Title*" : "Title"}</FormLabel>
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
