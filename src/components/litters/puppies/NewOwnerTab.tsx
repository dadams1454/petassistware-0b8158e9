import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

const NewOwnerTab: React.FC = () => {
  const form = useFormContext();

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="current_weight"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sale Price</FormLabel>
            <FormControl>
              <Input {...field} type="number" placeholder="Enter sale price" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default NewOwnerTab;
