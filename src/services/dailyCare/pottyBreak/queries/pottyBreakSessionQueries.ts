
import { supabase } from '@/integrations/supabase/client';
import { PottyBreak, PottyBreakSession } from '../types';

/**
 * Get all potty breaks for a specific date
 */
export const getPottyBreaksByDate = async (date: string): Promise<PottyBreak[]> => {
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

/**
 * Get all potty breaks for the current day
 */
export const getCurrentDayPottyBreaks = async (): Promise<PottyBreak[]> => {
  const today = new Date().toISOString().split('T')[0];
  return getPottyBreaksByDate(today);
};
