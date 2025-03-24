
import { supabase } from '@/integrations/supabase/client';

export interface CareActivity {
  id: string;
  dog_id: string;
  activity_type: 'potty' | 'feeding' | 'grooming' | 'training';
  timestamp: string;
  notes?: string;
  performed_by?: string;
  created_at: string;
}

export async function recordCareActivity(activity: Omit<CareActivity, 'id' | 'created_at'>): Promise<CareActivity> {
  try {
    const { data, error } = await supabase
      .from('care_activities')
      .insert([activity])
      .select()
      .single();
    
    if (error) throw error;
    return data as CareActivity;
  } catch (error) {
    console.error('Error recording care activity:', error);
    throw error;
  }
}

export async function getRecentCareActivities(dogId: string, activityType?: CareActivity['activity_type']): Promise<CareActivity[]> {
  try {
    let query = supabase
      .from('care_activities')
      .select('*')
      .eq('dog_id', dogId)
      .order('timestamp', { ascending: false });
    
    if (activityType) {
      query = query.eq('activity_type', activityType);
    }
    
    const { data, error } = await query.limit(20);
    
    if (error) throw error;
    return data as CareActivity[] || [];
  } catch (error) {
    console.error('Error fetching care activities:', error);
    return [];
  }
}

export async function getLastCareActivity(dogId: string, activityType: CareActivity['activity_type']): Promise<CareActivity | null> {
  try {
    const { data, error } = await supabase
      .from('care_activities')
      .select('*')
      .eq('dog_id', dogId)
      .eq('activity_type', activityType)
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      // No rows returned isn't really an error in this context
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }
    
    return data as CareActivity;
  } catch (error) {
    console.error('Error fetching last care activity:', error);
    return null;
  }
}
