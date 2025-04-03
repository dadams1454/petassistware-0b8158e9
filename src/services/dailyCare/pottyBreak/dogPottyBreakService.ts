
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface PottyBreakSession {
  id?: string;
  session_time: string;
  notes?: string;
  created_by?: string;
}

interface PottyBreakDog {
  session_id: string;
  dog_id: string;
}

/**
 * Log a potty break for a dog
 */
export const logDogPottyBreak = async (
  dogId: string,
  timeSlotId: string,
  notes: string = ''
): Promise<boolean> => {
  try {
    // First try the new tables
    // 1. Create a potty break session
    const { data: sessionData, error: sessionError } = await supabase
      .from('potty_break_sessions')
      .insert({
        session_time: new Date().toISOString(),
        notes
      })
      .select()
      .single();

    if (sessionError) {
      console.error('Error creating potty break session:', sessionError);
      
      // Fall back to the old potty_breaks table
      const { error: oldTableError } = await supabase
        .from('potty_breaks')
        .insert({
          dog_id: dogId,
          time_slot_id: timeSlotId,
          session_time: new Date().toISOString(),
          notes
        });
        
      if (oldTableError) {
        console.error('Error creating potty break in old table:', oldTableError);
        return false;
      }
      
      return true;
    }

    // 2. Associate the dog with the session
    const { error: dogError } = await supabase
      .from('potty_break_dogs')
      .insert({
        session_id: sessionData.id,
        dog_id: dogId
      });

    if (dogError) {
      console.error('Error associating dog with potty break session:', dogError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception in logDogPottyBreak:', error);
    return false;
  }
};

/**
 * Get potty breaks for a dog on a specific date
 */
export const getDogPottyBreaks = async (dogId: string, date: string = format(new Date(), 'yyyy-MM-dd')) => {
  try {
    // First try getting from potty_break_dogs with joined potty_break_sessions
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
      .gte('potty_break_sessions.session_time', `${date}T00:00:00`)
      .lte('potty_break_sessions.session_time', `${date}T23:59:59`);
      
    if (newError) {
      console.error('Error fetching from new potty break tables:', newError);
      
      // Fall back to old potty_breaks table
      const { data: oldData, error: oldError } = await supabase
        .from('potty_breaks')
        .select('*')
        .eq('dog_id', dogId)
        .gte('session_time', `${date}T00:00:00`)
        .lte('session_time', `${date}T23:59:59`);
        
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
    console.error('Exception in getDogPottyBreaks:', error);
    return [];
  }
};
