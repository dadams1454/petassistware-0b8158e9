
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { WeightUnit } from '@/types/common';

const formSchema = z.object({
  weight: z.coerce.number().positive('Weight must be a positive number'),
  weight_unit: z.enum(['oz', 'g', 'lb', 'kg'] as const),
  date: z.string().nonempty('Date is required'),
  notes: z.string().optional(),
});

type WeightFormValues = z.infer<typeof formSchema>;

interface WeightTrackerFormProps {
  onSubmit: (data: WeightFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const WeightTrackerForm: React.FC<WeightTrackerFormProps> = ({ 
  onSubmit, 
  onCancel, 
  isLoading = false 
}) => {
  const form = useForm<WeightFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weight: undefined,
      weight_unit: 'oz',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  max={new Date().toISOString().split('T')[0]}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Weight</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter weight"
                    type="number"
                    step="0.1"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value ? parseFloat(e.target.value) : '';
                      field.onChange(value);
                    }}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="weight_unit"
            render={({ field }) => (
              <FormItem className="w-full md:w-1/3">
                <FormLabel>Unit</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value as WeightUnit)}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="oz">Ounces (oz)</SelectItem>
                    <SelectItem value="g">Grams (g)</SelectItem>
                    <SelectItem value="lb">Pounds (lb)</SelectItem>
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
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Optional notes about this weight measurement"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Weight'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default WeightTrackerForm;
