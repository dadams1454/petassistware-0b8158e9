
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, differenceInDays } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { weightUnitInfos, WeightRecord, WeightUnit } from '@/types';
import { calculatePercentChange } from '../../../litters/puppies/weight/weightUnits';
import { mapWeightRecordFromDB } from '@/lib/mappers/weightMapper';
import { getPuppyWeightRecords } from '@/services/puppyWeightService';

// Form validation schema
const weightFormSchema = z.object({
  weight: z.coerce.number().min(0.01, { message: 'Weight must be greater than 0' }),
  weight_unit: z.string(),
  date: z.date({
    required_error: 'Please select a date',
  }),
  notes: z.string().optional(),
});

type WeightFormValues = z.infer<typeof weightFormSchema>;

interface WeightEntryFormProps {
  puppyId: string;
  birthDate?: string;
  onSuccess?: (record: WeightRecord) => void;
  onCancel?: () => void;
}

const WeightEntryForm: React.FC<WeightEntryFormProps> = ({
  puppyId,
  birthDate,
  onSuccess,
  onCancel,
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with default values
  const form = useForm<WeightFormValues>({
    resolver: zodResolver(weightFormSchema),
    defaultValues: {
      weight: undefined,
      weight_unit: 'g',
      date: new Date(),
      notes: '',
    },
  });

  const handleSubmit = async (values: WeightFormValues) => {
    setIsSubmitting(true);
    try {
      // Get previous weights to calculate percent change
      const previousWeights = await getPuppyWeightRecords(puppyId);
      let percentChange = 0;

      if (previousWeights && previousWeights.length > 0) {
        // Sort weights by date descending and get the most recent one
        const sortedWeights = [...previousWeights].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        const latestWeight = sortedWeights[0];
        
        // Calculate percent change if we have a previous weight
        if (latestWeight) {
          const oldWeightValue = latestWeight.weight;
          const oldWeightUnit = latestWeight.weight_unit;
          const newWeightValue = values.weight;
          const newWeightUnit = values.weight_unit as WeightUnit;
          
          // Use the utility function to calculate percent change
          percentChange = calculatePercentChange(
            { weight: oldWeightValue, unit: oldWeightUnit },
            { weight: newWeightValue, unit: newWeightUnit }
          );
        }
      }
      
      // Calculate age in days if birthDate is provided
      let ageDays: number | undefined;
      if (birthDate) {
        ageDays = differenceInDays(values.date, new Date(birthDate));
      }
      
      // Prepare data for insertion
      const insertData = {
        puppy_id: puppyId,
        weight: values.weight,
        weight_unit: values.weight_unit,
        date: format(values.date, 'yyyy-MM-dd'),
        notes: values.notes || '',
        percent_change: percentChange,
        age_days: ageDays,
        birth_date: birthDate
      };
      
      // Insert weight record
      const { data, error } = await supabase
        .from('puppy_weights')
        .insert(insertData)
        .select();
      
      if (error) throw error;
      
      // Map the response data to our type
      const insertedRecord = mapWeightRecordFromDB(data?.[0]);
      
      toast({
        title: 'Weight recorded',
        description: 'The weight record has been successfully saved.',
      });
      
      // Call the success callback if provided
      if (onSuccess) {
        onSuccess(insertedRecord);
      }
      
      // Reset the form
      form.reset();
    } catch (error) {
      console.error('Error adding weight record:', error);
      toast({
        title: 'Error',
        description: 'Failed to save weight record. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                        step="0.01" 
                        placeholder="Enter weight" 
                        {...field} 
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
                        {weightUnitInfos.map((unit) => (
                          <SelectItem key={unit.value} value={unit.value}>
                            {unit.label}
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
                            format(field.value, 'PP')
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
                        className={cn("p-3 pointer-events-auto")}
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
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional notes about this weight record"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-2">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Weight'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default WeightEntryForm;
