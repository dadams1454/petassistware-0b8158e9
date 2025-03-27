import { supabase } from '@/integrations/supabase/client';
import { FeedingRecord, FeedingSchedule, FeedingStats } from '@/types/feeding';
import { format } from 'date-fns';

/**
 * Data required to create a new feeding record.
 */
export interface FeedingRecordCreateData {
  dog_id: string;
  food_type: string;
  amount_offered: string;
  amount_consumed: string;
  timestamp: Date;
  notes?: string;
  staff_id: string;
  schedule_id?: string;
}

/**
 * Data required to update an existing feeding record.
 */
export interface FeedingRecordUpdateData {
  food_type: string;
  amount_offered: string;
  amount_consumed: string;
  timestamp: Date;
  notes?: string;
  meal_type?: string;
  refused?: boolean;
  schedule_id?: string;
}

/**
 * Data required to create a new feeding schedule.
 */
export interface FeedingScheduleCreateData {
  dog_id: string;
  food_type: string;
  amount: string;
  unit: string;
  schedule_time: string;
  special_instructions?: string;
  active: boolean;
}

/**
 * Data required to update an existing feeding schedule.
 */
export interface FeedingScheduleUpdateData {
  food_type: string;
  amount: string;
  unit: string;
  schedule_time: string;
  special_instructions?: string;
  active: boolean;
}

/**
 * Fetches all feeding records for a specific dog.
 * @param dogId The ID of the dog.
 * @returns A promise that resolves to an array of feeding records.
 */
export const fetchFeedingRecords = async (dogId: string): Promise<FeedingRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('feeding_records')
      .select('*')
      .eq('dog_id', dogId)
      .order('timestamp', { ascending: false });

    if (error) throw error;

    // Transform the data to include the missing properties with default values
    return data.map(record => ({
      ...record,
      meal_type: record.meal_type || 'breakfast', // Add default if missing
      refused: record.refused || false, // Add default if missing
      created_by: record.staff_id, // Use staff_id as created_by
      category: 'feeding', // Add category
      task_name: 'Feeding Record' // Add task_name
    })) as FeedingRecord[];
  } catch (error) {
    console.error('Error fetching feeding records:', error);
    throw error;
  }
};

/**
 * Fetches a specific feeding record by its ID.
 * @param recordId The ID of the feeding record.
 * @returns A promise that resolves to a feeding record or null if not found.
 */
export const getFeedingRecordById = async (recordId: string): Promise<FeedingRecord | null> => {
  try {
    const { data, error } = await supabase
      .from('feeding_records')
      .select('*')
      .eq('id', recordId)
      .single();

    if (error) throw error;

    if (!data) return null;

    // Add missing properties
    return {
      ...data,
      meal_type: data.meal_type || 'breakfast',
      refused: data.refused || false,
      created_by: data.staff_id,
      category: 'feeding',
      task_name: 'Feeding Record'
    } as FeedingRecord;
  } catch (error) {
    console.error('Error fetching feeding record:', error);
    throw error;
  }
};

/**
 * Creates a new feeding record.
 * @param feedingData The data for the new feeding record.
 * @returns A promise that resolves when the feeding record is created.
 */
