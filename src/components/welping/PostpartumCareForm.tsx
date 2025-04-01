
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { addPostpartumCare } from '@/services/welpingService';
import { format } from 'date-fns';

const postpartumCareSchema = z.object({
  care_type: z.enum(['feeding', 'cleaning', 'medical', 'weighing', 'other']),
  care_time: z.string().min(1, 'Time is required'),
  notes: z.string().min(1, 'Notes are required'),
  performed_by: z.string().optional(),
});

type PostpartumCareFormValues = z.infer<typeof postpartumCareSchema>;

interface PostpartumCareFormProps {
  puppyId: string;
  onSuccess: () => void;
  onCancel?: () => void;
}

const PostpartumCareForm: React.FC<PostpartumCareFormProps> = ({
  puppyId,
  onSuccess,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<PostpartumCareFormValues>({
    resolver: zodResolver(postpartumCareSchema),
    defaultValues: {
      care_type: 'feeding',
      care_time: format(new Date(), 'HH:mm'),
      notes: '',
      performed_by: '',
    },
  });
  
  const handleSubmit = async (values: PostpartumCareFormValues) => {
    setIsSubmitting(true);
    try {
      await addPostpartumCare({
        puppy_id: puppyId,
        ...values,
      });
      onSuccess();
    } catch (error) {
      console.error('Error submitting postpartum care:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="care_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Care Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select care type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="feeding">Feeding</SelectItem>
                    <SelectItem value="cleaning">Cleaning</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="weighing">Weighing</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="care_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="performed_by"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Performed By</FormLabel>
              <FormControl>
                <Input placeholder="Who performed this care" {...field} />
              </FormControl>
              <FormDescription>Optional - record who provided this care</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter care details"
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                {form.watch('care_type') === 'feeding' && 'Record feeding method, amount, and puppy response'}
                {form.watch('care_type') === 'cleaning' && 'Record cleaning method and areas cleaned'}
                {form.watch('care_type') === 'medical' && 'Record treatment, medication, dosage if applicable'}
                {form.watch('care_type') === 'weighing' && 'Record current weight and any changes from previous measurements'}
                {form.watch('care_type') === 'other' && 'Describe the care provided in detail'}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Record Care'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostpartumCareForm;
