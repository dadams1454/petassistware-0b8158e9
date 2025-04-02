
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import WeightInput from '@/components/dogs/form/WeightInput';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useWeightData } from '@/hooks/useWeightData';

// Form schema
const weightFormSchema = z.object({
  weight: z.string().min(1, 'Weight is required'),
  weight_unit: z.enum(['oz', 'g', 'lbs', 'kg']).default('oz'),
  date: z.date({
    required_error: 'Date is required',
  }),
  notes: z.string().optional(),
});

type WeightFormValues = z.infer<typeof weightFormSchema>;

interface WeightTrackerFormProps {
  puppyId: string;
  onSuccess?: () => void;
}

const WeightTrackerForm: React.FC<WeightTrackerFormProps> = ({
  puppyId,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addWeightRecord } = useWeightData({ puppyId });

  // Initialize form with validation
  const form = useForm<WeightFormValues>({
    resolver: zodResolver(weightFormSchema),
    defaultValues: {
      weight: '',
      weight_unit: 'oz',
      date: new Date(),
      notes: '',
    },
  });

  // Handle form submission
  const handleSubmit = async (values: WeightFormValues) => {
    setIsSubmitting(true);
    try {
      await addWeightRecord({
        puppy_id: puppyId,
        weight: parseFloat(values.weight),
        weight_unit: values.weight_unit,
        date: values.date.toISOString(),
        notes: values.notes || '',
      });

      // Reset form
      form.reset({
        weight: '',
        weight_unit: 'oz',
        date: new Date(),
        notes: '',
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error adding weight record:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Weight</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <WeightInput
                  form={form}
                  name="weight"
                  label="Weight"
                  defaultUnit="oz"
                />
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any observations about the weight or puppy condition"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Weight'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default WeightTrackerForm;
