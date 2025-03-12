
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { LitterFormData } from './useLitterForm';

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
  // Update total puppy count whenever male or female count changes
  useEffect(() => {
    const male = parseInt(String(maleCount)) || 0;
    const female = parseInt(String(femaleCount)) || 0;
    
    if (male > 0 || female > 0) {
      const total = male + female;
      form.setValue('puppy_count', total);
    }
  }, [maleCount, femaleCount, form]);
};
