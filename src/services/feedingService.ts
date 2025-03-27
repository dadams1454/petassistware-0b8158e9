
import { supabase } from '@/integrations/supabase/client';
import { 
  FeedingRecord, 
  FeedingSchedule,
  FeedingFormData,
  FeedingStats
} from '@/types/feeding';

// Type for data needed to create a feeding record
export interface FeedingRecordCreateData {
  dog_id: string;
  food_type: string;
  amount_offered: string;
  amount_consumed: string;
  timestamp: Date;
  notes?: string;
  schedule_id?: string;
  meal_type: string;
  refused: boolean;
  staff_id: string;
}

// Type for data needed to update a feeding record
export interface FeedingRecordUpdateData {
  food_type: string;
  amount_offered: string;
  amount_consumed: string;
  timestamp: Date;
  notes?: string;
  schedule_id?: string;
  meal_type: string;
  refused: boolean;
}

// Type for data needed to create a feeding schedule
export interface FeedingScheduleCreateData {
  dog_id: string;
  food_type: string;
  amount: string;
  unit: string;
  schedule_time: string[];
  special_instructions?: string;
  active: boolean;
}

// Type for data needed to update a feeding schedule
export interface FeedingScheduleUpdateData {
  food_type: string;
  amount?: string;
  unit?: string;
  schedule_time?: string[];
  special_instructions?: string;
  active?: boolean;
}

// Helper function to extract proper meal_type and refused properties
const castFeedingRecord = (record: any): FeedingRecord => {
  return {
    id: record.id,
    dog_id: record.dog_id,
    food_type: record.food_type,
    amount_offered: record.amount_offered,
    amount_consumed: record.amount_consumed,
    timestamp: record.timestamp,
    created_at: record.created_at,
    notes: record.notes,
    staff_id: record.staff_id,
    schedule_id: record.schedule_id,
    meal_type: record.meal_type || 'regular',
    refused: record.refused || false,
    created_by: record.created_by || '',
    category: record.category || 'feeding',
    task_name: record.task_name || 'Feeding'
  };
};

/**
 * Fetch feeding schedules for a dog
 */
export const fetchFeedingSchedules = async (dogId: string): Promise<FeedingSchedule[]> => {
  try {
    const { data, error } = await supabase
      .from('feeding_schedules')
      .select('*')
      .eq('dog_id', dogId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching feeding schedules:', error);
    throw error;
  }
};

/**
 * Get a feeding schedule by ID
 */
export const getFeedingScheduleById = async (scheduleId: string): Promise<FeedingSchedule | null> => {
  try {
    const { data, error } = await supabase
      .from('feeding_schedules')
      .select('*')
      .eq('id', scheduleId)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching feeding schedule:', error);
    throw error;
  }
};

/**
 * Create a new feeding schedule
 */
export const createFeedingSchedule = async (data: FeedingScheduleCreateData): Promise<FeedingSchedule> => {
  try {
    const { data: schedule, error } = await supabase
      .from('feeding_schedules')
      .insert({
        dog_id: data.dog_id,
        food_type: data.food_type,
        amount: data.amount,
        unit: data.unit,
        schedule_time: data.schedule_time,
        special_instructions: data.special_instructions,
        active: data.active
      })
      .select('*')
      .single();
      
    if (error) throw error;
    return schedule;
  } catch (error) {
    console.error('Error creating feeding schedule:', error);
    throw error;
  }
};

/**
 * Update a feeding schedule
 */
export const updateFeedingSchedule = async (
  scheduleId: string,
  data: Partial<FeedingScheduleUpdateData>
): Promise<FeedingSchedule> => {
  try {
    const { data: schedule, error } = await supabase
      .from('feeding_schedules')
      .update({
        food_type: data.food_type,
        amount: data.amount,
        unit: data.unit,
        schedule_time: data.schedule_time,
        special_instructions: data.special_instructions,
        active: data.active !== undefined ? data.active : undefined
      })
      .eq('id', scheduleId)
      .select('*')
      .single();
      
    if (error) throw error;
    return schedule;
  } catch (error) {
    console.error('Error updating feeding schedule:', error);
    throw error;
  }
};

/**
 * Delete a feeding schedule
 */
export const deleteFeedingSchedule = async (scheduleId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('feeding_schedules')
      .delete()
      .eq('id', scheduleId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting feeding schedule:', error);
    throw error;
  }
};

/**
 * Fetch feeding records for a dog
 */
export const fetchFeedingRecords = async (dogId: string): Promise<FeedingRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('feeding_records')
      .select('*')
      .eq('dog_id', dogId)
      .order('timestamp', { ascending: false });
      
    if (error) throw error;
    return (data || []).map(record => castFeedingRecord(record));
  } catch (error) {
    console.error('Error fetching feeding records:', error);
    throw error;
  }
};

