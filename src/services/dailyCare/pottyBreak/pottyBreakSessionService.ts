
import { supabase } from '@/integrations/supabase/client';
import { PottyBreakSession, PottyBreakCreate } from './types';

// Create a new potty break session
export const createPottyBreakSession = async (data: PottyBreakCreate, userId?: string): Promise<PottyBreakSession> => {
  try {
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
      throw new Error(`Failed to create potty break session: ${sessionError.message}`);
    }

    if (!session) {
      throw new Error('Failed to create potty break session: No session data returned');
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
        
        // Try to clean up the session if we couldn't add dogs
        try {
          await supabase
            .from('potty_break_sessions')
            .delete()
            .eq('id', session.id);
        } catch (cleanupError) {
          console.error('Error cleaning up session after dog association failure:', cleanupError);
        }
        
        throw new Error(`Failed to associate dogs with potty break: ${dogsError.message}`);
      }
    }

    return session;
  } catch (error) {
    console.error('Unexpected error in createPottyBreakSession:', error);
    throw error;
  }
};

// Get a single potty break session with dogs
export const getPottyBreakSession = async (sessionId: string): Promise<PottyBreakSession | null> => {
  try {
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
      throw new Error(`Failed to fetch potty break session: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Unexpected error in getPottyBreakSession:', error);
    throw error;
  }
};

// Delete a potty break session
export const deletePottyBreakSession = async (sessionId: string): Promise<void> => {
  try {
    // First delete the associated dog records
    const { error: dogsError } = await supabase
      .from('potty_break_dogs')
      .delete()
      .eq('session_id', sessionId);
    
    if (dogsError) {
      console.error('Error deleting potty break dogs:', dogsError);
      throw new Error(`Failed to delete potty break dogs: ${dogsError.message}`);
    }

    // Then delete the session itself
    const { error } = await supabase
      .from('potty_break_sessions')
      .delete()
      .eq('id', sessionId);

    if (error) {
      console.error('Error deleting potty break session:', error);
      throw new Error(`Failed to delete potty break session: ${error.message}`);
    }
  } catch (error) {
    console.error('Unexpected error in deletePottyBreakSession:', error);
    throw error;
  }
};

// Get recent potty break sessions
export const getRecentPottyBreakSessions = async (limit: number = 5): Promise<PottyBreakSession[]> => {
  try {
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
      throw new Error(`Failed to fetch recent potty break sessions: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error in getRecentPottyBreakSessions:', error);
    // Return empty array instead of throwing to allow UI to gracefully handle the error
    return [];
  }
};
