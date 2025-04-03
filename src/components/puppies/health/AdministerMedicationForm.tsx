
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Medication } from '@/types/health';

interface AdministerMedicationFormProps {
  onSubmit: (data: any) => Promise<void>;
  medication: Medication;
}

const formSchema = z.object({
  administeredAt: z.string().min(1, {
    message: "Administration date and time is required",
  }),
  administeredBy: z.string().min(1, {
    message: "Administrator name is required",
  }),
  notes: z.string().optional(),
});

const AdministerMedicationForm: React.FC<AdministerMedicationFormProps> = ({ 
  onSubmit, 
  medication
}) => {
  const now = new Date();
  const isoDateTime = now.toISOString().slice(0, 16); // Format: "YYYY-MM-DDThh:mm"
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      administeredAt: isoDateTime,
      administeredBy: '',
      notes: ''
    }
  });
  
  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await onSubmit(values);
      form.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="administeredAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date & Time Administered</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="administeredBy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Administered By</FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" {...field} />
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
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any observations or special circumstances"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="submit">Record Administration</Button>
        </div>
      </form>
    </Form>
  );
};

export default AdministerMedicationForm;
