
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WeightRecord, GrowthStats } from '@/types/health';
import { WeightUnit } from '@/types/common';
import { formatDateToYYYYMMDD } from '@/utils/dateUtils';

interface UseWeightTrackingProps {
  dogId: string;
}

export const useWeightTracking = ({ dogId }: UseWeightTrackingProps) => {
  const queryClient = useQueryClient();
  const [selectedWeight, setSelectedWeight] = useState<WeightRecord | null>(null);

  // Fetch weight history
  const { data: weightHistory = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['dog-weights', dogId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('weight_records')
        .select('*')
        .eq('dog_id', dogId)
        .order('date', { ascending: false });

      if (error) throw error;

      return data.map((record) => ({
        id: record.id,
        dog_id: record.dog_id,
        weight: record.weight,
        date: record.date,
        weight_unit: record.weight_unit as WeightUnit,
        unit: record.weight_unit as WeightUnit,
        notes: record.notes || '',
        created_at: record.created_at,
        // Calculate percent change from previous if available
        percent_change: calculatePercentChange(record, data)
      }));
    },
    enabled: !!dogId
  });

  // Calculate percent change from previous record
  const calculatePercentChange = (record: any, allRecords: any[]): number => {
    // Find previous record by date
    const sortedRecords = [...allRecords].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    const recordIndex = sortedRecords.findIndex(r => r.id === record.id);
    if (recordIndex <= 0) return 0;
    
    const prevRecord = sortedRecords[recordIndex - 1];
    if (!prevRecord) return 0;
    
    // Ensure weights are in same unit
    const currentWeight = record.weight;
    const prevWeight = prevRecord.weight;
    
    if (prevWeight === 0) return 0;
    
    return ((currentWeight - prevWeight) / prevWeight) * 100;
  };

  // Add weight record
  const { mutate: addWeightRecord } = useMutation({
    mutationFn: async (newRecord: Partial<WeightRecord> & { dog_id: string }) => {
      if (!newRecord.date || !newRecord.weight || !newRecord.dog_id) {
        throw new Error('Missing required fields');
      }

      const { data, error } = await supabase
        .from('weight_records')
        .insert({
          dog_id: newRecord.dog_id,
          weight: newRecord.weight,
          weight_unit: newRecord.weight_unit || 'lb',
          date: typeof newRecord.date === 'string' ? newRecord.date : formatDateToYYYYMMDD(newRecord.date as Date),
          notes: newRecord.notes || ''
        })
        .select('*')
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dog-weights', dogId] });
    }
  });

  // Update weight record
  const { mutate: updateWeightRecord } = useMutation({
    mutationFn: async (record: WeightRecord) => {
      const { data, error } = await supabase
        .from('weight_records')
        .update({
          weight: record.weight,
          weight_unit: record.weight_unit,
          date: record.date,
          notes: record.notes || ''
        })
        .eq('id', record.id)
        .select('*')
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dog-weights', dogId] });
      setSelectedWeight(null);
    }
  });

  // Delete weight record
  const { mutate: deleteWeightRecord } = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('weight_records')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dog-weights', dogId] });
    }
  });

  // Calculate growth statistics
  const growthStats = useMemo((): GrowthStats => {
    if (!weightHistory.length) {
      return {
        currentWeight: 0,
        weightUnit: 'lb' as WeightUnit,
        percentChange: 0,
        averageGrowth: 0,
        growthRate: 0,
        averageGrowthRate: 0,
        lastWeekGrowth: 0,
        projectedWeight: 0,
        weightGoal: 0,
        onTrack: false
      };
    }

    const sortedRecords = [...weightHistory].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    const latestRecord = sortedRecords[0];
    const currentWeight = latestRecord.weight;
    const weightUnit = latestRecord.weight_unit;
    
    // Calculate average growth
    let totalGrowth = 0;
    let growthPoints = 0;
    
    if (sortedRecords.length >= 2) {
      for (let i = 0; i < sortedRecords.length - 1; i++) {
        const curr = sortedRecords[i];
        const prev = sortedRecords[i + 1];
        
        const growth = curr.weight - prev.weight;
        if (growth > 0) {
          totalGrowth += growth;
          growthPoints++;
        }
      }
    }
    
    const averageGrowth = growthPoints > 0 ? totalGrowth / growthPoints : 0;
    const growthRate = sortedRecords.length >= 2 
      ? ((currentWeight - sortedRecords[sortedRecords.length - 1].weight) / sortedRecords[sortedRecords.length - 1].weight) * 100
      : 0;
    
    // Weekly growth calculation
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recordsLastWeek = sortedRecords.filter(r => 
      new Date(r.date) >= oneWeekAgo
    );
    
    const lastWeekGrowth = recordsLastWeek.length >= 2 
      ? recordsLastWeek[0].weight - recordsLastWeek[recordsLastWeek.length - 1].weight
      : 0;
    
    // Simple projection based on growth rate
    const projectedWeight = currentWeight * (1 + (growthRate / 100));
    
    return {
      currentWeight,
      weightUnit,
      percentChange: latestRecord.percent_change || 0,
      averageGrowth,
      growthRate,
      averageGrowthRate: growthPoints > 0 ? (totalGrowth / currentWeight) * 100 : 0,
      lastWeekGrowth,
      projectedWeight,
      weightGoal: currentWeight * 1.1, // Simple goal of 10% more than current
      onTrack: growthRate > 0
    };
  }, [weightHistory]);

  // Get the latest weight record
  const getLatestWeight = () => {
    if (!weightHistory.length) return null;
    
    const sortedRecords = [...weightHistory].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    return sortedRecords[0];
  };

  return {
    weightHistory,
    isLoading,
    isError,
    error,
    refetch,
    selectedWeight,
    setSelectedWeight,
    addWeightRecord,
    updateWeightRecord,
    deleteWeightRecord,
    growthStats,
    getLatestWeight
  };
};
