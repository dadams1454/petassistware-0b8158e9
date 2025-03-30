
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PuppyFormValues } from '@/hooks/usePuppyForm';

interface NewOwnerTabProps {
  form: UseFormReturn<PuppyFormValues>;
}

const NewOwnerTab: React.FC<NewOwnerTabProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="sale_price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sale Price ($)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="Enter sale price" 
                {...field} 
                value={field.value || ''} 
                onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Notes</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter any additional notes about the puppy or new owner" 
                className="min-h-[100px]" 
                {...field} 
                value={field.value || ''} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default NewOwnerTab;
