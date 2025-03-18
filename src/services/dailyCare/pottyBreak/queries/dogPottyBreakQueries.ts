
import { supabase } from '@/integrations/supabase/client';
import { PottyBreak, PottyBreakDog } from '../types';

/**
 * Get all potty breaks for a specific dog on a specific date
 */
export const getPottyBreaksByDogAndDate = async (dogId: string, date: string): Promise<PottyBreak[]> => {
  const { data, error } = await supabase
    .from('potty_break_dogs')
    .select('potty_break_sessions:session_id(*)')
    .eq('dog_id', dogId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching potty breaks for dog:', error);
    throw error;
  }

  // Transform the data to return just the potty breaks with proper date/time format
  return (data || []).map(item => {
    const session = item.potty_break_sessions;
    const sessionDate = new Date(session.session_time);
    return {
      id: session.id,
      date: sessionDate.toISOString().split('T')[0],
      time: sessionDate.toTimeString().slice(0, 5),
      notes: session.notes || undefined,
      created_at: session.created_at,
      potty_break_dogs: [{ dog_id: dogId, session_id: session.id }]
    };
  });
};

/**
 * Get all dogs that had a potty break at a specific time and date
 */
export const getDogsByPottyBreakTimeAndDate = async (time: string, date: string): Promise<PottyBreakDog[]> => {
  const { data, error } = await supabase
    .from('potty_break_dogs')
    .select('*, potty_break_sessions:session_id(*)')
    .eq('potty_break_sessions.session_time', time)
    .eq('potty_break_sessions.created_at', date);

  if (error) {
    console.error('Error fetching dogs by potty break time:', error);
    throw error;
  }

  return data || [];
};

/**
 * Get all potty breaks for a specific dog by time slot
 */
export const getPottyBreaksByDogAndTimeSlot = async (dogId: string, timeSlot: string, date: string): Promise<boolean> => {
  try {
    console.log('Fetching potty breaks for dog:', dogId, 'at time:', timeSlot, 'on date:', date);
    
    const { data, error } = await supabase
      .from('potty_break_dogs')
      .select('potty_break_sessions:session_id(*)')
      .eq('dog_id', dogId)
      .eq('potty_break_sessions.session_time', timeSlot)
      .eq('potty_break_sessions.created_at', date);

    if (error) {
      console.error('Error fetching potty breaks by dog and time slot:', error);
      throw error;
    }

    console.log('Retrieved potty breaks:', data);
    return data && data.length > 0;
  } catch (error) {
    console.error('Error in getPottyBreaksByDogAndTimeSlot:', error);
    // Return false in case of error to avoid breaking the UI
    return false;
  }
};
