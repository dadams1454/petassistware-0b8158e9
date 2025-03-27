
import { supabase } from '@/integrations/supabase/client';
import { FeedingSchedule, FeedingRecord, FeedingFormData, FeedingScheduleFormData, FeedingStats } from '@/types/feeding';
import { CareCategory } from '@/types/careRecord';

/**
 * Fetches all feeding schedules for a dog
 */
export const fetchDogFeedingSchedules = async (dogId: string): Promise<FeedingSchedule[]> => {
  const { data, error } = await supabase
    .from('feeding_schedules')
    .select('*')
    .eq('dog_id', dogId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching feeding schedules:', error);
    throw error;
  }

  return data as FeedingSchedule[] || [];
};

/**
 * Fetches a specific feeding schedule by ID
 */
export const fetchFeedingSchedule = async (scheduleId: string): Promise<FeedingSchedule | null> => {
  const { data, error } = await supabase
    .from('feeding_schedules')
    .select('*')
    .eq('id', scheduleId)
    .single();

  if (error) {
    console.error('Error fetching feeding schedule:', error);
    throw error;
  }

  return data as FeedingSchedule;
};

/**
 * Creates a new feeding schedule
 */
export const createFeedingSchedule = async (
  data: FeedingScheduleFormData
): Promise<FeedingSchedule | null> => {
  const { data: newSchedule, error } = await supabase
    .from('feeding_schedules')
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error('Error creating feeding schedule:', error);
    throw error;
  }

  return newSchedule as FeedingSchedule;
};

/**
 * Updates an existing feeding schedule
 */
export const updateFeedingSchedule = async (
  scheduleId: string,
  data: Partial<FeedingScheduleFormData>
): Promise<FeedingSchedule | null> => {
  const { data: updatedSchedule, error } = await supabase
    .from('feeding_schedules')
    .update(data)
    .eq('id', scheduleId)
    .select()
    .single();

  if (error) {
    console.error('Error updating feeding schedule:', error);
    throw error;
  }

  return updatedSchedule as FeedingSchedule;
};

/**
 * Deletes a feeding schedule
 */
export const deleteFeedingSchedule = async (scheduleId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('feeding_schedules')
    .delete()
    .eq('id', scheduleId);

  if (error) {
    console.error('Error deleting feeding schedule:', error);
    throw error;
  }

  return true;
};

/**
 * Fetches feeding records for a dog
 */
export const fetchDogFeedingRecords = async (
  dogId: string, 
  limit?: number
): Promise<FeedingRecord[]> => {
  try {
    // Fetch specific feeding records
    const { data: feedingRecords, error: feedingError } = await supabase
      .from('feeding_records')
      .select('*')
      .eq('dog_id', dogId)
      .order('timestamp', { ascending: false })
      .limit(limit || 100);

    if (feedingError) {
      console.error('Error fetching feeding records:', feedingError);
      throw feedingError;
    }

    // If we need to add additional properties to match FeedingRecord
    const enhancedRecords = (feedingRecords || []).map(record => ({
      ...record,
      category: 'feeding' as CareCategory,
      task_name: `Feeding: ${record.food_type || 'Meal'}`,
      created_by: record.staff_id || '',
      meal_type: record.meal_type || undefined,
      refused: record.refused || false
    })) as FeedingRecord[];
    
    return enhancedRecords;
  } catch (error) {
    console.error('Error fetching feeding records:', error);
    return [];
  }
};

/**
 * Creates a new feeding record
 */
