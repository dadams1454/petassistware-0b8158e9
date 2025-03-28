
import { supabase } from '@/integrations/supabase/client';

// Get all dogs that haven't been let out in X minutes
export const getDogsNeedingLetOut = async (thresholdMinutes = 300): Promise<any[]> => {
  try {
    // Use supabase.functions.invoke instead of supabase.rpc for custom functions
    const { data, error } = await supabase.functions.invoke('get_dogs_needing_let_out', {
      body: { threshold_minutes: thresholdMinutes }
    });

    if (error) {
      console.error('Error getting dogs needing to be let out:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getDogsNeedingLetOut:', error);
    return [];
  }
};

// Get all dog let outs for a specific dog on a specific day
export const getDogLetOutsForDogAndDay = async (dogId: string, date: Date): Promise<any[]> => {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const { data, error } = await supabase
      .from('potty_break_sessions')
      .select(`
        id,
        session_time,
        notes,
        created_at,
        created_by,
        potty_break_dogs!inner(dog_id)
      `)
      .eq('potty_break_dogs.dog_id', dogId)
      .gte('session_time', startOfDay.toISOString())
      .lte('session_time', endOfDay.toISOString())
      .order('session_time');

    if (error) {
      console.error('Error fetching dog let outs for dog and day:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getDogLetOutsForDogAndDay:', error);
    return [];
  }
};

// Get the last dog let out for a specific dog
export const getLastDogLetOut = async (dogId: string): Promise<{ session_time: string } | null> => {
  try {
    const { data, error } = await supabase
      .from('potty_break_dogs')
      .select(`
        session:session_id(
          session_time
        )
      `)
      .eq('dog_id', dogId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      console.error('Error fetching last dog let out:', error);
      throw error;
    }

    return data?.session;
  } catch (error) {
    console.error('Error in getLastDogLetOut:', error);
    return null;
  }
};
