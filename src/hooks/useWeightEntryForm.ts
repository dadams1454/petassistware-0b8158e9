
import { useState } from 'react';
import { WeightUnit } from '@/types/common';
import { WeightRecord } from '@/types/health';

interface WeightEntryFormProps {
  initialData?: Partial<WeightRecord>;
  dogId?: string;
  puppyId?: string;
  onSubmit: (data: Partial<WeightRecord>) => Promise<void>;
}

export const useWeightEntryForm = ({
  initialData,
  dogId,
  puppyId,
  onSubmit
}: WeightEntryFormProps) => {
  const [weight, setWeight] = useState<number | string>(initialData?.weight || '');
  const [date, setDate] = useState<string>(
    initialData?.date || new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState<string>(initialData?.notes || '');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(
    (initialData?.weight_unit as WeightUnit) || 'lb'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate data
    if (!weight || typeof weight === 'string' && isNaN(parseFloat(weight))) {
      setError('Please enter a valid weight');
      return;
    }
    
    if (!date) {
      setError('Please select a date');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create weight record data
      const weightData: Partial<WeightRecord> = {
        ...(initialData?.id ? { id: initialData.id } : {}),
        dog_id: dogId || '',
        puppy_id: puppyId,
        weight: typeof weight === 'string' ? parseFloat(weight) : weight,
        weight_unit: weightUnit,
        date,
        notes: notes || undefined
      };
      
      await onSubmit(weightData);
      
      // Reset form if it's not an update
      if (!initialData?.id) {
        setWeight('');
        setNotes('');
        setDate(new Date().toISOString().split('T')[0]);
      }
    } catch (err) {
      console.error('Error submitting weight data:', err);
      setError('Failed to save weight record');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const reset = () => {
    setWeight(initialData?.weight || '');
    setDate(initialData?.date || new Date().toISOString().split('T')[0]);
    setNotes(initialData?.notes || '');
    setWeightUnit((initialData?.weight_unit as WeightUnit) || 'lb');
    setError(null);
  };

  return {
    weight,
    setWeight,
    date,
    setDate,
    notes,
    setNotes,
    weightUnit,
    setWeightUnit,
    isSubmitting,
    error,
    handleSubmit,
    reset
  };
};

export default useWeightEntryForm;
