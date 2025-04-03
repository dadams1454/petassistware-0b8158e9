
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import LitterDatePicker from '../LitterDatePicker';
import { Checkbox } from '@/components/ui/checkbox';
import { LitterFormData } from '../../hooks/types/litterFormTypes';

interface AKCRegistrationTabProps {
  form: UseFormReturn<LitterFormData>;
}

const AKCRegistrationTab: React.FC<AKCRegistrationTabProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="akc_litter_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>AKC Litter Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter AKC litter number" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="akc_registration_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>AKC Registration Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter AKC registration number" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LitterDatePicker
          form={form}
          name="akc_registration_date"
          label="AKC Registration Date"
        />
        
        <FormField
          control={form.control}
          name="akc_verified"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 bg-muted/50 rounded mt-8">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  AKC Verification Completed
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default AKCRegistrationTab;
