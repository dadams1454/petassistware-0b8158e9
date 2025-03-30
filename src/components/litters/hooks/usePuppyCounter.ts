
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { LitterFormData } from './types/litterFormTypes';

interface UsePuppyCounterProps {
  form: UseFormReturn<LitterFormData>;
  maleCount: number | null;
  femaleCount: number | null;
}

export const usePuppyCounter = ({
  form,
  maleCount,
  femaleCount
}: UsePuppyCounterProps) => {
  // Effect to auto-calculate total puppy count
  useEffect(() => {
    // Only calculate if at least one value exists
    if (maleCount !== null || femaleCount !== null) {
      const totalPuppies = (maleCount || 0) + (femaleCount || 0);
      
      // Set the total puppy count
      form.setValue('puppy_count', totalPuppies > 0 ? totalPuppies : null);
    }
  }, [form, maleCount, femaleCount]);
};
