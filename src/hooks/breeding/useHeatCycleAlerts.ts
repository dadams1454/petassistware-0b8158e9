
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
      
      // Insert heat cycle record
      const { error } = await supabase
        .from('heat_cycles')
        .insert({
          dog_id: dogId,
          start_date: dateString,
        });
      
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
