
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { LitterFormData } from '../../hooks/types/litterFormTypes';

interface BreedingDetailsTabProps {
  form: UseFormReturn<LitterFormData>;
}

const BreedingDetailsTab: React.FC<BreedingDetailsTabProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="breeding_notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Breeding Notes</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter breeding notes" 
                className="min-h-[120px]" 
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
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>General Notes</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter general notes" 
                className="min-h-[120px]" 
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

export default BreedingDetailsTab;
