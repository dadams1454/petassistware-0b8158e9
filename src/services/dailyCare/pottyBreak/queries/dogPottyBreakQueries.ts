
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

export const getDogPottyBreaks = async (dogId: string, date: string) => {
  try {
    // Using potty_break_sessions and potty_break_dogs to get the data
    const { data, error } = await supabase
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
      .gte('potty_break_sessions.session_time', `${date}T00:00:00`)
      .lte('potty_break_sessions.session_time', `${date}T23:59:59`)
      .order('potty_break_sessions.session_time', { ascending: false });
      
    if (error) throw error;
    
    // Transform the nested structure into the expected format
    const breakData = (data || []).map(item => ({
      id: item.potty_break_sessions.id,
      session_time: item.potty_break_sessions.session_time,
      notes: item.potty_break_sessions.notes,
      created_at: item.potty_break_sessions.created_at,
      dog_id: item.dog_id
    }));
    
    return breakData;
  } catch (error) {
    console.error('Error fetching dog potty breaks:', error);
    return [];
  }
};

export const getLastPottyBreak = async (dogId: string) => {
  try {
    // Using potty_break_sessions and potty_break_dogs to get the last record
    const { data, error } = await supabase
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
      .order('potty_break_sessions.session_time', { ascending: false })
      .limit(1)
      .single();
      
    if (error && error.code !== 'PGRST116') throw error;
    
    if (data && data.potty_break_sessions) {
      return {
        session_time: data.potty_break_sessions.session_time,
        id: data.potty_break_sessions.id,
        notes: data.potty_break_sessions.notes,
        created_at: data.potty_break_sessions.created_at
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching last potty break:', error);
    return null;
  }
};
