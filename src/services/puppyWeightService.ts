
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow, differenceInDays } from 'date-fns';
import { WeightRecord } from '@/types/puppyTracking';

// Interface for puppy weight records
export interface PuppyWeightRecord {
  id: string;
  puppy_id: string;
  weight: number;
  weight_unit: string;
  date: string;
  age_days?: number;
  notes?: string;
  created_at: string;
}

// Get weight records for a puppy
export const getPuppyWeightRecords = async (puppyId: string): Promise<WeightRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('puppy_weights')
      .select('*')
      .eq('puppy_id', puppyId)
      .order('date', { ascending: false });
      
    if (error) throw error;
    
    // Calculate age in days for each record if birth date is available
    const puppy = await getPuppyBirthDate(puppyId);
    
    return data.map(record => ({
      ...record,
      age_days: puppy?.birth_date 
        ? differenceInDays(new Date(record.date), new Date(puppy.birth_date))
        : undefined,
      unit: record.weight_unit // For backward compatibility
    })) as WeightRecord[];
  } catch (error) {
    console.error('Error fetching puppy weight records:', error);
    return [];
  }
};

// Get puppy birth date
const getPuppyBirthDate = async (puppyId: string) => {
  try {
    const { data, error } = await supabase
      .from('puppies')
      .select('birth_date')
      .eq('id', puppyId)
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching puppy birth date:', error);
    return null;
  }
};

// Add a weight record for a puppy
export const addPuppyWeightRecord = async (record: Partial<PuppyWeightRecord>): Promise<PuppyWeightRecord | null> => {
  try {
    // Get the puppy's birth date to calculate age
    const puppy = await getPuppyBirthDate(record.puppy_id as string);
    
    // Calculate age in days if birth date is available
    const weightRecord = {
      ...record,
      age_days: puppy?.birth_date && record.date
        ? differenceInDays(new Date(record.date), new Date(puppy.birth_date))
        : undefined
    };
    
    const { data, error } = await supabase
      .from('puppy_weights')
      .insert(weightRecord)
      .select()
      .single();
      
    if (error) throw error;
    
    return data as PuppyWeightRecord;
  } catch (error) {
    console.error('Error adding puppy weight record:', error);
    return null;
  }
};

// Update a weight record for a puppy
export const updatePuppyWeightRecord = async (id: string, updates: Partial<PuppyWeightRecord>): Promise<PuppyWeightRecord | null> => {
  try {
    // Get the puppy's birth date to recalculate age if date is being updated
    if (updates.date && updates.puppy_id) {
      const puppy = await getPuppyBirthDate(updates.puppy_id);
      
      if (puppy?.birth_date) {
        updates.age_days = differenceInDays(new Date(updates.date), new Date(puppy.birth_date));
      }
    }
    
    const { data, error } = await supabase
      .from('puppy_weights')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    return data as PuppyWeightRecord;
  } catch (error) {
    console.error('Error updating puppy weight record:', error);
    return null;
  }
};

// Delete a weight record for a puppy
export const deletePuppyWeightRecord = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('puppy_weights')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting puppy weight record:', error);
    return false;
  }
};

// Calculate growth stats based on weight records
export const calculatePuppyGrowthStats = (weights: WeightRecord[]) => {
  if (!weights || weights.length === 0) {
    return {
      currentWeight: 0,
      weightUnit: 'g',
      percentChange: 0,
      averageGrowth: 0,
      growthRate: 0,
      averageGrowthRate: 0,
      lastWeekGrowth: 0,
      projectedWeight: 0,
      weightGoal: null,
      onTrack: null
    };
  }
  
  // Sort weights by date (newest first)
  const sortedWeights = [...weights].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const latestWeight = sortedWeights[0];
  const weightUnit = latestWeight.weight_unit || latestWeight.unit || 'g';
  
  let percentChange = 0;
  let averageGrowth = 0;
  let growthRate = 0;
  let lastWeekGrowth = 0;
  
  if (sortedWeights.length > 1) {
    // Calculate percent change from previous weight
    const previousWeight = sortedWeights[1];
    percentChange = ((latestWeight.weight - previousWeight.weight) / previousWeight.weight) * 100;
    
    // Calculate average daily growth
    const oldestWeight = sortedWeights[sortedWeights.length - 1];
    const daysDiff = differenceInDays(new Date(latestWeight.date), new Date(oldestWeight.date)) || 1;
    const totalGrowth = latestWeight.weight - oldestWeight.weight;
    averageGrowth = totalGrowth / daysDiff;
    
    // Calculate growth rate
    growthRate = (totalGrowth / oldestWeight.weight) * 100;
    
    // Calculate last week's growth
    const weekAgoDate = new Date();
    weekAgoDate.setDate(weekAgoDate.getDate() - 7);
    
    const weekAgoWeights = sortedWeights.filter(w => new Date(w.date) >= weekAgoDate);
    if (weekAgoWeights.length > 1) {
      const latestWeekWeight = weekAgoWeights[0];
      const oldestWeekWeight = weekAgoWeights[weekAgoWeights.length - 1];
      lastWeekGrowth = latestWeekWeight.weight - oldestWeekWeight.weight;
    }
  }
  
  // Estimate projected weight (very simplified projection)
  const projectedWeight = latestWeight.weight + (averageGrowth * 30); // Projected 30 days ahead
  
  return {
    currentWeight: latestWeight.weight,
    weightUnit,
    percentChange,
    averageGrowth,
    growthRate,
    averageGrowthRate: averageGrowth > 0 ? (averageGrowth / latestWeight.weight) * 100 : 0,
    lastWeekGrowth,
    projectedWeight,
    weightGoal: null, // This could be breed-specific target weight
    onTrack: null // This would need breed-specific growth curves to determine
  };
};
