
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PuppyFormValues } from '@/hooks/usePuppyForm';

interface HealthTabProps {
  form: UseFormReturn<PuppyFormValues>;
}

const HealthTab: React.FC<HealthTabProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="vaccination_dates"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vaccination Dates</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter vaccination dates" 
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
          name="deworming_dates"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deworming Dates</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter deworming dates" 
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
        name="vet_check_dates"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Vet Check Dates</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter vet check dates" 
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
        name="health_notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Health Notes</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter any health-related notes" 
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

export default HealthTab;
