
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { WeightUnit } from '@/types/common';
import { formatDateToYYYYMMDD } from '@/utils/dateUtils';

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

export type WeightEntryValues = z.infer<typeof weightEntrySchema>;

interface UseWeightEntryFormProps {
  dogId: string;
  onSave: (data: any) => Promise<any>;
  initialData?: Partial<WeightEntryValues>;
}

export const useWeightEntryForm = ({ dogId, onSave, initialData }: UseWeightEntryFormProps) => {
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
      
      const weightRecord = {
        dog_id: dogId,
        date: formattedDate,
        weight: values.weight,
        unit: values.unit,
        // We also include weight_unit for backward compatibility
        weight_unit: values.unit,
        notes: values.notes
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
