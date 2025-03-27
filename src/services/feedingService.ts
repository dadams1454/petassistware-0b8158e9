
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

  return data || [];
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

  return data;
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

  return newSchedule;
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

  return updatedSchedule;
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
  // First fetch feeding records from daily_care_logs with category 'feeding'
  const { data: careRecords, error: careError } = await supabase
    .from('daily_care_logs')
    .select('*')
    .eq('dog_id', dogId)
    .eq('category', 'feeding')
    .order('timestamp', { ascending: false })
    .limit(limit || 100);

  if (careError) {
    console.error('Error fetching feeding records from care logs:', careError);
    throw careError;
  }

  // Then fetch specific feeding records
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

  // Convert care records to feeding records format
  const careRecordsConverted = (careRecords || []).map(record => ({
    ...record,
    food_type: '',
    amount_offered: '',
    amount_consumed: '',
  }));

  // Combine both record types, sorted by timestamp
  const combinedRecords = [...careRecordsConverted, ...(feedingRecords || [])].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  // Limit the results if needed
  return limit ? combinedRecords.slice(0, limit) : combinedRecords;
};

/**
 * Creates a new feeding record
 */
export const createFeedingRecord = async (
  data: FeedingFormData,
  userId: string
): Promise<FeedingRecord | null> => {
  // Create care record entry
  const careRecord = {
    dog_id: data.dog_id,
    category: 'feeding' as CareCategory,
    task_name: `${data.meal_type || 'Meal'}: ${data.food_type}`,
    timestamp: data.timestamp,
    notes: data.notes || '',
    created_by: userId
  };

  const { data: careRecordData, error: careError } = await supabase
    .from('daily_care_logs')
    .insert(careRecord)
    .select()
    .single();

  if (careError) {
    console.error('Error creating care record for feeding:', careError);
    throw careError;
  }

  // Create specific feeding record
  const feedingData = {
    dog_id: data.dog_id,
    food_type: data.food_type,
    amount_offered: data.amount_offered,
    amount_consumed: data.amount_consumed || data.amount_offered, // Default to offered if not specified
    staff_id: userId,
    timestamp: data.timestamp,
    schedule_id: data.schedule_id,
    notes: data.notes
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

  // Combine the records
  return {
    ...careRecordData,
    ...feedingRecordData,
    food_type: feedingRecordData.food_type,
    amount_offered: feedingRecordData.amount_offered,
    amount_consumed: feedingRecordData.amount_consumed
  };
};

/**
 * Updates an existing feeding record
 */
export const updateFeedingRecord = async (
  id: string,
  data: Partial<FeedingFormData>
): Promise<FeedingRecord | null> => {
  // First get the existing feeding record to know which tables to update
  const { data: existingRecord, error: fetchError } = await supabase
    .from('feeding_records')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError) {
    console.error('Error fetching existing feeding record:', fetchError);
    throw fetchError;
  }

  // Update the feeding record
  const { data: updatedFeedingRecord, error: updateError } = await supabase
    .from('feeding_records')
    .update({
      food_type: data.food_type,
      amount_offered: data.amount_offered,
      amount_consumed: data.amount_consumed,
      notes: data.notes,
      timestamp: data.timestamp
    })
    .eq('id', id)
    .select()
    .single();

  if (updateError) {
    console.error('Error updating feeding record:', updateError);
    throw updateError;
  }

  // Also update the related care record if there is one
  if (existingRecord && existingRecord.care_record_id) {
    const { error: careUpdateError } = await supabase
      .from('daily_care_logs')
      .update({
        task_name: `${data.meal_type || 'Meal'}: ${data.food_type}`,
        notes: data.notes,
        timestamp: data.timestamp
      })
      .eq('id', existingRecord.care_record_id);

    if (careUpdateError) {
      console.error('Error updating care record for feeding:', careUpdateError);
      // Don't throw here, we still updated the feeding record
    }
  }

  return updatedFeedingRecord;
};

/**
 * Deletes a feeding record
 */
export const deleteFeedingRecord = async (id: string): Promise<boolean> => {
  // First get the existing feeding record to know which tables to update
  const { data: existingRecord, error: fetchError } = await supabase
    .from('feeding_records')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError) {
    console.error('Error fetching existing feeding record:', fetchError);
    throw fetchError;
  }

  // Delete the feeding record
  const { error: deleteError } = await supabase
    .from('feeding_records')
    .delete()
    .eq('id', id);

  if (deleteError) {
    console.error('Error deleting feeding record:', deleteError);
    throw deleteError;
  }

  // Also delete the related care record if there is one
  if (existingRecord && existingRecord.care_record_id) {
    const { error: careDeleteError } = await supabase
      .from('daily_care_logs')
      .delete()
      .eq('id', existingRecord.care_record_id);

    if (careDeleteError) {
      console.error('Error deleting care record for feeding:', careDeleteError);
      // Don't throw here, we still deleted the feeding record
    }
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
