
import { supabase } from '@/integrations/supabase/client';

// Get the last potty break for a specific dog
export const getLastDogPottyBreak = async (dogId: string): Promise<{ session_time: string } | null> => {
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
    console.error('Error fetching last dog potty break:', error);
    throw error;
  }

  return data?.session;
};

// Get dogs that haven't had a potty break in X minutes
export const getDogsNeedingPottyBreak = async (thresholdMinutes = 300): Promise<any[]> => {
  // Convert the threshold to a number to avoid type errors
  const threshold = Number(thresholdMinutes);
  
  // Fix the type error by correctly passing parameters to RPC function
  const { data, error } = await supabase.functions.invoke('get_dogs_needing_potty_break', {
    body: { threshold_minutes: threshold }
  });

  if (error) {
    console.error('Error getting dogs needing potty break:', error);
    throw error;
  }

  return data || [];
};

// Log a potty break for a specific dog at a specific time slot
export const logDogPottyBreak = async (dogId: string, timeSlot: string): Promise<any> => {
  // Create a new potty break session
  const { data: sessionData, error: sessionError } = await supabase
    .from('potty_break_sessions')
    .insert({
      session_time: new Date().toISOString(),
      notes: `Potty break at ${timeSlot}`
    })
    .select()
    .single();

  if (sessionError) {
    console.error('Error creating potty break session:', sessionError);
    throw sessionError;
  }

  // Associate the dog with the session
  const { data: dogData, error: dogError } = await supabase
    .from('potty_break_dogs')
    .insert({
      dog_id: dogId,
      session_id: sessionData.id
    })
    .select()
    .single();

  if (dogError) {
    console.error('Error associating dog with potty break:', dogError);
    throw dogError;
  }

  return { session: sessionData, dogSession: dogData };
};

// Get all potty breaks for a specific day
export const getPottyBreaksForDay = async (date: Date): Promise<any[]> => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  const { data, error } = await supabase
    .from('potty_break_sessions')
    .select(`
      *,
      dogs:potty_break_dogs(
        *,
        dog:dog_id(id, name)
      )
    `)
    .gte('session_time', startOfDay.toISOString())
    .lte('session_time', endOfDay.toISOString());

  if (error) {
    console.error('Error fetching potty breaks for day:', error);
    throw error;
  }

  return data || [];
};
