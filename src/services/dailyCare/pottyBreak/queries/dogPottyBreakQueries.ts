
import { supabase } from '@/integrations/supabase/client';

export const getDogPottyBreaks = async (dogId: string, date: string) => {
  try {
    const { data, error } = await supabase
      .from('potty_breaks')
      .select('*')
      .eq('dog_id', dogId)
      .gte('session_time', `${date}T00:00:00`)
      .lte('session_time', `${date}T23:59:59`)
      .order('session_time', { ascending: false });
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching dog potty breaks:', error);
    return [];
  }
};

export const getLastPottyBreak = async (dogId: string) => {
  try {
    const { data, error } = await supabase
      .from('potty_breaks')
      .select('id, session_time, notes, created_at')
      .eq('dog_id', dogId)
      .order('session_time', { ascending: false })
      .limit(1)
      .single();
      
    if (error && error.code !== 'PGRST116') throw error;
    
    if (data) {
      return {
        session_time: data.session_time,
        id: data.id,
        notes: data.notes,
        created_at: data.created_at
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching last potty break:', error);
    return null;
  }
};
