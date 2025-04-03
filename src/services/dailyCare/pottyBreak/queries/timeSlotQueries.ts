
import { supabase } from '@/integrations/supabase/client';

export const getPottyBreaksByDogAndTimeSlot = async (dogId: string, timeSlotId: string) => {
  try {
    // First try the new schema
    const { data: newData, error: newError } = await supabase
      .from('potty_break_dogs')
      .select(`
        id,
        session_id,
        dog_id,
        potty_break_sessions(
          id,
          session_time,
          notes,
          created_at
        )
      `)
      .eq('dog_id', dogId)
      .eq('potty_break_sessions.id', timeSlotId);
      
    if (newError) {
      console.error('Error fetching from new potty break tables:', newError);
      
      // Fall back to old potty_breaks table
      const { data: oldData, error: oldError } = await supabase
        .from('potty_breaks')
        .select('*')
        .eq('dog_id', dogId)
        .eq('time_slot_id', timeSlotId);
        
      if (oldError) {
        console.error('Error fetching from old potty breaks table:', oldError);
        return [];
      }
      
      return oldData || [];
    }
    
    // Transform the nested structure into the expected format
    return (newData || []).map(item => ({
      id: item.potty_break_sessions.id,
      session_time: item.potty_break_sessions.session_time,
      notes: item.potty_break_sessions.notes,
      created_at: item.potty_break_sessions.created_at,
      dog_id: item.dog_id
    }));
  } catch (error) {
    console.error('Error fetching potty breaks by dog and time slot:', error);
    return [];
  }
};

export const getTimeSlots = async () => {
  try {
    // Try to get time slots from the new table
    const { data, error } = await supabase
      .from('time_slots')
      .select(`
        id,
        time,
        time_slot_dogs(
          id,
          dog_id,
          dogs:dog_id(
            id,
            name,
            photo_url
          )
        )
      `)
      .order('time');
      
    if (error) {
      console.error('Error fetching time slots:', error);
      return [];
    }
    
    // Transform the data to match the expected type
    return (data || []).map(slot => {
      // Extract dogs from the nested time_slot_dogs
      const dogs = Array.isArray(slot.time_slot_dogs) 
        ? slot.time_slot_dogs.map(tsd => tsd.dogs).filter(Boolean)
        : [];
        
      return {
        id: slot.id,
        time: slot.time,
        dogs: dogs
      };
    });
  } catch (error) {
    console.error('Error fetching time slots:', error);
    return [];
  }
};
