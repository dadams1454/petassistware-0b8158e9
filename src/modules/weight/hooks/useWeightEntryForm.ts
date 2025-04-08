
/**
 * Hook for weight entry form
 */
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { WeightUnit } from '@/types/weight-units';
import { calculateAgeInDays } from '@/modules/puppies/utils/puppyAgeCalculator';

// Form values interface
export interface WeightEntryValues {
  weight: number;
  unit: WeightUnit;
  date: Date;
  notes?: string;
}

// Zod schema for validation
const weightEntrySchema = z.object({
  weight: z.number()
    .positive('Weight must be positive')
    .min(0.01, 'Weight must be greater than 0')
    .max(999, 'Weight must be less than 1000'),
  unit: z.enum(['oz', 'g', 'lb', 'kg'] as const),
  date: z.date()
    .max(new Date(), 'Date cannot be in the future'),
  notes: z.string().optional(),
});

// Hook props
interface UseWeightEntryFormProps {
  dogId?: string;
  puppyId?: string;
  birthDate?: string;
  initialValues?: Partial<WeightEntryValues>;
  onSubmit: (data: WeightEntryValues) => Promise<any>;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for weight entry form with validation
 */
export const useWeightEntryForm = ({
  dogId,
  puppyId,
  birthDate,
  initialValues = {},
  onSubmit,
  onSuccess,
  onError
}: UseWeightEntryFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Create form with default values
  const form = useForm<WeightEntryValues>({
    resolver: zodResolver(weightEntrySchema),
    defaultValues: {
      weight: initialValues.weight || 0,
      unit: initialValues.unit || 'lb',
      date: initialValues.date || new Date(),
      notes: initialValues.notes || '',
    },
  });
  
  // Handle form submission
  const handleSubmit = async (values: WeightEntryValues) => {
    try {
      setIsSubmitting(true);
      
      // Calculate age in days if birth date is provided
      let ageInDays: number | undefined;
      if (birthDate) {
        ageInDays = calculateAgeInDays(birthDate);
      }
      
      // Format data for submission
      const formattedData = {
        dog_id: dogId,
        puppy_id: puppyId,
        weight: values.weight,
        weight_unit: values.unit,
        date: values.date.toISOString().split('T')[0],
        notes: values.notes || null,
        birth_date: birthDate,
        age_days: ageInDays
      };
      
      // Submit the data
      await onSubmit(values);
      
      // Reset form
      form.reset({
        weight: 0,
        unit: values.unit, // Keep the unit
        date: new Date(),
        notes: '',
      });
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting weight entry:', error);
      if (onError && error instanceof Error) {
        onError(error);
      }
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