export const createFeedingRecord = async (feedingData: FeedingRecordCreateData): Promise<void> => {
  try {
    const { error } = await supabase
      .from('feeding_records')
      .insert({
        dog_id: feedingData.dog_id,
        food_type: feedingData.food_type,
        amount_offered: feedingData.amount_offered,
        amount_consumed: feedingData.amount_consumed,
        timestamp: feedingData.timestamp.toISOString(),
        notes: feedingData.notes,
        staff_id: feedingData.staff_id,
        schedule_id: feedingData.schedule_id
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error creating feeding record:', error);
    throw error;
  }
};

/**
 * Updates an existing feeding record.
 * @param recordId The ID of the feeding record to update.
 * @param feedingData The data to update the feeding record with.
 * @returns A promise that resolves when the feeding record is updated.
 */
export const updateFeedingRecord = async (
  recordId: string,
  feedingData: FeedingRecordUpdateData
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('feeding_records')
      .update({
        food_type: feedingData.food_type,
        amount_offered: feedingData.amount_offered,
        amount_consumed: feedingData.amount_consumed,
        timestamp: feedingData.timestamp.toISOString(),
        notes: feedingData.notes,
        meal_type: feedingData.meal_type || 'breakfast',
        refused: feedingData.refused || false,
        schedule_id: feedingData.schedule_id
      })
      .eq('id', recordId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating feeding record:', error);
    throw error;
  }
};

/**
 * Deletes a feeding record.
 * @param recordId The ID of the feeding record to delete.
 * @returns A promise that resolves when the feeding record is deleted.
 */
export const deleteFeedingRecord = async (recordId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('feeding_records')
      .delete()
      .eq('id', recordId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting feeding record:', error);
    throw error;
  }
};

/**
 * Fetches all feeding schedules for a specific dog.
 * @param dogId The ID of the dog.
 * @returns A promise that resolves to an array of feeding schedules.
 */
export const fetchFeedingSchedules = async (dogId: string): Promise<FeedingSchedule[]> => {
  try {
    const { data, error } = await supabase
      .from('feeding_schedules')
      .select('*')
      .eq('dog_id', dogId);

    if (error) throw error;

    return data as FeedingSchedule[];
  } catch (error) {
    console.error('Error fetching feeding schedules:', error);
    throw error;
  }
};

/**
 * Fetches a specific feeding schedule by its ID.
 * @param scheduleId The ID of the feeding schedule.
 * @returns A promise that resolves to a feeding schedule or null if not found.
 */
export const getFeedingScheduleById = async (scheduleId: string): Promise<FeedingSchedule | null> => {
  try {
    const { data, error } = await supabase
      .from('feeding_schedules')
      .select('*')
      .eq('id', scheduleId)
      .single();

    if (error) throw error;

    return data as FeedingSchedule | null;
  } catch (error) {
    console.error('Error fetching feeding schedule:', error);
    throw error;
  }
};

/**
 * Creates a new feeding schedule.
 * @param scheduleData The data for the new feeding schedule.
 * @returns A promise that resolves when the feeding schedule is created.
 */
export const createFeedingSchedule = async (scheduleData: FeedingScheduleCreateData): Promise<void> => {
  try {
    const { error } = await supabase
      .from('feeding_schedules')
      .insert({
        dog_id: scheduleData.dog_id,
        food_type: scheduleData.food_type,
        amount: scheduleData.amount,
        unit: scheduleData.unit,
        schedule_time: scheduleData.schedule_time,
        special_instructions: scheduleData.special_instructions,
        active: scheduleData.active
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error creating feeding schedule:', error);
    throw error;
  }
};

/**
 * Updates an existing feeding schedule.
 * @param scheduleId The ID of the feeding schedule to update.
 * @param scheduleData The data to update the feeding schedule with.
 * @returns A promise that resolves when the feeding schedule is updated.
 */
export const updateFeedingSchedule = async (
  scheduleId: string,
  scheduleData: FeedingScheduleUpdateData
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('feeding_schedules')
      .update({
        food_type: scheduleData.food_type,
        amount: scheduleData.amount,
        unit: scheduleData.unit,
        schedule_time: scheduleData.schedule_time,
        special_instructions: scheduleData.special_instructions,
        active: scheduleData.active
      })
      .eq('id', scheduleId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating feeding schedule:', error);
    throw error;
  }
};

/**
 * Deletes a feeding schedule.
 * @param scheduleId The ID of the feeding schedule to delete.
 * @returns A promise that resolves when the feeding schedule is deleted.
 */
export const deleteFeedingSchedule = async (scheduleId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('feeding_schedules')
      .delete()
      .eq('id', scheduleId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting feeding schedule:', error);
    throw error;
  }
};

/**
 * Fetches feeding statistics for a specific dog.
 * @param dogId The ID of the dog.
 * @returns A promise that resolves to a FeedingStats object.
 */
export const fetchDogFeedingStats = async (dogId: string): Promise<FeedingStats> => {
  try {
    const { data, error } = await supabase
      .from('feeding_records')
      .select('*')
      .eq('dog_id', dogId);

    if (error) throw error;

    // Transform to include missing properties
    const records = data.map(record => ({
      ...record,
      meal_type: record.meal_type || 'breakfast',
      refused: record.refused || false,
      created_by: record.staff_id,
      category: 'feeding',
      task_name: 'Feeding Record'
    })) as FeedingRecord[];

    // Helper function to calculate the average of an array of numbers
    const calculateAverage = (numbers: number[]): number => {
      if (numbers.length === 0) return 0;
      const sum = numbers.reduce((acc, val) => acc + val, 0);
      return sum / numbers.length;
    };

    // Helper function to calculate the refusal rate
    const calculateRefusalRate = (records: FeedingRecord[]): number => {
      const totalMeals = records.length;
      const refusedMeals = records.filter(record => record.refused).length;
      return totalMeals > 0 ? (refusedMeals / totalMeals) * 100 : 0;
    };

    // Helper function to calculate the meal type breakdown
    const calculateMealTypeBreakdown = (records: FeedingRecord[]): { [key: string]: number } => {
      const mealTypeCounts: { [key: string]: number } = {};
      records.forEach(record => {
        const mealType = record.meal_type || 'breakfast';
        mealTypeCounts[mealType] = (mealTypeCounts[mealType] || 0) + 1;
      });
      return mealTypeCounts;
    };
    
    // Calculate the average amount consumed
    const calculateAvgAmountConsumed = (records: FeedingRecord[]): number => {
      const validRecords = records.filter(record => record.amount_consumed !== null && record.amount_consumed !== undefined);
      if (validRecords.length === 0) {
        return 0;
      }
    
      const totalAmount = validRecords.reduce((sum, record) => {
        const amount = parseFloat(record.amount_consumed || '0');
        return sum + amount;
      }, 0);
    
      return totalAmount / validRecords.length;
    };

    // Return the stats object
    return {
      totalMeals: records.length,
      avgAmountConsumed: calculateAverage(records.map(r => parseFloat(r.amount_consumed || '0'))),
      refusalRate: calculateRefusalRate(records),
      mealBreakdown: calculateMealTypeBreakdown(records),
      avgAmountOffered: calculateAverage(records.map(r => parseFloat(r.amount_offered || '0'))),
    };
  } catch (error) {
    console.error('Error fetching feeding stats:', error);
    throw error;
  }
};

/**
 * Generates a report of feeding records within a specified date range.
 * @param startDate The start date of the report.
 * @param endDate The end date of the report.
 * @returns A promise that resolves to an array of feeding records within the date range.
 */
export const generateFeedingReport = async (startDate: Date, endDate: Date): Promise<FeedingRecord[]> => {
  try {
    const start = format(startDate, 'yyyy-MM-dd');
    const end = format(endDate, 'yyyy-MM-dd');

    const { data, error } = await supabase
      .from('feeding_records')
      .select('*')
      .gte('timestamp', start)
      .lte('timestamp', end);

    if (error) throw error;

    return data.map(record => ({
      ...record,
      meal_type: record.meal_type || 'breakfast',
      refused: record.refused || false,
      created_by: record.staff_id,
      category: 'feeding',
      task_name: 'Feeding Record'
    })) as FeedingRecord[];
  } catch (error) {
    console.error('Error generating feeding report:', error);
    throw error;
  }
};
