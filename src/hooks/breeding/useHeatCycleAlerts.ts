
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { HeatCycle } from '@/components/dogs/components/breeding/HeatCycleMonitor';

export const useHeatCycleAlerts = (dogIds: string[]) => {
  const [isLoading, setIsLoading] = useState(false);

  const recordHeatDate = async (dogId: string, date: Date): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Format date to ISO string for database storage
      const dateString = format(date, 'yyyy-MM-dd');
      
      // Manually create the insert object to ensure it matches the expected shape
      const heatCycleData = {
        dog_id: dogId,
        start_date: dateString,
      };
      
      // Insert heat cycle record - manual approach to avoid type errors
      const { error } = await supabase
        .from('heat_cycles')
        .insert(heatCycleData);
      
      if (error) {
        console.error('Error recording heat cycle:', error);
        return false;
      }
      
      // Update dog's last heat date
      const { error: updateError } = await supabase
        .from('dogs')
        .update({ last_heat_date: dateString })
        .eq('id', dogId);
      
      if (updateError) {
        console.error('Error updating dog last heat date:', updateError);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Error in recordHeatDate function:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLoading,
    recordHeatDate
  };
};
