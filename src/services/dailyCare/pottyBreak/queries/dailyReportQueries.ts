
import { supabase } from '@/integrations/supabase/client';

/**
 * Get all potty breaks for a specific day
 */
export const getDailyPottyBreakReport = async (date: Date): Promise<any[]> => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  const { data, error } = await supabase
    .from('potty_break_sessions')
    .select(`
      *,
      dogs:potty_break_dogs(
        *,
        dog:dog_id(id, name)
      )
    `)
    .gte('session_time', startOfDay.toISOString())
    .lte('session_time', endOfDay.toISOString());

  if (error) {
    console.error('Error fetching potty breaks for day:', error);
    throw error;
  }

  return data || [];
};
