
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { 
  MedicationFrequency,
} from '@/utils/medicationUtils';
import { useAuth } from '@/contexts/AuthProvider';
import { 
  MedicationFrequencyOptions, 
  AdministrationRouteOptions, 
  DosageUnitOptions, 
  DurationUnitOptions 
} from './constants';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Medication name is required' }),
  dosage: z.string().optional(),
  dosage_unit: z.string().optional(),
  frequency: z.string().min(1, { message: 'Frequency is required' }),
  administration_route: z.string().optional(),
  start_date: z.string().min(1, { message: 'Start date is required' }),
  end_date: z.string().optional(),
  duration: z.string().optional(),
  duration_unit: z.string().optional(),
  preventative: z.boolean().default(false),
  notes: z.string().optional(),
});

interface MedicationFormProps {
  dogId: string;
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: any;
}

const MedicationForm: React.FC<MedicationFormProps> = ({ 
  dogId, 
  onSuccess, 
  onCancel,
  initialData 
}) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      dosage: initialData?.dosage?.toString() || '',
      dosage_unit: initialData?.dosage_unit || '',
      frequency: initialData?.frequency || 'daily',
      administration_route: initialData?.administration_route || '',
      start_date: initialData?.start_date ? format(new Date(initialData.start_date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      end_date: initialData?.end_date ? format(new Date(initialData.end_date), 'yyyy-MM-dd') : '',
      duration: initialData?.duration?.toString() || '',
      duration_unit: initialData?.duration_unit || 'days',
      preventative: initialData?.preventative || false,
      notes: initialData?.notes || '',
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to add medications.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Log the medication to the daily care logs
      const { error } = await supabase
        .from('daily_care_logs')
        .insert({
          dog_id: dogId,
          created_by: user.id,
          category: 'medications',
          task_name: values.name,
          notes: values.notes,
          timestamp: new Date().toISOString(),
          medication_metadata: {
            preventative: values.preventative,
            frequency: values.frequency,
            start_date: values.start_date,
            end_date: values.end_date || null,
            dosage: parseFloat(values.dosage || '0'),
            dosage_unit: values.dosage_unit,
          }
        });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Medication record has been added.",
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error submitting medication:', error);
      toast({
        title: "Error",
        description: "Failed to add medication. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Medication Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dosage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dosage</FormLabel>
                <FormControl>
                  <Input {...field} type="number" step="0.01" min="0" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="dosage_unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {DosageUnitOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="frequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Frequency</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {MedicationFrequencyOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
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
          name="administration_route"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Administration Route</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select route" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {AdministrationRouteOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input {...field} type="date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} type="date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} type="number" min="1" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="duration_unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration Unit</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {DurationUnitOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="preventative"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Preventative Medication</FormLabel>
                <FormDescription>
                  Mark as a routine preventative medication (e.g. heartworm, flea & tick)
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any additional notes about this medication"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Medication'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MedicationForm;
