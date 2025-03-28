
import { supabase } from '@/integrations/supabase/client';
import { recordDogLetOutAsCareLog } from '../dogLetOutIntegrationService';

// Log a dog let out
export const logDogLetOut = async (dogId: string, timeSlot: string, userId?: string): Promise<any> => {
  try {
    // Get the timestamp from the timeSlot string
    const now = new Date();
    const [timePart, amPm] = timeSlot.split(' ');
    const [hourStr] = timePart.split(':');
    let hour = parseInt(hourStr);
    
    // Convert to 24-hour format
    if (amPm === 'PM' && hour < 12) hour += 12;
    if (amPm === 'AM' && hour === 12) hour = 0;
    
    // Create a date with the current day but the specified hour
    const letOutTime = new Date(now);
    letOutTime.setHours(hour, 0, 0, 0);
    
    // Create a session
    const { data: sessionData, error: sessionError } = await supabase
      .from('potty_break_sessions')
      .insert({
        session_time: letOutTime.toISOString(),
        notes: `Dog let out at ${timeSlot}`,
        created_by: userId
      })
      .select()
      .single();

    if (sessionError) {
      console.error('Error creating dog let out session:', sessionError);
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
      console.error('Error associating dog with let out session:', dogError);
      throw dogError;
    }

    // Record as a care log
    if (userId) {
      await recordDogLetOutAsCareLog(
        dogId, 
        sessionData.session_time, 
        userId, 
        `Dog let out at ${timeSlot}`
      );
    }

    return { session: sessionData, dogSession: dogData };
  } catch (error) {
    console.error('Error in logDogLetOut:', error);
    throw error;
  }
};

// Remove a dog let out
export const removeDogLetOut = async (dogId: string, sessionId: string): Promise<void> => {
  try {
    // First remove the dog from the session
    const { error: dogError } = await supabase
      .from('potty_break_dogs')
      .delete()
      .eq('dog_id', dogId)
      .eq('session_id', sessionId);

    if (dogError) {
      console.error('Error removing dog from let out session:', dogError);
      throw dogError;
    }

    // Check if any dogs remain in the session
    const { count, error: countError } = await supabase
      .from('potty_break_dogs')
      .select('*', { count: 'exact' })
      .eq('session_id', sessionId);

    if (countError) {
      console.error('Error counting remaining dogs in session:', countError);
      throw countError;
    }

    // If no dogs remain, delete the session
    if (count === 0) {
      const { error: sessionError } = await supabase
        .from('potty_break_sessions')
        .delete()
        .eq('id', sessionId);

      if (sessionError) {
        console.error('Error deleting empty let out session:', sessionError);
        throw sessionError;
      }
    }
  } catch (error) {
    console.error('Error in removeDogLetOut:', error);
    throw error;
  }
};

// Log multiple dogs let out at once (group let out)
export const logGroupDogLetOut = async (
  dogIds: string[], 
  timeSlot: string, 
  userId?: string,
  groupName?: string
): Promise<any> => {
  try {
    if (!dogIds.length) return null;
    
    // Get the timestamp from the timeSlot string
    const now = new Date();
    const [timePart, amPm] = timeSlot.split(' ');
    const [hourStr] = timePart.split(':');
    let hour = parseInt(hourStr);
    
    // Convert to 24-hour format
    if (amPm === 'PM' && hour < 12) hour += 12;
    if (amPm === 'AM' && hour === 12) hour = 0;
    
    // Create a date with the current day but the specified hour
    const letOutTime = new Date(now);
    letOutTime.setHours(hour, 0, 0, 0);
    
    // Create a session
    const groupNote = groupName 
      ? `Group "${groupName}" let out at ${timeSlot}`
      : `Group let out at ${timeSlot}`;
    
    const { data: sessionData, error: sessionError } = await supabase
      .from('potty_break_sessions')
      .insert({
        session_time: letOutTime.toISOString(),
        notes: groupNote,
        created_by: userId
      })
      .select()
      .single();

    if (sessionError) {
      console.error('Error creating group let out session:', sessionError);
      throw sessionError;
    }

    // Associate all dogs with the session
    const dogEntries = dogIds.map(dogId => ({
      dog_id: dogId,
      session_id: sessionData.id
    }));
    
    const { error: dogsError } = await supabase
      .from('potty_break_dogs')
      .insert(dogEntries);

    if (dogsError) {
      console.error('Error associating dogs with let out session:', dogsError);
      throw dogsError;
    }

    // Record as care logs for each dog
    if (userId) {
      const careLogPromises = dogIds.map(dogId => 
        recordDogLetOutAsCareLog(
          dogId, 
          sessionData.session_time, 
          userId, 
          groupNote
        )
      );
      
      await Promise.all(careLogPromises);
    }

    return { session: sessionData, dogCount: dogIds.length };
  } catch (error) {
    console.error('Error in logGroupDogLetOut:', error);
    throw error;
  }
};
