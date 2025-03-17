
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

// Type definitions for potty break sessions and related data
export interface PottyBreakSession {
  id: string;
  session_time: string;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  dogs?: PottyBreakDog[];
}

export interface PottyBreakDog {
  id: string;
  session_id: string;
  dog_id: string;
  created_at: string;
  dog?: {
    name: string;
    photo_url?: string;
    breed?: string;
    color?: string;
  };
}

export interface PottyBreakCreate {
  notes?: string;
  dogs: string[]; // Array of dog IDs
}

// Create a new potty break session
export const createPottyBreakSession = async (data: PottyBreakCreate, userId?: string): Promise<PottyBreakSession> => {
  // Start a transaction
  const { data: session, error: sessionError } = await supabase
    .from('potty_break_sessions')
    .insert([{ 
      notes: data.notes,
      created_by: userId || null
    }])
    .select()
    .single();

  if (sessionError) {
    console.error('Error creating potty break session:', sessionError);
    throw sessionError;
  }

  // Insert dog records for this session
  if (data.dogs.length > 0) {
    const dogEntries = data.dogs.map(dogId => ({
      session_id: session.id,
      dog_id: dogId
    }));

    const { error: dogsError } = await supabase
      .from('potty_break_dogs')
      .insert(dogEntries);

    if (dogsError) {
      console.error('Error adding dogs to potty break session:', dogsError);
      throw dogsError;
    }
  }

  return session;
};

// Get a single potty break session with dogs
export const getPottyBreakSession = async (sessionId: string): Promise<PottyBreakSession | null> => {
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
    .eq('id', sessionId)
    .single();

  if (error) {
    console.error('Error fetching potty break session:', error);
    throw error;
  }

  return data;
};

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
  // For now, we'll get all dogs and their last potty break time
  // and filter them client-side

  const { data, error } = await supabase.rpc('get_dogs_needing_potty_break', { 
    threshold_minutes: thresholdMinutes 
  });

  if (error) {
    console.error('Error getting dogs needing potty break:', error);
    throw error;
  }

  return data || [];
};

// Delete a potty break session
export const deletePottyBreakSession = async (sessionId: string): Promise<void> => {
  const { error } = await supabase
    .from('potty_break_sessions')
    .delete()
    .eq('id', sessionId);

  if (error) {
    console.error('Error deleting potty break session:', error);
    throw error;
  }
};
