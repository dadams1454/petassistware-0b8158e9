
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { LitterFormData } from './types/litterFormTypes'; 

interface UseDamInfoUpdaterProps {
  form: UseFormReturn<LitterFormData>;
  damDetails: any | null;
  isInitialLoad: boolean;
  setIsInitialLoad: (value: boolean) => void;
  initialData?: any;
  currentDamId: string | null;
  previousDamId: string | null;
  setPreviousDamId: (id: string | null) => void;
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
  // Effect to handle initialization and dam changes
  useEffect(() => {
    if (!currentDamId) return;
    
    // Skip if this is just initialization with the same dam
    if (isInitialLoad && currentDamId === initialData?.dam_id) {
      setIsInitialLoad(false);
      setPreviousDamId(currentDamId);
      return;
    }
    
    // If dam has changed and we have dam details, update certain form fields
    if (damDetails && (!previousDamId || currentDamId !== previousDamId)) {
      console.log('Dam changed, updating form values', { currentDamId, previousDamId });
      
      // Only update these fields if they're not already set by the user
      // This prevents overwriting user changes when switching dams
      if (!form.getValues('kennel_name')) {
        form.setValue('kennel_name', damDetails.kennel_name || null);
      }
      
      setPreviousDamId(currentDamId);
    }
  }, [
    form, 
    damDetails, 
    isInitialLoad, 
    setIsInitialLoad, 
    initialData, 
    currentDamId, 
    previousDamId, 
    setPreviousDamId
  ]);
};
