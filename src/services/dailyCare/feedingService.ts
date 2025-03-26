
import { supabase } from '@/integrations/supabase/client';
import { FeedingSchedule, FeedingRecord, FeedingHistoryFilters } from '@/types/feedingSchedule';

export async function createFeedingSchedule(schedule: Omit<FeedingSchedule, 'id' | 'created_at' | 'updated_at'>): Promise<FeedingSchedule> {
  try {
    const { data, error } = await supabase
      .from('feeding_schedules')
      .insert([{
        ...schedule,
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data as FeedingSchedule;
  } catch (error) {
    console.error('Error creating feeding schedule:', error);
    throw error;
  }
}

export async function updateFeedingSchedule(id: string, updates: Partial<FeedingSchedule>): Promise<FeedingSchedule> {
  try {
    const { data, error } = await supabase
      .from('feeding_schedules')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as FeedingSchedule;
  } catch (error) {
    console.error('Error updating feeding schedule:', error);
    throw error;
  }
}

export async function getDogFeedingSchedules(dogId: string): Promise<FeedingSchedule[]> {
  try {
    const { data, error } = await supabase
      .from('feeding_schedules')
      .select('*')
      .eq('dog_id', dogId)
      .eq('active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as FeedingSchedule[] || [];
  } catch (error) {
    console.error('Error fetching feeding schedules:', error);
    return [];
  }
}

export async function recordFeeding(record: Omit<FeedingRecord, 'id' | 'created_at'>): Promise<FeedingRecord> {
  try {
    const { data, error } = await supabase
      .from('feeding_records')
      .insert([record])
      .select()
      .single();
    
    if (error) throw error;
    return data as FeedingRecord;
  } catch (error) {
    console.error('Error recording feeding:', error);
    throw error;
  }
}

export async function getFeedingHistory(filters: FeedingHistoryFilters): Promise<FeedingRecord[]> {
  try {
    let query = supabase
      .from('feeding_records')
      .select('*');
    
    if (filters.dogId) {
      query = query.eq('dog_id', filters.dogId);
    }
    
    if (filters.startDate) {
      query = query.gte('timestamp', filters.startDate.toISOString());
    }
    
    if (filters.endDate) {
      query = query.lte('timestamp', filters.endDate.toISOString());
    }
    
    if (filters.foodType) {
      query = query.eq('food_type', filters.foodType);
    }
    
    const { data, error } = await query.order('timestamp', { ascending: false });
    
    if (error) throw error;
    return data as FeedingRecord[] || [];
  } catch (error) {
    console.error('Error fetching feeding history:', error);
    return [];
  }
}

export async function getLatestFeedings(dogId: string, limit: number = 5): Promise<FeedingRecord[]> {
  try {
    const { data, error } = await supabase
      .from('feeding_records')
      .select('*')
      .eq('dog_id', dogId)
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data as FeedingRecord[] || [];
  } catch (error) {
    console.error('Error fetching latest feedings:', error);
    return [];
  }
}
