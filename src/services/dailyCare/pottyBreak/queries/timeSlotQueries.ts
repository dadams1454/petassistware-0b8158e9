
import { supabase } from '@/integrations/supabase/client';
import { logDogPottyBreak } from '../dogPottyBreakService';

/**
 * Get all potty breaks for all dogs by date, organized by time slots
 */
export const getPottyBreaksByDogAndTimeSlot2 = async (date: Date): Promise<Record<string, string[]>> => {
  try {
    const dateStr = date.toISOString().split('T')[0];
    console.log('Fetching potty breaks for date:', dateStr);
    
    const { data, error } = await supabase
      .from('potty_break_dogs')
      .select(`
        dog_id,
        potty_break_sessions:session_id(session_time)
      `)
      .gte('created_at', `${dateStr}T00:00:00`)
      .lte('created_at', `${dateStr}T23:59:59`);

    if (error) {
      console.error('Error fetching potty breaks by date:', error);
      throw error;
    }

    // Transform the data into a map of dogId -> array of time slots
    const pottyBreaksMap: Record<string, string[]> = {};
    
    data.forEach(item => {
      const dogId = item.dog_id;
      // Added safety check for potty_break_sessions
      const sessionTimeObj = item.potty_break_sessions;
      
      if (dogId && sessionTimeObj && sessionTimeObj.session_time) {
        // Convert the ISO timestamp to a formatted time string
        const date = new Date(sessionTimeObj.session_time);
        const hours = date.getHours();
        const timeSlot = `${hours === 0 ? 12 : hours > 12 ? hours - 12 : hours}:00 ${hours >= 12 ? 'PM' : 'AM'}`;
        
        if (!pottyBreaksMap[dogId]) {
          pottyBreaksMap[dogId] = [];
        }
        
        if (!pottyBreaksMap[dogId].includes(timeSlot)) {
          pottyBreaksMap[dogId].push(timeSlot);
        }
      }
    });
    
    return pottyBreaksMap;
  } catch (error) {
    console.error('Error in getPottyBreaksByDogAndTimeSlot2:', error);
    return {};
  }
};

/**
 * Save potty breaks for dogs by time slot
 */
export const savePottyBreaksByDogAndTimeSlot = async (date: Date, pottyBreaks: Record<string, string[]>): Promise<boolean> => {
  try {
    console.log('Saving potty breaks for date:', date.toISOString().slice(0, 10), 'data:', pottyBreaks);
    
    // Since all potty breaks are tracked individually through logDogPottyBreak
    // This function is primarily a placeholder for potential bulk operations
    // The actual saving is done in the cell action handler via logDogPottyBreak
    
    return true;
  } catch (error) {
    console.error('Error saving potty breaks:', error);
    return false;
  }
};
