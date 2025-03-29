
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthProvider';
import { useDamDetails } from './useDamDetails';
import { useLitterFormSubmit } from './useLitterFormSubmit';
import { getDefaultFormValues } from './utils/litterFormUtils';
import { UseLitterFormProps, LitterFormData, UseLitterFormReturnType } from './types/litterFormTypes';
import { supabase } from '@/integrations/supabase/client'; // Add this missing import

export type { LitterFormData } from './types/litterFormTypes';

export const useLitterForm = ({ initialData, onSuccess }: UseLitterFormProps): UseLitterFormReturnType => {
  const [previousDamId, setPreviousDamId] = useState<string | null>(initialData?.dam_id || null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { user } = useAuth(); // Get the current authenticated user

  // Get today's date for default birth date
  const today = new Date();
  
  // Initialize form with default values
  const form = useForm<LitterFormData>({
    defaultValues: getDefaultFormValues(initialData, today)
  });

  // Watch dam_id to detect changes
  const currentDamId = form.watch('dam_id');
  
  // Watch male and female count to auto-calculate total puppies
  const maleCount = form.watch('male_count');
  const femaleCount = form.watch('female_count');
  
  // Fetch dam details when dam_id changes
  const { data: damDetails } = useDamDetails(currentDamId);

  // Setup form submission handler
  const { isSubmitting, submitForm } = useLitterFormSubmit(initialData, onSuccess, user?.id);

  // Handle form submission
  const handleSubmit = async (data: LitterFormData) => {
    await submitForm(data);
    
    // If this is a new litter and we have dam details, update the dam's litter count
    if (!initialData && damDetails && currentDamId) {
      const newLitterNumber = (damDetails.litter_number || 0) + 1;
      await supabase
        .from('dogs')
        .update({ litter_number: newLitterNumber })
        .eq('id', currentDamId);
      
      console.log(`Updated dam's litter count to ${newLitterNumber}`);
    }
  };

  return {
    form,
    isSubmitting,
    damDetails,
    previousDamId,
    setPreviousDamId,
    isInitialLoad,
    setIsInitialLoad,
    maleCount,
    femaleCount,
    currentDamId,
    handleSubmit
  };
};
