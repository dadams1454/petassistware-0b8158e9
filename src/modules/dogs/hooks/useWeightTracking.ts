
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WeightRecord, WeightUnit } from '../types/dog';

export const useWeightTracking = (dogId: string) => {
  const [weightHistory, setWeightHistory] = useState<WeightRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeightHistory = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!dogId) {
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('dog_weights')
          .select('*')
          .eq('dog_id', dogId)
          .order('date', { ascending: true });

        if (error) {
          throw error;
        }

        const formattedData: WeightRecord[] = data.map(record => ({
          id: record.id,
          dog_id: record.dog_id,
          weight: record.weight,
          date: record.date,
          weight_unit: record.unit || 'lb',
          unit: record.unit || 'lb', // For backward compatibility
          notes: record.notes || '',
          created_at: record.created_at || new Date().toISOString()
        }));

        setWeightHistory(formattedData);
      } catch (err) {
        console.error('Error fetching weight history:', err);
        setError('Failed to load weight history. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeightHistory();
  }, [dogId]);

  const addWeightRecord = async (record: Omit<WeightRecord, 'id' | 'created_at'>) => {
    try {
      setError(null);
      
      const { data, error } = await supabase
        .from('dog_weights')
        .insert([
          {
            dog_id: record.dog_id,
            weight: record.weight,
            date: record.date,
            unit: record.weight_unit,
            notes: record.notes
          }
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      const newRecord: WeightRecord = {
        id: data.id,
        dog_id: data.dog_id,
        weight: data.weight,
        date: data.date,
        weight_unit: data.unit,
        unit: data.unit,
        notes: data.notes,
        created_at: data.created_at
      };

      setWeightHistory([...weightHistory, newRecord]);
      return newRecord;
    } catch (err) {
      console.error('Error adding weight record:', err);
      setError('Failed to add weight record. Please try again.');
      return null;
    }
  };

  // Calculate statistics with useMemo
  const weightStats = useMemo(() => {
    if (weightHistory.length === 0) {
      return {
        currentWeight: null,
        previousWeight: null,
        weightChange: null,
        averageWeight: null
      };
    }

    const sortedHistory = [...weightHistory].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    const currentWeight = sortedHistory[0];
    const previousWeight = sortedHistory.length > 1 ? sortedHistory[1] : null;
    
    const weightChange = previousWeight 
      ? currentWeight.weight - previousWeight.weight 
      : null;
    
    const totalWeight = weightHistory.reduce((sum, record) => sum + record.weight, 0);
    const averageWeight = totalWeight / weightHistory.length;

    return {
      currentWeight,
      previousWeight,
      weightChange,
      averageWeight
    };
  }, [weightHistory]);

  // Calculate growth stats similar to the hook in /src/hooks/useWeightTracking.ts
  const growthStats = useMemo(() => {
    if (weightHistory.length < 2) {
      return {
        percentChange: 0,
        averageGrowthRate: 0,
        projectedWeight: null,
        weightGoal: null,
        onTrack: null
      };
    }

    // Sort by date, newest first
    const sortedWeights = [...weightHistory].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    // Calculate percent change from previous to current weight
    const current = sortedWeights[0];
    const previous = sortedWeights[1];
    
    const currentWeight = current.weight;
    const previousWeight = previous.weight;
    
    const percentChange = ((currentWeight - previousWeight) / previousWeight) * 100;
    
    // Calculate average growth rate
    let averageGrowthRate = 0;
    if (sortedWeights.length > 2) {
      const growthRates: number[] = [];
      for (let i = 0; i < sortedWeights.length - 1; i++) {
        const current = sortedWeights[i];
        const previous = sortedWeights[i + 1];
        
        const daysBetween = Math.abs(
          (new Date(current.date).getTime() - new Date(previous.date).getTime()) / (1000 * 60 * 60 * 24)
        );
        
        if (daysBetween > 0) {
          const rate = ((current.weight - previous.weight) / previous.weight) / daysBetween * 100;
          growthRates.push(rate);
        }
      }
      
      if (growthRates.length > 0) {
        averageGrowthRate = growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length;
      }
    }
    
    return {
      percentChange,
      averageGrowthRate,
      projectedWeight: null, // Would need more complex modeling
      weightGoal: null, // Would need breed-specific data
      onTrack: null // Need weight goals to determine
    };
  }, [weightHistory]);

  return {
    weightHistory,
    isLoading,
    error,
    addWeightRecord,
    weightStats,
    growthStats
  };
};
