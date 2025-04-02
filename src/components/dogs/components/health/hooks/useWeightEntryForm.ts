
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { WeightUnit, WeightUnitEnum } from '@/types/health';

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
  unit: z.nativeEnum(WeightUnitEnum, {
    required_error: 'Unit is required',
  }),
  notes: z.string().optional(),
});

export type WeightEntryValues = z.infer<typeof weightEntrySchema>;

interface UseWeightEntryFormProps {
  dogId: string;
  onSave: (data: any) => void;
  initialData?: Partial<WeightEntryValues>;
}

export const useWeightEntryForm = ({ dogId, onSave, initialData }: UseWeightEntryFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<WeightEntryValues>({
    resolver: zodResolver(weightEntrySchema),
    defaultValues: {
      date: initialData?.date || new Date(),
      weight: initialData?.weight || 0,
      unit: initialData?.unit || WeightUnitEnum.Pounds,
      notes: initialData?.notes || '',
    }
  });
  
  const handleSubmit = async (values: WeightEntryValues) => {
    setIsSubmitting(true);
    try {
      // Format the data for the API, converting Date to string
      const weightRecord = {
        dog_id: dogId,
        date: values.date.toISOString().split('T')[0], // Format as YYYY-MM-DD
        weight: values.weight,
        unit: values.unit,
        // We also include weight_unit for backward compatibility
        weight_unit: values.unit,
        notes: values.notes
      };
      
      await onSave(weightRecord);
    } catch (error) {
      console.error('Error saving weight record:', error);
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
