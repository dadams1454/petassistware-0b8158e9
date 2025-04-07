
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { WeightUnit } from '@/types/weight-units';
import { formatDateToYYYYMMDD } from '@/utils/dateUtils';
import { useLoading } from '@/contexts/dailyCare/hooks/useLoading';

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
  unit: z.enum(['oz', 'g', 'lb', 'kg'] as const).default('lb'),
  notes: z.string().optional(),
});

export type WeightEntryValues = z.infer<typeof weightEntrySchema>;

/**
 * Props for the useWeightEntryForm hook
 */
interface UseWeightEntryFormProps {
  dogId: string;
  onSave: (data: any) => Promise<any>;
  initialData?: Partial<WeightEntryValues>;
}

/**
 * Return type for the useWeightEntryForm hook
 */
interface UseWeightEntryFormResult {
  form: ReturnType<typeof useForm<WeightEntryValues>>;
  isSubmitting: boolean;
  handleSubmit: () => void;
}

/**
 * Custom hook for weight entry form with proper typing in the health context
 * 
 * @param {UseWeightEntryFormProps} props Configuration options for the hook
 * @returns {UseWeightEntryFormResult} Form controller and helper functions
 */
export const useWeightEntryForm = ({ 
  dogId, 
  onSave, 
  initialData 
}: UseWeightEntryFormProps): UseWeightEntryFormResult => {
  const { loading: isSubmitting, withLoading } = useLoading();
  
  const form = useForm<WeightEntryValues>({
    resolver: zodResolver(weightEntrySchema),
    defaultValues: {
      date: initialData?.date || new Date(),
      weight: initialData?.weight || 0,
      unit: initialData?.unit || 'lb',
      notes: initialData?.notes || '',
    }
  });
  
  const handleFormSubmit = async (values: WeightEntryValues): Promise<boolean> => {
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
    }
  };
  
  return {
    form,
    isSubmitting,
    handleSubmit: form.handleSubmit((values) => withLoading(() => handleFormSubmit(values)))
  };
};
