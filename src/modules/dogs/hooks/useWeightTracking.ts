
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WeightRecord } from '../types/dog';

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
          dogId: record.dog_id,
          weight: record.weight,
          date: record.date,
          unit: record.unit || 'lb',
          notes: record.notes || ''
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

  const addWeightRecord = async (record: Omit<WeightRecord, 'id'>) => {
    try {
      setError(null);
      
      const { data, error } = await supabase
        .from('dog_weights')
        .insert([
          {
            dog_id: record.dogId,
            weight: record.weight,
            date: record.date,
            unit: record.unit,
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
        dogId: data.dog_id,
        weight: data.weight,
        date: data.date,
        unit: data.unit,
        notes: data.notes
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

  return {
    weightHistory,
    isLoading,
    error,
    addWeightRecord,
    weightStats
  };
};
