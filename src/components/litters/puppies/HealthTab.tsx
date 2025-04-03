
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { FormDescription } from '@/components/ui/form';

// We need to use the properly exported type from the puppy form
import { UseFormReturn } from 'react-hook-form';
import { PuppyFormValues } from '@/hooks/usePuppyForm';

interface HealthTabProps {
  form: UseFormReturn<PuppyFormValues>;
}

const HealthTab: React.FC<HealthTabProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 grid-cols-1">
        <FormField
          control={form.control}
          name="health_notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Health Notes</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Important health information, observations, or special needs" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="vaccination_dates"
          render={({ field: { value, ...rest }}) => (
            <FormItem>
              <FormLabel>Vaccination Records</FormLabel>
              <FormControl>
                <Textarea 
                  {...rest}
                  value={value || ''}
                  placeholder="Record of vaccinations: dates, types, etc." 
                />
              </FormControl>
              <FormDescription>
                Enter dates and details of vaccinations
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="deworming_dates"
          render={({ field: { value, ...rest }}) => (
            <FormItem>
              <FormLabel>Deworming Schedule</FormLabel>
              <FormControl>
                <Textarea 
                  {...rest}
                  value={value || ''}
                  placeholder="Record of deworming: dates, medication used, etc." 
                />
              </FormControl>
              <FormDescription>
                Enter dates and details of deworming treatments
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="vet_check_dates"
          render={({ field: { value, ...rest }}) => (
            <FormItem>
              <FormLabel>Veterinary Check-ups</FormLabel>
              <FormControl>
                <Textarea 
                  {...rest}
                  value={value || ''}
                  placeholder="Dates and notes from veterinary examinations" 
                />
              </FormControl>
              <FormDescription>
                Enter dates and details of vet visits
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default HealthTab;
