
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { WeightRecord } from '@/types/puppyTracking';

const formSchema = z.object({
  weight: z.coerce.number().positive('Weight must be a positive number'),
  weight_unit: z.enum(['oz', 'g', 'lbs', 'kg']),
  date: z.string().min(1, 'Date is required'),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface WeightTrackerFormProps {
  puppyId: string;
  onSubmit: (record: Omit<WeightRecord, 'id' | 'created_at'>) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<WeightRecord>;
}

const WeightTrackerForm: React.FC<WeightTrackerFormProps> = ({
  puppyId,
  onSubmit,
  onCancel,
  initialData,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weight: initialData?.weight || 0,
      weight_unit: (initialData?.weight_unit as 'oz' | 'g' | 'lbs' | 'kg') || 'oz',
      date: initialData?.date || new Date().toISOString().split('T')[0],
      notes: initialData?.notes || '',
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      await onSubmit({
        puppy_id: puppyId,
        weight: values.weight,
        weight_unit: values.weight_unit,
        date: values.date,
        notes: values.notes || '',
        dog_id: puppyId, // Set dog_id to puppyId to make TypeScript happy
        updated_at: new Date().toISOString(), // Add required updated_at field
      });
      form.reset();
    } catch (error) {
      console.error('Error submitting weight record:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="weight_unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="oz">Ounces (oz)</SelectItem>
                    <SelectItem value="g">Grams (g)</SelectItem>
                    <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                    <SelectItem value="kg">Kilograms (kg)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
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
                <Textarea placeholder="Add any notes about this weight measurement" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Weight Record</Button>
        </div>
      </form>
    </Form>
  );
};

export default WeightTrackerForm;
