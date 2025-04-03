
import { useEffect } from 'react';
import { UsePuppyCounterProps } from './types/litterFormTypes';

/**
 * Hook to automatically calculate puppy_count based on male and female counts
 */
export const usePuppyCounter = ({
  form,
  maleCount,
  femaleCount
}: UsePuppyCounterProps) => {
  // Update puppy count when male or female count changes
  useEffect(() => {
    const male = maleCount || 0;
    const female = femaleCount || 0;
    const total = male + female;
    
    // If either count is defined, update puppy_count field
    if (form.getValues('male_count') !== undefined || form.getValues('female_count') !== undefined) {
      // We'll add this field if it doesn't exist in the type
      try {
        form.setValue('puppy_count', total);
      } catch (error) {
        console.log('Could not set puppy_count, field might be missing from form schema');
      }
    }
  }, [form, maleCount, femaleCount]);
};
