
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
  // This requires a custom SQL function or complex query
  // Fix the type error by using correct parameters - specifying thresholdMinutes as a number
  const { data, error } = await supabase.rpc('get_dogs_needing_potty_break', { 
    threshold_minutes: thresholdMinutes 
  });

  if (error) {
    console.error('Error getting dogs needing potty break:', error);
    throw error;
  }

  return data || [];
};
