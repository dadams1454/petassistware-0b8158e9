
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { WelpingObservation } from '@/types/welping';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

// Define the form schema with Zod
const observationSchema = z.object({
  observation_type: z.string({ required_error: "Observation type is required" }),
  description: z.string({ required_error: "Description is required" }).min(3, { message: "Description must be at least 3 characters" }),
  observation_time: z.string({ required_error: "Observation time is required" }),
  puppy_id: z.string().optional(),
  action_taken: z.string().optional(),
});

type ObservationFormValues = z.infer<typeof observationSchema>;

interface ObservationFormProps {
  welpingRecordId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: Partial<WelpingObservation>;
  puppyOptions?: { id: string; name: string }[];
}

const ObservationForm: React.FC<ObservationFormProps> = ({
  welpingRecordId,
  onSuccess,
  onCancel,
  initialData,
  puppyOptions = []
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Initialize the form with default values
  const form = useForm<ObservationFormValues>({
    resolver: zodResolver(observationSchema),
    defaultValues: {
      observation_type: initialData?.observation_type || '',
      description: initialData?.description || '',
      observation_time: initialData?.observation_time || format(new Date(), 'HH:mm'),
      puppy_id: initialData?.puppy_id || '',
      action_taken: initialData?.action_taken || '',
    },
  });

  // Define observation type options
  const observationTypes = [
    { value: 'behavioral', label: 'Behavioral' },
    { value: 'physical', label: 'Physical' },
    { value: 'contractions', label: 'Contractions' },
    { value: 'delivery', label: 'Delivery' },
    { value: 'nursing', label: 'Nursing' },
    { value: 'maternal_care', label: 'Maternal Care' },
    { value: 'rest', label: 'Rest' },
    { value: 'vocalization', label: 'Vocalization' },
    { value: 'medication', label: 'Medication' },
    { value: 'complication', label: 'Complication' },
    { value: 'other', label: 'Other' },
  ];

  const handleSubmit = async (values: ObservationFormValues) => {
    setIsSubmitting(true);
    try {
      // Ensure all required fields are present
      const observationData: Partial<WelpingObservation> & { 
        welping_record_id: string;
        observation_type: string;
        description: string;
        observation_time: string;
      } = {
        ...values,
        welping_record_id: welpingRecordId,
        created_at: new Date().toISOString(),
      };

      if (initialData?.id) {
        // Update existing observation
        const { error } = await supabase
          .from('welping_observations')
          .update(observationData)
          .eq('id', initialData.id);

        if (error) throw error;
        toast({
          title: 'Observation Updated',
          description: 'The whelping observation has been successfully updated.',
        });
      } else {
        // Create new observation
        const { error } = await supabase
          .from('welping_observations')
          .insert(observationData);

        if (error) throw error;
        toast({
          title: 'Observation Recorded',
          description: 'The whelping observation has been successfully recorded.',
        });
      }

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['welping-observations', welpingRecordId] });
      
      // Reset form and call success callback
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Error saving observation:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save the observation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{initialData?.id ? 'Edit Observation' : 'New Whelping Observation'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="observation_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observation Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an observation type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {observationTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
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
                name="observation_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        placeholder="Select time"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter detailed description of the observation"
                      {...field}
                      disabled={isSubmitting}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {puppyOptions.length > 0 && (
              <FormField
                control={form.control}
                name="puppy_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Related Puppy (Optional)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a puppy (if applicable)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {puppyOptions.map((puppy) => (
                          <SelectItem key={puppy.id} value={puppy.id}>
                            {puppy.name || `Puppy #${puppy.id.slice(-4)}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      If this observation is specific to a single puppy, select it here
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="action_taken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Action Taken (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe any actions taken in response to this observation"
                      {...field}
                      disabled={isSubmitting}
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        {onCancel && (
          <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button onClick={form.handleSubmit(handleSubmit)} disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {initialData?.id ? 'Update' : 'Save'} Observation
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ObservationForm;
