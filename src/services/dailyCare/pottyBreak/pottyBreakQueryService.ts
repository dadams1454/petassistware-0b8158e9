
import { supabase } from '@/integrations/supabase/client';
import { format, startOfDay, endOfDay } from 'date-fns';

// Get all potty breaks by dog ID and time slot for a given day
export const getPottyBreaksByDogAndTimeSlot = async (date: Date): Promise<Record<string, string[]>> => {
  const startTime = startOfDay(date);
  const endTime = endOfDay(date);
  const dateStr = format(date, 'yyyy-MM-dd');
  
  try {
    // First check if we have saved potty break data in local storage
    const storedBreaks = localStorage.getItem(`potty_breaks_${dateStr}`);
    if (storedBreaks) {
      console.log(`Loaded potty breaks from local storage for ${dateStr}`);
      return JSON.parse(storedBreaks);
    }
    
    // If not in local storage, fetch from database
    console.log(`Fetching potty breaks from database for ${dateStr}`);
    const { data, error } = await supabase
      .from('potty_break_dogs')
      .select(`
        dog_id,
        session:session_id(
          session_time,
          notes
        )
      `)
      .gte('session:session_id.session_time', startTime.toISOString())
      .lte('session:session_id.session_time', endTime.toISOString());

    if (error) {
      console.error('Error fetching potty breaks by dog and time slot:', error);
      throw error;
    }

    // Organize data by dog and time slot
    const result: Record<string, string[]> = {};
    
    if (data && data.length > 0) {
      data.forEach(item => {
        if (!item.session) return;
        
        const dogId = item.dog_id;
        // Extract time from session_time or from notes (which might contain the time slot)
        const sessionDate = new Date(item.session.session_time);
        const timeSlot = extractTimeSlotFromNote(item.session.notes) || 
                        formatTimeSlot(sessionDate.getHours(), sessionDate.getMinutes());
        
        if (!result[dogId]) {
          result[dogId] = [];
        }
        
        // Add the time slot if it doesn't already exist
        if (!result[dogId].includes(timeSlot)) {
          result[dogId].push(timeSlot);
        }
      });
    }
    
    // Save to local storage for future quick access
    localStorage.setItem(`potty_breaks_${dateStr}`, JSON.stringify(result));
    
    return result;
  } catch (error) {
    console.error('Error in getPottyBreaksByDogAndTimeSlot:', error);
    return {};
  }
};

// Save potty breaks by dog and time slot for a given day
export const savePottyBreaksByDogAndTimeSlot = async (date: Date, data: Record<string, string[]>): Promise<void> => {
  const dateStr = format(date, 'yyyy-MM-dd');
  try {
    // Save to local storage for persistence
    localStorage.setItem(`potty_breaks_${dateStr}`, JSON.stringify(data));
    console.log(`Saved potty breaks to local storage for ${dateStr}`, data);
    
    // No need to save to database here as individual potty breaks are logged via logDogPottyBreak
    // This function primarily ensures the UI state is preserved
  } catch (error) {
    console.error('Error saving potty breaks:', error);
    throw error;
  }
};

// Helper to extract time slot from note text (e.g., "Potty break at 8:00 AM")
const extractTimeSlotFromNote = (note: string | null): string | null => {
  if (!note) return null;
  
  // Look for patterns like "at 8:00 AM" or similar
  const match = note.match(/at\s+(\d+:\d+\s*[AP]M)/i);
  if (match && match[1]) {
    return match[1].trim();
  }
  return null;
};

// Format hours and minutes to a time slot string (e.g., "8:00 AM")
const formatTimeSlot = (hours: number, minutes: number): string => {
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
  const formattedMinutes = minutes.toString().padStart(2, '0');
  return `${formattedHours}:${formattedMinutes} ${period}`;
};

// Get potty breaks for a specific dog
export const getDogPottyBreaks = async (dogId: string, date: Date): Promise<any[]> => {
  const startTime = startOfDay(date);
  const endTime = endOfDay(date);
  
  const { data, error } = await supabase
    .from('potty_break_dogs')
    .select(`
      id,
      session:session_id(
        id,
        session_time,
        notes
      )
    `)
    .eq('dog_id', dogId)
    .gte('session:session_id.session_time', startTime.toISOString())
    .lte('session:session_id.session_time', endTime.toISOString())
    .order('session:session_id.session_time', { ascending: false });

  if (error) {
    console.error('Error fetching dog potty breaks:', error);
    throw error;
  }

  return data || [];
};
