
import { supabase } from '@/integrations/supabase/client';
import { CareRecord, CareRecordFormData, CareCategory } from '@/types/careRecord';

/**
 * Fetch care records for a specific dog across all categories
 */
export const fetchDogCareRecords = async (
  dogId: string, 
  limit?: number, 
  categories?: CareCategory[]
): Promise<CareRecord[]> => {
  try {
    let query = supabase
      .from('daily_care_logs')
      .select('*')
      .eq('dog_id', dogId)
      .order('timestamp', { ascending: false });
      
    // Apply category filter if provided
    if (categories && categories.length > 0) {
      query = query.in('category', categories);
    }
    
    // Apply limit if provided
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
      
    if (error) {
      console.error('Error fetching care records:', error);
      throw error;
    }
    
    return data as CareRecord[];
  } catch (error) {
    console.error('Error in fetchDogCareRecords:', error);
    return [];
  }
};

/**
 * Fetch care records by category
 */
export const fetchCareRecordsByCategory = async (
  dogId: string, 
  category: CareCategory, 
  limit?: number
): Promise<CareRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('daily_care_logs')
      .select('*')
      .eq('dog_id', dogId)
      .eq('category', category)
      .order('timestamp', { ascending: false })
      .limit(limit || 20);
      
    if (error) {
      console.error(`Error fetching ${category} care records:`, error);
      throw error;
    }
    
    return data as CareRecord[];
  } catch (error) {
    console.error(`Error in fetchCareRecordsByCategory for ${category}:`, error);
    return [];
  }
};

/**
 * Create a new care record
 */
export const createCareRecord = async (
  data: CareRecordFormData, 
  userId: string
): Promise<CareRecord | null> => {
  try {
    // Format the timestamp to ISO string if it's a Date object
    const timestamp = data.timestamp instanceof Date
      ? data.timestamp.toISOString()
      : data.timestamp;
    
    // Format follow-up date if provided
    const follow_up_date = data.follow_up_date instanceof Date 
      ? data.follow_up_date.toISOString() 
      : data.follow_up_date;
    
    // Create the care record object
    const careRecord = {
      dog_id: data.dog_id,
      category: data.category,
      task_name: data.task_name,
      timestamp,
      notes: data.notes || null,
      created_by: userId,
      status: data.status || 'completed',
      assigned_to: data.assigned_to,
      scheduled_time: data.scheduled_time,
      follow_up_needed: data.follow_up_needed || false,
      follow_up_notes: data.follow_up_notes,
      follow_up_date
    };
    
    const { data: newRecord, error } = await supabase
      .from('daily_care_logs')
      .insert([careRecord])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating care record:', error);
      throw error;
    }
    
    return newRecord as CareRecord;
  } catch (error) {
    console.error('Error in createCareRecord:', error);
    return null;
  }
};

/**
 * Update an existing care record
 */
export const updateCareRecord = async (
  id: string, 
  data: Partial<CareRecordFormData>
): Promise<CareRecord | null> => {
  try {
    // Format the timestamp to ISO string if it's a Date object
    const timestamp = data.timestamp instanceof Date
      ? data.timestamp.toISOString()
      : data.timestamp;
    
    // Format follow-up date if provided
    const follow_up_date = data.follow_up_date instanceof Date 
      ? data.follow_up_date.toISOString() 
      : data.follow_up_date;
    
    // Create the update object
    const updateData: any = {
      ...data,
      timestamp,
      follow_up_date
    };
    
    const { data: updatedRecord, error } = await supabase
      .from('daily_care_logs')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating care record:', error);
      throw error;
    }
    
    return updatedRecord as CareRecord;
  } catch (error) {
    console.error('Error in updateCareRecord:', error);
    return null;
  }
};

/**
 * Delete a care record
 */
export const deleteCareRecord = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('daily_care_logs')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting care record:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteCareRecord:', error);
    return false;
  }
};

/**
 * Get care record statistics
 */
export const getCareRecordStats = async (
  dogId: string, 
  timeframe: 'day' | 'week' | 'month' = 'day'
) => {
  try {
    // Calculate the start date based on timeframe
    const now = new Date();
    let startDate = new Date();
    
    if (timeframe === 'day') {
      startDate.setHours(0, 0, 0, 0);
    } else if (timeframe === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else if (timeframe === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    }
    
    // Get all care records within the timeframe
    const { data, error } = await supabase
      .from('daily_care_logs')
      .select('*')
      .eq('dog_id', dogId)
      .gte('timestamp', startDate.toISOString())
      .lte('timestamp', now.toISOString());
      
    if (error) {
      console.error('Error fetching care record stats:', error);
      throw error;
    }
    
    // Initialize stats object
    const stats = {
      totalRecords: data.length,
      byCategory: {} as Record<CareCategory, number>,
      byStatus: {
        completed: 0,
        scheduled: 0,
        missed: 0
      },
      completionRate: 0
    };
    
    // Calculate statistics
    data.forEach((record: CareRecord) => {
      // Count by category
      if (stats.byCategory[record.category as CareCategory]) {
        stats.byCategory[record.category as CareCategory]++;
      } else {
        stats.byCategory[record.category as CareCategory] = 1;
      }
      
      // Count by status
      if (record.status) {
        stats.byStatus[record.status as 'completed' | 'scheduled' | 'missed']++;
      } else {
        stats.byStatus.completed++; // Default to completed for backward compatibility
      }
    });
    
    // Calculate completion rate
    const totalStatusRecords = stats.byStatus.completed + stats.byStatus.scheduled + stats.byStatus.missed;
    stats.completionRate = totalStatusRecords > 0 
      ? (stats.byStatus.completed / totalStatusRecords) * 100 
      : 100;
    
    return stats;
  } catch (error) {
    console.error('Error in getCareRecordStats:', error);
    return {
      totalRecords: 0,
      byCategory: {},
      byStatus: {
        completed: 0,
        scheduled: 0,
        missed: 0
      },
      completionRate: 0
    };
  }
};
