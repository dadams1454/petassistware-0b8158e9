
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const AkcIdentificationTab = ({ form }: { form: any }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="akc_litter_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>AKC Litter Number</FormLabel>
            <FormControl>
              <Input placeholder="Enter AKC litter number" {...field} />
            </FormControl>
            <FormDescription>
              The AKC assigned litter registration number
            </FormDescription>
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
              <Input placeholder="Enter AKC registration number if available" {...field} />
            </FormControl>
            <FormDescription>
              Individual puppy AKC registration number (if already assigned)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="microchip_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Microchip Number</FormLabel>
            <FormControl>
              <Input placeholder="Enter microchip number if available" {...field} />
            </FormControl>
            <FormDescription>
              Unique microchip identification number (if already chipped)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default AkcIdentificationTab;
