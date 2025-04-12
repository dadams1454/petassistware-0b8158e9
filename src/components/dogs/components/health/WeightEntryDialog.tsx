
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Textarea } from '@/components/ui/textarea';
import { WeightUnitEnum } from '@/types';

// Form schema for weight entry
const weightEntrySchema = z.object({
  weight: z.coerce
    .number()
    .positive('Weight must be a positive number'),
  weight_unit: z.enum(['g', 'kg', 'oz', 'lb'], {
    required_error: 'Please select a weight unit',
  }),
  date: z.date({
    required_error: 'Please select a date',
  }),
  notes: z.string().optional(),
});

type WeightEntryFormValues = z.infer<typeof weightEntrySchema>;

interface WeightEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dogId: string;
  onSave: (data: any) => void;
}

const WeightEntryDialog: React.FC<WeightEntryDialogProps> = ({
  open,
  onOpenChange,
  dogId,
  onSave,
}) => {
  const form = useForm<WeightEntryFormValues>({
    resolver: zodResolver(weightEntrySchema),
    defaultValues: {
      weight: undefined,
      weight_unit: 'lb',
      date: new Date(),
      notes: '',
    },
  });

  const handleSubmit = async (values: WeightEntryFormValues) => {
    try {
      await onSave({
        ...values,
        dog_id: dogId,
      });
      
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving weight:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Weight Record</DialogTitle>
        </DialogHeader>

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
                      <Input 
                        type="number"
                        step="0.1"
                        placeholder="Enter weight" 
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.valueAsNumber || '');
                        }}
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
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={WeightUnitEnum.LB}>Pounds (lb)</SelectItem>
                        <SelectItem value={WeightUnitEnum.OZ}>Ounces (oz)</SelectItem>
                        <SelectItem value={WeightUnitEnum.KG}>Kilograms (kg)</SelectItem>
                        <SelectItem value={WeightUnitEnum.G}>Grams (g)</SelectItem>
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
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                  />
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
                      placeholder="Enter any additional notes"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Save Weight
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default WeightEntryDialog;
