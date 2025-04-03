
import { useEffect } from 'react';
import { UseDamInfoUpdaterProps } from './types/litterFormTypes';

/**
 * Hook to update litter info when dam changes
 */
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
  
  // Update dam info and auto-fill litter name when dam changes
  useEffect(() => {
    // Only run this effect when the dam_id changes
    if (currentDamId === previousDamId) return;
    
    // Skip on first load if we have initial data
    if (isInitialLoad && initialData?.litter_name) {
      setIsInitialLoad(false);
      setPreviousDamId(currentDamId);
      return;
    }
    
    // If we have dam details, auto-fill litter name
    if (damDetails) {
      const damName = damDetails.name || 'Unknown Dam';
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      const newLitterName = `${damName}'s Litter - ${formattedDate}`;
      
      // Only update litter name if it's empty or from a previous dam
      if (!form.getValues('litter_name') || !isInitialLoad) {
        form.setValue('litter_name', newLitterName);
      }
      
      // Mark this dam as the previous one
      setPreviousDamId(currentDamId);
    }
    
    setIsInitialLoad(false);
  }, [
    currentDamId, 
    damDetails, 
    form, 
    initialData, 
    isInitialLoad, 
    previousDamId, 
    setIsInitialLoad, 
    setPreviousDamId
  ]);
};
