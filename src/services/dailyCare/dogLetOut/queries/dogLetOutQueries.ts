
import { supabase } from '@/integrations/supabase/client';

/**
 * Get all dog let outs for a specific dog on a specific date
 */
export const getDogLetOutsByDogAndDate = async (dogId: string, date: string): Promise<any[]> => {
  const { data, error } = await supabase
    .from('potty_break_dogs')
    .select('potty_break_sessions:session_id(*)')
    .eq('dog_id', dogId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching dog let outs for dog:', error);
    throw error;
  }

  // Transform the data to return just the dog let outs with proper date/time format
  return (data || []).map(item => {
    const session = item.potty_break_sessions;
    const sessionDate = new Date(session.session_time);
    return {
      id: session.id,
      date: sessionDate.toISOString().split('T')[0],
      time: sessionDate.toTimeString().slice(0, 5),
      notes: session.notes || undefined,
      created_at: session.created_at,
      dog_let_out_dogs: [{ dog_id: dogId, session_id: session.id }]
    };
  });
};

/**
 * Get all dogs that were let out at a specific time and date
 */
export const getDogsByLetOutTimeAndDate = async (time: string, date: string): Promise<any[]> => {
  const { data, error } = await supabase
    .from('potty_break_dogs')
    .select('*, potty_break_sessions:session_id(*)')
    .eq('potty_break_sessions.session_time', time)
    .eq('potty_break_sessions.created_at', date);

  if (error) {
    console.error('Error fetching dogs by let out time:', error);
    throw error;
  }

  return data || [];
};

/**
 * Get all dog let outs for a specific dog by time slot
 */
export const getDogLetOutsByDogAndTimeSlot = async (dogId: string, timeSlot: string, date: string): Promise<boolean> => {
  try {
    console.log('Fetching dog let outs for dog:', dogId, 'at time:', timeSlot, 'on date:', date);
    
    const { data, error } = await supabase
      .from('potty_break_dogs')
      .select('potty_break_sessions:session_id(*)')
      .eq('dog_id', dogId)
      .eq('potty_break_sessions.session_time', timeSlot)
      .eq('potty_break_sessions.created_at', date);

    if (error) {
      console.error('Error fetching dog let outs by dog and time slot:', error);
      throw error;
    }

    console.log('Retrieved dog let outs:', data);
    return data && data.length > 0;
  } catch (error) {
    console.error('Error in getDogLetOutsByDogAndTimeSlot:', error);
    // Return false in case of error to avoid breaking the UI
    return false;
  }
};
