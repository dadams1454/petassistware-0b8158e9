
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { LitterFormData } from './useLitterForm';

interface UseDamInfoUpdaterProps {
  form: UseFormReturn<LitterFormData>;
  damDetails: any;
  isInitialLoad: boolean;
  setIsInitialLoad: (value: boolean) => void;
  initialData?: Litter;
  currentDamId: string | null;
  previousDamId: string | null;
  setPreviousDamId: (value: string | null) => void;
}

export const useDamInfoUpdater = ({
  form,
  damDetails,
  isInitialLoad,
  setIsInitialLoad,
  initialData,
  currentDamId,
  previousDamId,
  setPreviousDamId
}: UseDamInfoUpdaterProps) => {
  // Initial setup for edit mode - make sure we load dam details even if dam_id doesn't change
  useEffect(() => {
    if (initialData && initialData.dam_id && isInitialLoad && damDetails) {
      console.log('Initial load with dam details:', damDetails);
      setIsInitialLoad(false);
      
      // In edit mode, we need to ensure dam info is visible even if form fields aren't empty
      // This is the key fix - we're updating dam info regardless of existing values
      const damInfo = `Dam: ${damDetails.name}, Breed: ${damDetails.breed}, Color: ${damDetails.color || 'N/A'}`;
      form.setValue('notes', initialData.notes || damInfo);
      
      const litterName = initialData.litter_name || `${damDetails.name}'s Litter #${damDetails.litter_number || 0}`;
      form.setValue('litter_name', litterName);
    }
  }, [initialData, damDetails, form, isInitialLoad, setIsInitialLoad]);

  // Update form with additional data when dam changes
  useEffect(() => {
    if (currentDamId !== previousDamId && damDetails) {
      console.log('Dam changed, updating form with dam details:', damDetails);
      
      // Update litter name if it's empty or was auto-generated previously
      if (!form.getValues('litter_name') || form.getValues('litter_name').includes('Litter')) {
        const litterNumber = (damDetails.litter_number || 0) + 1;
        form.setValue('litter_name', `${damDetails.name}'s Litter #${litterNumber}`);
      }
      
      // Update notes with dam information if notes are empty
      if (!form.getValues('notes')) {
        const damInfo = `Dam: ${damDetails.name}, Breed: ${damDetails.breed}, Color: ${damDetails.color || 'N/A'}`;
        form.setValue('notes', damInfo);
      }
      
      setPreviousDamId(currentDamId);
    }
  }, [currentDamId, damDetails, form, previousDamId, setPreviousDamId]);
};
