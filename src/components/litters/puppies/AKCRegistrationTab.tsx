
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PuppyFormValues } from '@/hooks/usePuppyForm';

interface AKCRegistrationTabProps {
  form: UseFormReturn<PuppyFormValues>;
}

const AKCRegistrationTab: React.FC<AKCRegistrationTabProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="akc_litter_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>AKC Litter Number</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter AKC litter number" 
                  {...field} 
                  value={field.value || ''} 
                />
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
                <Input 
                  placeholder="Enter AKC registration number" 
                  {...field} 
                  value={field.value || ''} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="microchip_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Microchip Number</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter microchip number" 
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

export default AKCRegistrationTab;
