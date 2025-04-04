
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { WeightUnit } from '@/types/common';

// Define the form schema
const weightEntrySchema = z.object({
  weight: z.number().positive('Weight must be a positive number'),
  unit: z.custom<WeightUnit>(),
  date: z.date().optional(),
  notes: z.string().optional(),
});

// Define the values type
export type WeightEntryValues = z.infer<typeof weightEntrySchema>;

interface UseWeightEntryFormProps {
  defaultValues?: Partial<WeightEntryValues>;
  onSubmit: (data: WeightEntryValues) => Promise<void> | void;
}

export const useWeightEntryForm = (props: UseWeightEntryFormProps) => {
  const { defaultValues, onSubmit } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Set up the form with default values
  const form = useForm<WeightEntryValues>({
    resolver: zodResolver(weightEntrySchema),
    defaultValues: {
      weight: defaultValues?.weight || undefined,
      unit: defaultValues?.unit || 'lb' as WeightUnit,
      date: defaultValues?.date || new Date(),
      notes: defaultValues?.notes || '',
    },
  });
  
  // Handle form submission
  const handleSubmit = async (data: WeightEntryValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      console.error('Error submitting weight:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    form,
    isSubmitting,
    handleSubmit,
  };
};
