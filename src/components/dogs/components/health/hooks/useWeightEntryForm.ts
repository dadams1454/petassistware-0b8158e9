
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { WeightUnit } from '@/types/common';
import { WeightRecord } from '@/types/health';
import { formatDateToYYYYMMDD } from '@/utils/dateUtils';

interface UseWeightEntryFormProps {
  dogId: string;
  onSave: (data: Partial<WeightRecord>) => void;
  initialData?: WeightRecord;
}

interface WeightFormValues {
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  notes: string;
}

export const useWeightEntryForm = ({ dogId, onSave, initialData }: UseWeightEntryFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Current date
  const today = new Date().toISOString().split('T')[0];
  
  // Setup the form with default values
  const form = useForm<WeightFormValues>({
    defaultValues: {
      weight: initialData?.weight || 0,
      weight_unit: initialData?.weight_unit || 'lb',
      date: initialData?.date || today,
      notes: initialData?.notes || ''
    }
  });
  
  // Handle form submission
  const handleSubmit = async (data: WeightFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Format date
      const formattedDate = formatDateToYYYYMMDD(data.date);
      
      // Prepare the record data
      const recordData: Partial<WeightRecord> = {
        ...initialData, // Keep existing fields if editing
        dog_id: dogId,
        weight: parseFloat(data.weight.toString()),
        weight_unit: data.weight_unit,
        date: formattedDate,
        notes: data.notes
      };
      
      // Call the onSave callback
      await onSave(recordData);
      
      // Reset form if not editing
      if (!initialData) {
        form.reset({
          weight: 0,
          weight_unit: data.weight_unit, // Keep the selected unit
          date: today,
          notes: ''
        });
      }
    } catch (error) {
      console.error('Error submitting weight form:', error);
      toast({
        title: 'Error',
        description: 'Failed to save weight record. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    form,
    isSubmitting,
    handleSubmit
  };
};
