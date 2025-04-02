
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { WeightUnit, WeightRecord } from '@/types/puppyTracking';

export type WeightDataHookResult = {
  weightData: WeightRecord[];
  isLoading: boolean;
  error: Error | null;
  addWeightRecord: (data: {
    weight: number;
    weight_unit: WeightUnit;
    date: string;
    notes?: string;
  }) => Promise<boolean>;
  refetch: () => Promise<void>;
};

export function useWeightData(puppyId?: string, dogId?: string, birthDate?: string): WeightDataHookResult {
  const [weightData, setWeightData] = useState<WeightRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Function to fetch weight records
  const fetchWeightData = async () => {
    try {
      setIsLoading(true);
      
      let query = supabase.from('weight_records').select('*');
      
      if (puppyId) {
        query = query.eq('puppy_id', puppyId);
      } else if (dogId) {
        query = query.eq('dog_id', dogId);
      } else {
        throw new Error('Either puppyId or dogId must be provided');
      }
      
      const { data, error } = await query.order('date', { ascending: true });
      
      if (error) throw error;
      
      // Process the data to add age calculations and formatting
      const processedData: WeightRecord[] = data.map((record) => {
        const birthDateObj = birthDate ? new Date(birthDate) : null;
        const recordDateObj = new Date(record.date);
        
        // Calculate age in days if birth date is available
        const ageDays = birthDateObj 
          ? Math.floor((recordDateObj.getTime() - birthDateObj.getTime()) / (1000 * 60 * 60 * 24)) 
          : undefined;
        
        return {
          ...record,
          weight_unit: record.weight_unit as WeightUnit,
          age_days: ageDays,
          formatted_date: format(recordDateObj, 'MMM d, yyyy')
        } as WeightRecord;
      });
      
      setWeightData(processedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching weight data:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      toast({
        title: 'Error fetching weight data',
        description: err instanceof Error ? err.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new weight record
  const addWeightRecord = async (data: {
    weight: number;
    weight_unit: WeightUnit;
    date: string;
    notes?: string;
  }): Promise<boolean> => {
    try {
      // Create record data with either puppy_id or dog_id
      let recordData: any;
      
      if (puppyId) {
        recordData = { 
          puppy_id: puppyId, 
          dog_id: '00000000-0000-0000-0000-000000000000', // Required field with default
          ...data 
        };
      } else if (dogId) {
        recordData = { 
          dog_id: dogId, 
          ...data 
        };
      } else {
        throw new Error('Either puppyId or dogId must be provided');
      }
      
      const { error } = await supabase.from('weight_records').insert(recordData);
      
      if (error) throw error;
      
      toast({
        title: 'Weight record added',
        description: 'The weight record has been saved successfully.',
      });
      
      // Refetch data to update the list
      await fetchWeightData();
      return true;
    } catch (err) {
      console.error('Error adding weight record:', err);
      toast({
        title: 'Error adding weight record',
        description: err instanceof Error ? err.message : 'Unknown error occurred',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Fetch data on initial load
  useEffect(() => {
    if (puppyId || dogId) {
      fetchWeightData();
    }
  }, [puppyId, dogId]);

  return {
    weightData,
    isLoading,
    error,
    addWeightRecord,
    refetch: fetchWeightData
  };
}
