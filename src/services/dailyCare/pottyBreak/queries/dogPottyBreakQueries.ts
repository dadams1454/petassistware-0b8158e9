import { supabase } from '@/integrations/supabase/client';

// Fix the type issues by properly handling the response data
export async function fetchLatestPottyBreak(dogId: string) {
  try {
    // Fetch the latest potty break session that includes this dog
    const { data, error } = await supabase
      .from('potty_break_dogs')
      .select(`
        session_id,
        potty_break_sessions!inner(
          id,
          session_time,
          notes,
          created_at
        )
      `)
      .eq('dog_id', dogId)
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return null;
    }
    
    // Safely extract session data
    const session = data[0].potty_break_sessions;
    if (!session) return null;
    
    // Return properly structured data
    return {
      session_time: session.session_time,
      id: session.id,
      notes: session.notes,
      created_at: session.created_at
    };
  } catch (error) {
    console.error('Error fetching latest potty break:', error);
    return null;
  }
}

export async function logPottyBreak(dogId: string, sessionId: string, notes: string) {
  try {
    const { data, error } = await supabase
      .from('potty_break_dogs')
      .insert([
        { dog_id: dogId, session_id: sessionId, notes: notes }
      ])
      .select();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error logging potty break:', error);
    return null;
  }
}

export async function updatePottyBreakNotes(dogId: string, sessionId: string, notes: string) {
  try {
    const { data, error } = await supabase
      .from('potty_break_dogs')
      .update({ notes: notes })
      .eq('dog_id', dogId)
      .eq('session_id', sessionId)
      .select();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error updating potty break notes:', error);
    return null;
  }
}
