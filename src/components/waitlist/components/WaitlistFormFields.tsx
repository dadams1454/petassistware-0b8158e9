
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import CustomerSelector from '@/components/communications/CustomerSelector';
import { Customer } from '@/components/customers/types/customer';
import { UseFormReturn } from 'react-hook-form';
import { WaitlistFormValues } from '../schemas/waitlistFormSchema';

interface WaitlistFormFieldsProps {
  form: UseFormReturn<WaitlistFormValues>;
  selectedCustomer: Customer | null;
  handleCustomerSelected: (customer: Customer) => void;
  colorOptions?: string[];
  readOnlyCustomer?: boolean;
}

const WaitlistFormFields: React.FC<WaitlistFormFieldsProps> = ({
  form,
  selectedCustomer,
  handleCustomerSelected,
  colorOptions,
  readOnlyCustomer = false
}) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="customer_id"
        render={() => (
          <FormItem>
            <FormLabel>Customer</FormLabel>
            <CustomerSelector 
              onCustomerSelected={handleCustomerSelected}
              defaultValue={selectedCustomer}
              disabled={readOnlyCustomer}
            />
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="gender_preference"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gender Preference (optional)</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value || ''}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="No preference" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="">No preference</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="color_preference"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Color Preference (optional)</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value || ''}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="No preference" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="">No preference</SelectItem>
                {colorOptions?.map(color => (
                  <SelectItem key={color} value={color}>
                    {color}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Notes (optional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Add any additional notes or customer preferences..."
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

export default WaitlistFormFields;
