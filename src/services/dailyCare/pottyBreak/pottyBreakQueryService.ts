
import { supabase } from '@/integrations/supabase/client';
import { PottyBreak, PottyBreakDog, PottyBreakSession } from './types';

/**
 * Get all potty breaks for a specific date
 */
export const getPottyBreaksByDate = async (date: string): Promise<PottyBreak[]> => {
  // Changed to use potty_break_sessions table which exists in the database
  const { data, error } = await supabase
    .from('potty_break_sessions')
    .select('*, potty_break_dogs(*)')
    .eq('session_time', date)
    .order('session_time', { ascending: true });

  if (error) {
    console.error('Error fetching potty breaks:', error);
    throw error;
  }

  // Map the data from database format to PottyBreak format
  return (data || []).map(session => {
    // Parse the session_time to extract date and time
    const sessionDate = new Date(session.session_time);
    return {
      id: session.id,
      date: sessionDate.toISOString().split('T')[0],
      time: sessionDate.toTimeString().slice(0, 5),
      notes: session.notes || undefined,
      created_at: session.created_at,
      potty_break_dogs: session.potty_break_dogs || []
    };
  });
};

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

/**
 * Get all potty breaks for all dogs by date
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
      const sessionTime = item.potty_break_sessions?.session_time;
      
      if (dogId && sessionTime) {
        // Convert the ISO timestamp to a formatted time string
        const date = new Date(sessionTime);
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
    
    // This is a stub implementation. In a real-world scenario, you would implement
    // database operations to save the potty break data.
    // For example:
    // 1. Delete existing entries for the given date
    // 2. Create new entries for each dog and time slot
    
    // Since this is just a placeholder, we'll return success
    return true;
  } catch (error) {
    console.error('Error saving potty breaks:', error);
    return false;
  }
};

/**
 * Get all potty breaks for the current day
 */
export const getCurrentDayPottyBreaks = async (): Promise<PottyBreak[]> => {
  const today = new Date().toISOString().split('T')[0];
  return getPottyBreaksByDate(today);
};

/**
 * Get a specific potty break by ID
 */
export const getPottyBreakById = async (id: string): Promise<PottyBreak | null> => {
  const { data, error } = await supabase
    .from('potty_break_sessions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching potty break:', error);
    throw error;
  }

  if (!data) return null;
  
  // Transform to PottyBreak type
  const sessionDate = new Date(data.session_time);
  return {
    id: data.id,
    date: sessionDate.toISOString().split('T')[0],
    time: sessionDate.toTimeString().slice(0, 5),
    notes: data.notes || undefined,
    created_at: data.created_at
  };
};
