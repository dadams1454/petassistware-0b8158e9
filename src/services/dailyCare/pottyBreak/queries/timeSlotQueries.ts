
import { supabase } from '@/integrations/supabase/client';

export const getPottyBreaksByDogAndTimeSlot = async (dogId: string, timeSlotId: string) => {
  try {
    const { data, error } = await supabase
      .from('potty_breaks')
      .select('*')
      .eq('dog_id', dogId)
      .eq('time_slot_id', timeSlotId);
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching potty breaks by dog and time slot:', error);
    return [];
  }
};

// Add the function referenced in usePottyBreakData.ts
export const getPottyBreaksByDogAndTimeSlot2 = async (dogId: string, timeSlotId: string) => {
  try {
    const { data, error } = await supabase
      .from('potty_breaks')
      .select('*')
      .eq('dog_id', dogId)
      .eq('time_slot_id', timeSlotId);
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching potty breaks by dog and time slot:', error);
    return [];
  }
};

// Fix the TimeSlot type issue
export const getTimeSlots = async () => {
  try {
    const { data, error } = await supabase
      .from('time_slots')
      .select(`
        id,
        time,
        dogs:time_slot_dogs(
          id,
          name,
          photo_url
        )
      `)
      .order('time');
      
    if (error) throw error;
    
    // Transform data to match the expected type
    return (data || []).map(slot => ({
      id: slot.id,
      time: slot.time,
      dogs: Array.isArray(slot.dogs) ? slot.dogs : []
    }));
  } catch (error) {
    console.error('Error fetching time slots:', error);
    return [];
  }
};
