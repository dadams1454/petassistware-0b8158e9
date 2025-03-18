
import { supabase } from '@/integrations/supabase/client';
import { PottyBreak, PottyBreakDog } from './types';

/**
 * Get all potty breaks for a specific date
 */
export const getPottyBreaksByDate = async (date: string): Promise<PottyBreak[]> => {
  const { data, error } = await supabase
    .from('potty_breaks')
    .select('*, potty_break_dogs(dog_id)')
    .eq('date', date)
    .order('time', { ascending: true });

  if (error) {
    console.error('Error fetching potty breaks:', error);
    throw error;
  }

  return data || [];
};

/**
 * Get all potty breaks for a specific dog on a specific date
 */
export const getPottyBreaksByDogAndDate = async (dogId: string, date: string): Promise<PottyBreak[]> => {
  const { data, error } = await supabase
    .from('potty_break_dogs')
    .select('potty_breaks:potty_break_id(*)')
    .eq('dog_id', dogId)
    .eq('potty_breaks.date', date)
    .order('potty_breaks.time', { ascending: true });

  if (error) {
    console.error('Error fetching potty breaks for dog:', error);
    throw error;
  }

  // Transform the data to return just the potty breaks
  return data?.map(item => item.potty_breaks) || [];
};

/**
 * Get all dogs that had a potty break at a specific time and date
 */
export const getDogsByPottyBreakTimeAndDate = async (time: string, date: string): Promise<PottyBreakDog[]> => {
  const { data, error } = await supabase
    .from('potty_break_dogs')
    .select('*, potty_breaks:potty_break_id(*)')
    .eq('potty_breaks.time', time)
    .eq('potty_breaks.date', date);

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
    
    // Fix: Change 'session' to 'session_id' in the query
    const { data, error } = await supabase
      .from('potty_break_dogs')
      .select('potty_breaks:potty_break_id(*)')
      .eq('dog_id', dogId)
      .eq('potty_breaks.time', timeSlot)
      .eq('potty_breaks.date', date);

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
    .from('potty_breaks')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching potty break:', error);
    throw error;
  }

  return data;
};
