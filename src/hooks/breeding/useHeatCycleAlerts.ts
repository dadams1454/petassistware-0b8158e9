
import { useState } from 'react';
import { customSupabase, HeatCycleRow } from '@/integrations/supabase/client';
import { format } from 'date-fns';

export interface HeatCycleData {
  dog_id: string;
  start_date: string;
}

export const useHeatCycleAlerts = (dogIds: string[]) => {
  const [isLoading, setIsLoading] = useState(false);

  const recordHeatDate = async (dogId: string, date: Date): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Format date to ISO string for database storage
      const dateString = format(date, 'yyyy-MM-dd');
      
      // Manually create the insert object to ensure it matches the expected shape
      const heatCycleData: Omit<HeatCycleRow, 'id' | 'created_at'> = {
        dog_id: dogId,
        start_date: dateString,
      };
      
      // Insert heat cycle record using customSupabase to avoid typing issues
      const { error } = await customSupabase
        .from<HeatCycleRow>('heat_cycles')
        .insert(heatCycleData);
      
      if (error) {
        console.error('Error recording heat cycle:', error);
        return false;
      }
      
      // Update dog's last heat date
      const { error: updateError } = await customSupabase
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
