
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, differenceInDays } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getPuppyWeightRecords } from '@/services/puppyWeightService';
import { mapWeightRecordFromDB } from '@/lib/mappers/weightMapper';
import { calculatePercentChange } from '@/utils/weightConversion';
import { WeightRecord, WeightUnit } from '@/types';

// Form validation schema
const weightFormSchema = z.object({
  weight: z.coerce.number().min(0.01, { message: 'Weight must be greater than 0' }),
  weight_unit: z.string(),
  date: z.date({
    required_error: 'Please select a date',
  }),
  notes: z.string().optional(),
});

export type WeightFormValues = z.infer<typeof weightFormSchema>;

interface UseWeightEntryFormProps {
  puppyId?: string;
  dogId?: string;
  birthDate?: string;
  onSuccess?: (record: WeightRecord) => void;
}

export const useWeightEntryForm = ({
  puppyId,
  dogId,
  birthDate,
  onSuccess
}: UseWeightEntryFormProps) => {
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
    if (!puppyId && !dogId) {
      toast({
        title: 'Error',
        description: 'Missing puppy or dog ID',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Get previous weights to calculate percent change
      const previousWeights = puppyId 
        ? await getPuppyWeightRecords(puppyId)
        : []; // TODO: Add dog weight records fetching
        
      let percentChange = 0;

      if (previousWeights && previousWeights.length > 0) {
        // Sort weights by date descending and get the most recent one
        const sortedWeights = [...previousWeights].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        const latestWeight = sortedWeights[0];
        
        // Calculate percent change if we have a previous weight
        if (latestWeight) {
          percentChange = calculatePercentChange(
            { weight: latestWeight.weight, unit: latestWeight.weight_unit },
            { weight: values.weight, unit: values.weight_unit as WeightUnit }
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
        ...(puppyId ? { puppy_id: puppyId } : {}),
        ...(dogId ? { dog_id: dogId } : {}),
        weight: values.weight,
        weight_unit: values.weight_unit,
        date: format(values.date, 'yyyy-MM-dd'),
        notes: values.notes || '',
        percent_change: percentChange,
        age_days: ageDays,
        birth_date: birthDate
      };
      
      // Insert weight record to the appropriate table
      const tableName = puppyId ? 'puppy_weights' : 'dog_weights';
      const { data, error } = await supabase
        .from(tableName)
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

  return {
    form,
    isSubmitting,
    handleSubmit: form.handleSubmit(handleSubmit),
  };
};
