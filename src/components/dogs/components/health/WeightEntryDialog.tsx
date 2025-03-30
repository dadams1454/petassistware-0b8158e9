
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { WeightRecord } from '@/types/health';

interface WeightEntryDialogProps {
  dogId: string;
  onClose: () => void;
  onSave: (weightRecord: Omit<WeightRecord, 'id' | 'created_at'>) => void;
}

// Schema for weight entry form
const weightEntrySchema = z.object({
  date: z.date({
    required_error: 'Date is required',
  }).refine(date => date <= new Date(), {
    message: 'Date cannot be in the future',
  }),
  weight: z.coerce.number({
    required_error: 'Weight is required',
    invalid_type_error: 'Weight must be a number',
  }).positive({
    message: 'Weight must be greater than 0',
  }),
  weight_unit: z.enum(['lbs', 'kg', 'g', 'oz'], {
    required_error: 'Unit is required',
  }),
  notes: z.string().optional(),
});

type WeightEntryValues = z.infer<typeof weightEntrySchema>;

const WeightEntryDialog: React.FC<WeightEntryDialogProps> = ({
  dogId,
  onClose,
  onSave
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<WeightEntryValues>({
    resolver: zodResolver(weightEntrySchema),
    defaultValues: {
      date: new Date(),
      weight: 0,
      weight_unit: 'lbs',
      notes: '',
    }
  });
  
  const handleSubmit = async (values: WeightEntryValues) => {
    setIsSubmitting(true);
    try {
      // Format the data for the API, converting Date to string
      const weightRecord: Omit<WeightRecord, 'id' | 'created_at'> = {
        dog_id: dogId,
        date: values.date.toISOString().split('T')[0], // Format as YYYY-MM-DD
        weight: values.weight,
        weight_unit: values.weight_unit,
        notes: values.notes
      };
      
      onSave(weightRecord);
      onClose();
    } catch (error) {
      console.error('Error saving weight record:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Weight Record</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date*</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
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
                        disabled={(date) => date > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Weight*</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
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
                  <FormItem className="w-24">
                    <FormLabel>Unit*</FormLabel>
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
                        <SelectItem value="lbs">lbs</SelectItem>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="g">g</SelectItem>
                        <SelectItem value="oz">oz</SelectItem>
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
                    <Input {...field} placeholder="Optional notes" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Weight'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default WeightEntryDialog;
