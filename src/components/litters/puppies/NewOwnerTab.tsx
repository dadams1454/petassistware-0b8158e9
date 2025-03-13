
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import TextInput from '@/components/dogs/form/TextInput';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { User, CircleDollarSign, CalendarClock } from 'lucide-react';
import { PuppyFormData } from './types';

interface NewOwnerTabProps {
  form: UseFormReturn<PuppyFormData>;
}

const NewOwnerTab: React.FC<NewOwnerTabProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <User className="h-5 w-5 text-primary" />
        <h3 className="text-sm font-medium">New Owner Information</h3>
      </div>
      
      <p className="text-sm text-muted-foreground">
        This is a simplified form for basic puppy sales information. For more comprehensive customer and sales management, we'll be adding dedicated features in a future update.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="sale_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                <CircleDollarSign className="h-3.5 w-3.5" />
                Sale Price
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter sale price"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value === '' ? null : e.target.value;
                    field.onChange(value);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      
      <p className="text-sm text-muted-foreground mt-6">
        New owner details will be handled in the upcoming Customer Management section where you can link puppies to customer records.
      </p>
    </div>
  );
};

export default NewOwnerTab;
