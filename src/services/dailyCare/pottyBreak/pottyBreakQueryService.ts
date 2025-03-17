
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { PottyBreakSession } from './types';

// Get recent potty break sessions with dogs
export const getRecentPottyBreakSessions = async (limit = 10): Promise<PottyBreakSession[]> => {
  const { data, error } = await supabase
    .from('potty_break_sessions')
    .select(`
      *,
      dogs:potty_break_dogs(
        *,
        dog:dog_id(
          name,
          photo_url,
          breed,
          color
        )
      )
    `)
    .order('session_time', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent potty break sessions:', error);
    throw error;
  }

  return data || [];
};

// Get potty break sessions for a specific day
export const getPottyBreakSessionsByDate = async (date: Date): Promise<PottyBreakSession[]> => {
  const dateString = format(date, 'yyyy-MM-dd');
  
  const { data, error } = await supabase
    .from('potty_break_sessions')
    .select(`
      *,
      dogs:potty_break_dogs(
        *,
        dog:dog_id(
          name,
          photo_url,
          breed, 
          color
        )
      )
    `)
    .gte('session_time', `${dateString}T00:00:00`)
    .lt('session_time', `${dateString}T23:59:59`)
    .order('session_time', { ascending: false });

  if (error) {
    console.error('Error fetching potty break sessions by date:', error);
    throw error;
  }

  return data || [];
};
