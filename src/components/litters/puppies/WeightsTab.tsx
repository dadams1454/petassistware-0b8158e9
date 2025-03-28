
import React from 'react';
import { z } from 'zod';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import WeightTracker from './weight/WeightTracker';

interface WeightsTabProps {
  form: UseFormReturn<any>;
  puppyId?: string;
  showFullTracker?: boolean;
}

const WeightsTab: React.FC<WeightsTabProps> = ({ 
  form, 
  puppyId,
  showFullTracker = false 
}) => {
  return (
    <div className="space-y-4">
      {/* Basic weight form fields */}
      <div className="grid md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="birth_weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birth Weight (oz)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter birth weight" 
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
          name="current_weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Weight (oz)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter current weight" 
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
        name="weight_notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Weight Notes</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter any notes about weight or growth patterns" 
                className="min-h-[100px]" 
                {...field} 
                value={field.value || ''} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Only show the full weight tracker if we have a puppyId and showFullTracker is true */}
      {puppyId && showFullTracker && (
        <div className="mt-8">
          <WeightTracker puppyId={puppyId} />
        </div>
      )}
    </div>
  );
};

export default WeightsTab;
