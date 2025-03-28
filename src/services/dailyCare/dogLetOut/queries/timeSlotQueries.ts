
import { supabase } from '@/integrations/supabase/client';
import { logDogLetOut } from '../dogLetOutService';

/**
 * Get all dog let outs for all dogs by date, organized by time slots
 */
export const getDogLetOutsByDogAndTimeSlot2 = async (date: Date): Promise<Record<string, string[]>> => {
  try {
    const dateStr = date.toISOString().split('T')[0];
    console.log('Fetching dog let outs for date:', dateStr);
    
    const { data, error } = await supabase
      .from('potty_break_dogs')
      .select(`
        dog_id,
        potty_break_sessions:session_id(session_time)
      `)
      .gte('created_at', `${dateStr}T00:00:00`)
      .lte('created_at', `${dateStr}T23:59:59`);

    if (error) {
      console.error('Error fetching dog let outs by date:', error);
      throw error;
    }

    // Transform the data into a map of dogId -> array of time slots
    const dogLetOutsMap: Record<string, string[]> = {};
    
    data.forEach(item => {
      const dogId = item.dog_id;
      const sessionTime = item.potty_break_sessions?.session_time;
      
      if (dogId && sessionTime) {
        // Convert the ISO timestamp to a formatted time string
        const date = new Date(sessionTime);
        const hours = date.getHours();
        const timeSlot = `${hours === 0 ? 12 : hours > 12 ? hours - 12 : hours}:00 ${hours >= 12 ? 'PM' : 'AM'}`;
        
        if (!dogLetOutsMap[dogId]) {
          dogLetOutsMap[dogId] = [];
        }
        
        if (!dogLetOutsMap[dogId].includes(timeSlot)) {
          dogLetOutsMap[dogId].push(timeSlot);
        }
      }
    });
    
    return dogLetOutsMap;
  } catch (error) {
    console.error('Error in getDogLetOutsByDogAndTimeSlot2:', error);
    return {};
  }
};

/**
 * Save dog let outs for dogs by time slot
 */
export const saveDogLetOutsByDogAndTimeSlot = async (date: Date, dogLetOuts: Record<string, string[]>): Promise<boolean> => {
  try {
    console.log('Saving dog let outs for date:', date.toISOString().slice(0, 10), 'data:', dogLetOuts);
    
    // Since all dog let outs are tracked individually through logDogLetOut
    // This function is primarily a placeholder for potential bulk operations
    // The actual saving is done in the cell action handler via logDogLetOut
    
    return true;
  } catch (error) {
    console.error('Error saving dog let outs:', error);
    return false;
  }
};