export const createFeedingRecord = async (
  data: FeedingFormData,
  userId: string
): Promise<FeedingRecord | null> => {
  try {
    // Create specific feeding record
    const feedingData = {
      dog_id: data.dog_id,
      food_type: data.food_type,
      amount_offered: data.amount_offered,
      amount_consumed: data.amount_consumed || data.amount_offered, // Default to offered if not specified
      staff_id: userId,
      timestamp: data.timestamp.toISOString(),
      schedule_id: data.schedule_id,
      notes: data.notes,
      meal_type: data.meal_type,
      refused: data.refused
    };

    const { data: feedingRecordData, error: feedingError } = await supabase
      .from('feeding_records')
      .insert(feedingData)
      .select()
      .single();

    if (feedingError) {
      console.error('Error creating feeding record:', feedingError);
      throw feedingError;
    }

    // Enhance the record to match FeedingRecord type
    const enhancedRecord: FeedingRecord = {
      ...feedingRecordData,
      category: 'feeding',
      task_name: `Feeding: ${feedingRecordData.food_type}`,
      created_by: userId
    };

    return enhancedRecord;
  } catch (error) {
    console.error('Error creating feeding record:', error);
    throw error;
  }
};

/**
 * Updates an existing feeding record
 */
export const updateFeedingRecord = async (
  id: string,
  data: Partial<FeedingFormData>
): Promise<FeedingRecord | null> => {
  // Update the feeding record
  const updateData: any = {
    food_type: data.food_type,
    amount_offered: data.amount_offered,
    amount_consumed: data.amount_consumed,
    notes: data.notes,
    meal_type: data.meal_type,
    refused: data.refused
  };
  
  if (data.timestamp) {
    updateData.timestamp = data.timestamp.toISOString();
  }

  const { data: updatedFeedingRecord, error: updateError } = await supabase
    .from('feeding_records')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (updateError) {
    console.error('Error updating feeding record:', updateError);
    throw updateError;
  }

  // Enhance the record to match FeedingRecord type
  const enhancedRecord: FeedingRecord = {
    ...updatedFeedingRecord,
    category: 'feeding',
    task_name: `Feeding: ${updatedFeedingRecord.food_type}`,
    created_by: updatedFeedingRecord.staff_id
  };

  return enhancedRecord;
};

/**
 * Deletes a feeding record
 */
export const deleteFeedingRecord = async (id: string): Promise<boolean> => {
  // Delete the feeding record
  const { error: deleteError } = await supabase
    .from('feeding_records')
    .delete()
    .eq('id', id);

  if (deleteError) {
    console.error('Error deleting feeding record:', deleteError);
    throw deleteError;
  }

  return true;
};

/**
 * Calculates feeding statistics for a dog
 */
export const getFeedingStats = async (
  dogId: string, 
  timeframe: 'day' | 'week' | 'month' = 'week'
): Promise<FeedingStats> => {
  // Calculate start date based on timeframe
  const now = new Date();
  let startDate = new Date();
  
  if (timeframe === 'day') {
    startDate.setDate(now.getDate() - 1);
  } else if (timeframe === 'week') {
    startDate.setDate(now.getDate() - 7);
  } else if (timeframe === 'month') {
    startDate.setMonth(now.getMonth() - 1);
  }

  // Fetch feeding records for the timeframe
  const { data, error } = await supabase
    .from('feeding_records')
    .select('*')
    .eq('dog_id', dogId)
    .gte('timestamp', startDate.toISOString())
    .lte('timestamp', now.toISOString());

  if (error) {
    console.error('Error fetching feeding stats:', error);
    throw error;
  }

  // Process the data
  const feedingRecords = data || [];
  
  // Calculate statistics
  const stats: FeedingStats = {
    totalMeals: feedingRecords.length,
    totalAmountConsumed: 0,
    averageConsumption: 0,
    mealsRefused: 0,
    mealsByType: {}
  };

  // Process records to calculate statistics
  feedingRecords.forEach(record => {
    // Count meals by type
    const mealType = record.meal_type || 'unknown';
    stats.mealsByType[mealType] = (stats.mealsByType[mealType] || 0) + 1;
    
    // Count refused meals
    if (record.refused) {
      stats.mealsRefused++;
    }
    
    // Track consumption (this would need standardization for accurate tracking)
    // For now we'll just count non-empty values
    if (record.amount_consumed) {
      stats.totalAmountConsumed++;
    }
  });

  // Calculate average consumption
  stats.averageConsumption = stats.totalMeals > 0 
    ? stats.totalAmountConsumed / stats.totalMeals 
    : 0;

  return stats;
};
