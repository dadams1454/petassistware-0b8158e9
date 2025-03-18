
import { supabase } from '@/integrations/supabase/client';
import { PottyBreakSession, PottyBreakCreate } from './types';

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

// Get recent potty break sessions
export const getRecentPottyBreakSessions = async (limit: number = 5): Promise<PottyBreakSession[]> => {
  const { data, error } = await supabase
    .from('potty_break_sessions')
    .select(`
      *,
      dogs:potty_break_dogs(
        *,
        dog:dog_id(
          id, 
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
