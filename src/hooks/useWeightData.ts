
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { WeightRecord } from '@/types/puppyTracking';
import { differenceInDays } from 'date-fns';

interface UseWeightDataProps {
  puppyId?: string;
  dogId?: string;
}

export const useWeightData = ({ puppyId, dogId }: UseWeightDataProps) => {
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [stats, setStats] = useState({
    currentWeight: 0,
    averageGrowth: 0,
    weightUnit: 'oz' as const,
    growthRate: 0,
    lastWeekGrowth: 0,
    projectedWeight: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    if (puppyId || dogId) {
      fetchWeightHistory();
    }
  }, [puppyId, dogId]);

  const fetchWeightHistory = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // First get the birth date for calculating age
      let birthDate: string | undefined;
      
      if (puppyId) {
        const { data: puppyData, error: puppyError } = await supabase
          .from('puppies')
          .select('birth_date')
          .eq('id', puppyId)
          .single();
          
        if (puppyError) throw puppyError;
        birthDate = puppyData?.birth_date;
      } else if (dogId) {
        const { data: dogData, error: dogError } = await supabase
          .from('dogs')
          .select('birthdate')
          .eq('id', dogId)
          .single();
          
        if (dogError) throw dogError;
        birthDate = dogData?.birthdate;
      }
      
      if (!birthDate) throw new Error('Birth date not found');
      
      // Now get all weight records
      const idField = puppyId ? 'puppy_id' : 'dog_id';
      const idValue = puppyId || dogId;
      
      const { data, error } = await supabase
        .from('weight_records')
        .select('*')
        .eq(idField, idValue)
        .order('date', { ascending: true });
        
      if (error) throw error;
      
      // Convert string dates to Date objects and add age_days
      const records = (data || []).map((record, index, allRecords) => {
        const weightDate = new Date(record.date);
        const birthDateTime = new Date(birthDate!);
        const age_days = differenceInDays(weightDate, birthDateTime);
        
        // Calculate percentage change from previous record
        let percent_change = null;
        if (index > 0) {
          const prevWeight = allRecords[index - 1].weight;
          const weightDiff = record.weight - prevWeight;
          percent_change = Math.round((weightDiff / prevWeight) * 100);
        }
        
        return {
          ...record,
          age_days,
          birth_date: birthDate,
          percent_change
        } as WeightRecord;
      });
      
      setWeightRecords(records);
      calculateWeightStats(records, birthDate);
    } catch (err) {
      console.error('Error fetching weight history:', err);
      setError(err instanceof Error ? err : new Error('An error occurred fetching weight data'));
      
      toast({
        title: 'Error',
        description: 'Could not load weight history',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateWeightStats = (records: WeightRecord[], birthDate: string) => {
    if (!records.length) return;
    
    // Get current weight (most recent record)
    const mostRecent = records[records.length - 1];
    const currentWeight = mostRecent.weight;
    const weightUnit = mostRecent.weight_unit;
    
    // Calculate average growth per day
    const firstRecord = records[0];
    const lastRecord = records[records.length - 1];
    const totalGrowth = lastRecord.weight - firstRecord.weight;
    const daysDiff = lastRecord.age_days - firstRecord.age_days || 1; // Avoid division by zero
    const averageGrowth = totalGrowth / daysDiff;
    
    // Calculate growth rate (percentage growth per week)
    const growthRate = (averageGrowth * 7 / firstRecord.weight) * 100;
    
    // Calculate last week's growth
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const lastWeekRecords = records.filter(r => new Date(r.date) >= oneWeekAgo);
    let lastWeekGrowth = 0;
    
    if (lastWeekRecords.length > 1) {
      const firstWeekRecord = lastWeekRecords[0];
      const lastWeekRecord = lastWeekRecords[lastWeekRecords.length - 1];
      lastWeekGrowth = lastWeekRecord.weight - firstWeekRecord.weight;
    }
    
    // Calculate projected weight (simple linear projection for next 4 weeks)
    const projectedWeight = currentWeight + (averageGrowth * 28);
    
    setStats({
      currentWeight,
      averageGrowth,
      weightUnit: weightUnit as any,
      growthRate,
      lastWeekGrowth,
      projectedWeight
    });
  };

  const addWeightRecord = async (record: Partial<WeightRecord>) => {
    try {
      const idField = puppyId ? 'puppy_id' : 'dog_id';
      const idValue = puppyId || dogId;
      
      if (!idValue) throw new Error('No puppy or dog ID provided');
      
      // Calculate age if birth date is available 
      let age_days;
      if (record.birth_date && record.date) {
        const recordDate = new Date(record.date);
        const birthDate = new Date(record.birth_date);
        age_days = differenceInDays(recordDate, birthDate);
      }
      
      const { data, error } = await supabase
        .from('weight_records')
        .insert({
          [idField]: idValue,
          weight: record.weight,
          weight_unit: record.weight_unit,
          date: record.date || new Date().toISOString(),
          notes: record.notes,
        })
        .select();
        
      if (error) throw error;
      
      toast({
        title: 'Weight recorded',
        description: 'The weight has been successfully recorded.',
      });
      
      await fetchWeightHistory();
      return data;
    } catch (err) {
      console.error('Error adding weight record:', err);
      toast({
        title: 'Error',
        description: 'Failed to add weight record.',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteWeightRecord = async (id: string) => {
    try {
      const { error } = await supabase
        .from('weight_records')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: 'Weight record deleted',
        description: 'The weight record has been removed.',
      });
      
      await fetchWeightHistory();
    } catch (err) {
      console.error('Error deleting weight record:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete weight record.',
        variant: 'destructive',
      });
    }
  };

  return {
    weightRecords,
    stats,
    isLoading,
    error,
    fetchWeightHistory,
    addWeightRecord,
    deleteWeightRecord
  };
};
