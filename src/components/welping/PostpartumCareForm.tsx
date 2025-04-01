
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addPostpartumCare, WelpingPostpartumCare } from '@/services/welpingService';
import { format } from 'date-fns';

interface PostpartumCareFormProps {
  puppyId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const PostpartumCareForm: React.FC<PostpartumCareFormProps> = ({
  puppyId,
  onSuccess,
  onCancel
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentTime = format(new Date(), 'HH:mm');
  
  const form = useForm({
    defaultValues: {
      care_time: currentTime,
      care_type: '',
      notes: '',
      performed_by: ''
    }
  });
  
  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    
    try {
      const data: Omit<WelpingPostpartumCare, 'id' | 'created_at'> = {
        puppy_id: puppyId,
        care_time: values.care_time,
        care_type: values.care_type,
        notes: values.notes,
        performed_by: values.performed_by
      };
      
      await addPostpartumCare(data);
      onSuccess();
    } catch (error) {
      console.error('Error saving postpartum care:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          
          <FormField
            control={form.control}
            name="care_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Care Type</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
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
        </div>
        
        <FormField
          control={form.control}
          name="performed_by"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Performed By</FormLabel>
              <FormControl>
                <Input placeholder="Name of person who performed the care" {...field} />
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
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Details about the care provided..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Care Record'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostpartumCareForm;
