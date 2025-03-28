
import { supabase } from '@/integrations/supabase/client';
import { DailyCarelog } from '@/types/dailyCare';

/**
 * Records a dog let out as a daily care log to ensure it appears in the dog's care history
 */
export const recordDogLetOutAsCareLog = async (
  dogId: string, 
  timestamp: string, 
  userId: string,
  notes?: string
): Promise<DailyCarelog | null> => {
  try {
    // Format the time for display in the notes if not provided
    const formattedTime = new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    const careLogData = {
      dog_id: dogId,
      category: 'Dog Let Out',
      task_name: 'Let Out',
      timestamp,
      notes: notes || `Dog was let out at ${formattedTime}`,
      created_by: userId
    };
    
    const { data, error } = await supabase
      .from('daily_care_logs')
      .insert([careLogData])
      .select()
      .single();
    
    if (error) {
      console.error('Error recording dog let out as care log:', error);
      throw error;
    }
    
    return data as DailyCarelog;
  } catch (error) {
    console.error('Error in recordDogLetOutAsCareLog:', error);
    return null;
  }
};

/**
 * Gets all dog let out care logs for a specific dog
 */
export const getDogLetOutLogsForDog = async (dogId: string): Promise<DailyCarelog[]> => {
  try {
    const { data, error } = await supabase
      .from('daily_care_logs')
      .select('*')
      .eq('dog_id', dogId)
      .eq('category', 'Dog Let Out')
      .order('timestamp', { ascending: false });
    
    if (error) {
      console.error('Error fetching dog let out logs:', error);
      throw error;
    }
    
    return data as DailyCarelog[];
  } catch (error) {
    console.error('Error in getDogLetOutLogsForDog:', error);
    return [];
  }
};
