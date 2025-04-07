
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { WeightUnit } from '@/types/weight-units';
import { useLoading } from '@/contexts/dailyCare/hooks/useLoading';

// Define the form schema
const weightEntrySchema = z.object({
  weight: z.number().positive('Weight must be a positive number'),
  unit: z.enum(['oz', 'g', 'lb', 'kg'] as const),
  date: z.date().optional(),
  notes: z.string().optional(),
});

// Define the values type
export type WeightEntryValues = z.infer<typeof weightEntrySchema>;

/**
 * Props for the useWeightEntryForm hook
 */
export interface UseWeightEntryFormProps {
  defaultValues?: Partial<WeightEntryValues>;
  onSubmit: (data: WeightEntryValues) => Promise<void> | void;
}

/**
 * Return type for the useWeightEntryForm hook
 */
export interface UseWeightEntryFormResult {
  form: ReturnType<typeof useForm<WeightEntryValues>>;
  isSubmitting: boolean;
  handleSubmit: () => void;
}

/**
 * Custom hook for weight entry form handling with proper typing
 * 
 * @param {UseWeightEntryFormProps} props Configuration options for the hook
 * @returns {UseWeightEntryFormResult} Form controller and helper functions
 */
export const useWeightEntryForm = (props: UseWeightEntryFormProps): UseWeightEntryFormResult => {
  const { defaultValues, onSubmit } = props;
  const { loading: isSubmitting, withLoading } = useLoading();
  
  // Set up the form with default values
  const form = useForm<WeightEntryValues>({
    resolver: zodResolver(weightEntrySchema),
    defaultValues: {
      weight: defaultValues?.weight ?? undefined,
      unit: defaultValues?.unit ?? 'lb' as WeightUnit,
      date: defaultValues?.date ?? new Date(),
      notes: defaultValues?.notes ?? '',
    },
  });
  
  // Handle form submission
  const handleFormSubmit = async (data: WeightEntryValues): Promise<void> => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      console.error('Error submitting weight:', error);
      throw error; // Re-throw to allow caller to handle
    }
  };
  
  return {
    form,
    isSubmitting,
    handleSubmit: form.handleSubmit((values) => withLoading(() => handleFormSubmit(values))),
  };
};
