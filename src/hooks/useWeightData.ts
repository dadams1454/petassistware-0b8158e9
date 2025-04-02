
import { useState, useEffect } from 'react';
import { WeightRecord, WeightUnit } from '@/types/health';
import { getWeightHistory, addWeightRecord } from '@/services/healthService';
import { useToast } from './use-toast';
import { format, differenceInDays } from 'date-fns';

interface UseWeightDataProps {
  dogId?: string;
  puppyId?: string;
  birthDate?: string;
}

export function useWeightData(dogId?: string, puppyId?: string, birthDate?: string) {
  const [weightData, setWeightData] = useState<WeightRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchWeightData = async () => {
    if (!dogId && !puppyId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      let data: WeightRecord[];
      
      if (dogId) {
        data = await getWeightHistory(dogId);
      } else if (puppyId) {
        data = await getWeightHistory(puppyId, true);
      } else {
        data = [];
      }

      // Enrich the data with additional information
      const enrichedData = data.map(record => {
        // Calculate age in days if we have a birth date
        let age_days: number | undefined;
        if (birthDate && record.date) {
          age_days = differenceInDays(new Date(record.date), new Date(birthDate));
        }

        // Format date for display
        const formatted_date = record.date ? format(new Date(record.date), 'MMM d, yyyy') : undefined;

        return {
          ...record,
          age_days,
          formatted_date,
          // Ensure both unit properties are present
          unit: record.unit || record.weight_unit,
          weight_unit: record.weight_unit || record.unit,
        };
      });

      setWeightData(enrichedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching weight data:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      toast({
        title: 'Error',
        description: 'Failed to load weight data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddWeightRecord = async (data: {
    weight: number;
    weight_unit: WeightUnit;
    date: string;
    notes?: string;
    birth_date?: string;
  }) => {
    try {
      const recordToAdd: Partial<WeightRecord> = {
        weight: data.weight,
        weight_unit: data.weight_unit,
        unit: data.weight_unit, // Ensure both properties are set
        date: data.date,
        notes: data.notes,
      };

      if (dogId) {
        recordToAdd.dog_id = dogId;
      } else if (puppyId) {
        recordToAdd.puppy_id = puppyId;
      } else {
        throw new Error('Either dogId or puppyId must be provided');
      }

      await addWeightRecord(recordToAdd as Omit<WeightRecord, 'id' | 'created_at'>);
      
      toast({
        title: 'Success',
        description: 'Weight record added successfully',
      });
      
      // Refresh the data
      fetchWeightData();
      return true;
    } catch (err) {
      console.error('Error adding weight record:', err);
      toast({
        title: 'Error',
        description: 'Failed to add weight record',
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    fetchWeightData();
  }, [dogId, puppyId]);

  return {
    weightData,
    isLoading,
    error,
    addWeightRecord: handleAddWeightRecord,
    refetch: fetchWeightData,
  };
}
