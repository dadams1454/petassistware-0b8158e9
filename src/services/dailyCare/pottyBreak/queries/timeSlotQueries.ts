import { supabase } from '@/integrations/supabase/client';

export interface TimeSlot {
  id: string;
  time: string;
  dogs: {
    id: string;
    name: string;
    photo_url?: string | null;
  }[];
}

export async function fetchPottyBreakTimeSlots(date: Date = new Date()): Promise<TimeSlot[]> {
  try {
    // Convert date to ISO string and get just the date part (YYYY-MM-DD)
    const dateString = date.toISOString().split('T')[0];
    
    // Fetch all potty break sessions for the given date
    const { data, error } = await supabase
      .from('potty_break_sessions')
      .select(`
        id,
        session_time,
        potty_break_dogs!inner(
          dog_id,
          dogs!inner(
            id,
            name,
            photo_url
          )
        )
      `)
      .gte('session_time', `${dateString}T00:00:00`)
      .lte('session_time', `${dateString}T23:59:59`);
    
    if (error) throw error;
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }
    
    // Transform the data into the expected format
    return data.map(session => {
      // Ensure we handle the session_time correctly
      const sessionTime = session.session_time ? 
        new Date(session.session_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 
        'Unknown time';
      
      // Extract dogs from the session
      const dogs = Array.isArray(session.potty_break_dogs) ? 
        session.potty_break_dogs.map(entry => entry.dogs) : 
        [];
      
      return {
        id: session.id,
        time: sessionTime,
        dogs
      };
    });
  } catch (error) {
    console.error('Error fetching potty break time slots:', error);
    return [];
  }
}
