
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExpenseFormSchema } from './FormSchema';

interface RelatedEntityFieldsProps {
  form: UseFormReturn<ExpenseFormSchema>;
  dogs: { id: string; name: string }[];
  puppies: { id: string; name: string }[];
}

const RelatedEntityFields: React.FC<RelatedEntityFieldsProps> = ({ form, dogs, puppies }) => {
  return (
    <>
      {dogs.length > 0 && (
        <FormField
          control={form.control}
          name="dog_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Related Dog (Optional)</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value || ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a dog" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {dogs.map((dog) => (
                    <SelectItem key={dog.id} value={dog.id}>
                      {dog.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      
      {puppies.length > 0 && (
        <FormField
          control={form.control}
          name="puppy_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Related Puppy (Optional)</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value || ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a puppy" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {puppies.map((puppy) => (
                    <SelectItem key={puppy.id} value={puppy.id}>
                      {puppy.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
};

export default RelatedEntityFields;
