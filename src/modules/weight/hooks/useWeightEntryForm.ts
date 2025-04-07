
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { WeightUnit } from '@/types/weight-units';
import { formatDateToYYYYMMDD } from '@/utils/dateUtils';
import { WeightRecord } from '@/types/weight';
import { calculatePercentChange } from '@/utils/weightConversion';

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
  unit: z.enum(['oz', 'g', 'lb', 'kg']).default('lb'),
  notes: z.string().optional(),
});

// Export the inferred type from our schema
export type WeightEntryValues = z.infer<typeof weightEntrySchema>;

// Props for the useWeightEntryForm hook
export interface UseWeightEntryFormProps {
  dogId?: string;
  puppyId?: string;
  birthDate?: string;
  previousWeight?: { weight: number; unit: WeightUnit };
  onSave: (data: Partial<WeightRecord>) => Promise<any>;
  initialData?: Partial<WeightEntryValues>;
}

// Return type for the useWeightEntryForm hook
export interface UseWeightEntryFormResult {
  form: ReturnType<typeof useForm<WeightEntryValues>>;
  isSubmitting: boolean;
  handleSubmit: () => void;
}

/**
 * Custom hook for weight entry form handling with proper typing
 */
export const useWeightEntryForm = ({ 
  dogId, 
  puppyId, 
  birthDate,
  previousWeight,
  onSave, 
  initialData 
}: UseWeightEntryFormProps): UseWeightEntryFormResult => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<WeightEntryValues>({
    resolver: zodResolver(weightEntrySchema),
    defaultValues: {
      date: initialData?.date || new Date(),
      weight: initialData?.weight || 0,
      unit: initialData?.unit || 'lb',
      notes: initialData?.notes || '',
    }
  });
  
  const handleSubmit = async (values: WeightEntryValues) => {
    setIsSubmitting(true);
    try {
      // Format the data for the API, safely converting Date to string
      const formattedDate = values.date instanceof Date 
        ? formatDateToYYYYMMDD(values.date) 
        : new Date().toISOString().split('T')[0];
      
      // Calculate percent change if previous weight exists
      let percentChange: number | undefined = undefined;
      
      if (previousWeight) {
        percentChange = calculatePercentChange(
          previousWeight.weight,
          values.weight
        );
      }
      
      // Include age_days if birthDate is available
      let ageDays: number | undefined = undefined;
      
      if (birthDate) {
        const recordDate = values.date instanceof Date 
          ? values.date 
          : new Date();
        const birthDateObj = new Date(birthDate);
        ageDays = Math.floor((recordDate.getTime() - birthDateObj.getTime()) / (1000 * 60 * 60 * 24));
      }
      
      const weightRecord: Partial<WeightRecord> = {
        dog_id: dogId,
        puppy_id: puppyId,
        date: formattedDate,
        weight: values.weight,
        weight_unit: values.unit,
        notes: values.notes,
        percent_change: percentChange,
        age_days: ageDays,
        birth_date: birthDate
      };
      
      await onSave(weightRecord);
      return true;
    } catch (error) {
      console.error('Error saving weight record:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    form,
    isSubmitting,
    handleSubmit: form.handleSubmit(handleSubmit)
  };
};
