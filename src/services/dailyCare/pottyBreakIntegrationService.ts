
import { supabase } from '@/integrations/supabase/client';
import { DailyCarelog } from '@/types/dailyCare';

/**
 * Records a potty break as a daily care log to ensure it appears in the dog's care history
 */
export const recordPottyBreakAsCareLog = async (
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
      category: 'Potty Breaks',
      task_name: 'Potty Break',
      timestamp,
      notes: notes || `Dog was taken outside at ${formattedTime}`,
      created_by: userId
    };
    
    const { data, error } = await supabase
      .from('daily_care_logs')
      .insert([careLogData])
      .select()
      .single();
    
    if (error) {
      console.error('Error recording potty break as care log:', error);
      throw error;
    }
    
    return data as DailyCarelog;
  } catch (error) {
    console.error('Error in recordPottyBreakAsCareLog:', error);
    return null;
  }
};

/**
 * Gets all potty break care logs for a specific dog
 */
export const getPottyBreakLogsForDog = async (dogId: string): Promise<DailyCarelog[]> => {
  try {
    const { data, error } = await supabase
      .from('daily_care_logs')
      .select('*')
      .eq('dog_id', dogId)
      .eq('category', 'Potty Breaks')
      .order('timestamp', { ascending: false });
    
    if (error) {
      console.error('Error fetching potty break logs:', error);
      throw error;
    }
    
    return data as DailyCarelog[];
  } catch (error) {
    console.error('Error in getPottyBreakLogsForDog:', error);
    return [];
  }
};