/**
 * Create a new feeding record
 */
export const createFeedingRecord = async (
  data: FeedingFormData,
  staffId: string
): Promise<FeedingRecord> => {
  try {
    const recordData: FeedingRecordCreateData = {
      dog_id: data.dog_id,
      food_type: data.food_type,
      amount_offered: data.amount_offered,
      amount_consumed: data.amount_consumed || '0',
      timestamp: typeof data.timestamp === 'string' ? new Date(data.timestamp) : data.timestamp,
      notes: data.notes,
      schedule_id: data.schedule_id,
      meal_type: data.meal_type || 'regular',
      refused: data.refused || false,
      staff_id: staffId
    };
    
    const { data: newRecord, error } = await supabase
      .from('feeding_records')
      .insert(recordData)
      .select('*')
      .single();
      
    if (error) throw error;
    return castFeedingRecord(newRecord);
  } catch (error) {
    console.error('Error creating feeding record:', error);
    throw error;
  }
};

/**
 * Update a feeding record
 */
export const updateFeedingRecord = async (
  recordId: string,
  data: FeedingRecordUpdateData
): Promise<FeedingRecord> => {
  try {
    const { data: updatedRecord, error } = await supabase
      .from('feeding_records')
      .update({
        food_type: data.food_type,
        amount_offered: data.amount_offered,
        amount_consumed: data.amount_consumed,
        timestamp: data.timestamp,
        notes: data.notes,
        schedule_id: data.schedule_id,
        meal_type: data.meal_type || 'regular',
        refused: data.refused !== undefined ? data.refused : false
      })
      .eq('id', recordId)
      .select('*')
      .single();
      
    if (error) throw error;
    return castFeedingRecord(updatedRecord);
  } catch (error) {
    console.error('Error updating feeding record:', error);
    throw error;
  }
};

/**
 * Delete a feeding record
 */
export const deleteFeedingRecord = async (recordId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('feeding_records')
      .delete()
      .eq('id', recordId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting feeding record:', error);
    throw error;
  }
};

/**
 * Calculate feeding statistics for a dog
 */
export const fetchFeedingStats = async (
  dogId: string,
  timeframe: 'day' | 'week' | 'month' = 'week'
): Promise<FeedingStats> => {
  try {
    // Get all feeding records for the dog
    const { data, error } = await supabase
      .from('feeding_records')
      .select('*')
      .eq('dog_id', dogId)
      .order('timestamp', { ascending: false });
      
    if (error) throw error;
    
    const records = (data || []).map(record => castFeedingRecord(record));
    
    // Calculate statistics
    const totalMeals = records.length;
    const totalAmountConsumed = records.reduce((sum, record) => {
      const amount = parseFloat(record.amount_consumed) || 0;
      return sum + amount;
    }, 0);
    
    const mealsRefused = records.filter(record => record.refused).length;
    const refusalRate = totalMeals > 0 ? mealsRefused / totalMeals : 0;
    
    // Calculate meal breakdown
    const mealBreakdown: Record<string, number> = {};
    records.forEach(record => {
      const mealType = record.meal_type || 'regular';
      mealBreakdown[mealType] = (mealBreakdown[mealType] || 0) + 1;
    });
    
    // Calculate average amount offered
    const totalAmountOffered = records.reduce((sum, record) => {
      const amount = parseFloat(record.amount_offered) || 0;
      return sum + amount;
    }, 0);
    const avgAmountOffered = totalMeals > 0 ? totalAmountOffered / totalMeals : 0;
    
    return {
      totalMeals,
      totalAmountConsumed,
      refusalRate,
      mealBreakdown,
      avgAmountOffered,
      mealsRefused
    };
  } catch (error) {
    console.error('Error calculating feeding stats:', error);
    throw error;
  }
};
