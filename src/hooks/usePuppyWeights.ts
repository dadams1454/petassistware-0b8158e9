
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WeightRecord, WeightUnit } from '@/types/puppyTracking';
import { usePuppyDetails } from './usePuppyDetails';

export const usePuppyWeights = (puppyId: string) => {
  const [weights, setWeights] = useState<WeightRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { data: puppy } = usePuppyDetails(puppyId);
  
  useEffect(() => {
    if (!puppyId) return;
    
    const fetchWeights = async () => {
      setIsLoading(true);
      try {
        const { data, error: weightError } = await supabase
          .from('weight_records')
          .select('*')
          .eq('puppy_id', puppyId)
          .order('date', { ascending: true });
          
        if (weightError) throw weightError;
        
        // Transform and add birth date
        const processedWeights: WeightRecord[] = (data || []).map(record => ({
          ...record,
          weight_unit: record.weight_unit as WeightUnit, // Fix type issue
          birth_date: puppy?.birth_date || puppy?.litters?.birth_date  // Add birth_date for components
        }));
        
        setWeights(processedWeights);
      } catch (err) {
        console.error('Error fetching puppy weights:', err);
        setError(err instanceof Error ? err : new Error('Failed to load weights'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWeights();
  }, [puppyId, puppy]);
  
  return {
    weights,
    isLoading,
    error
  };
};
