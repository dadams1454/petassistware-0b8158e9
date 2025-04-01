
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useBreedingPreparation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [breedingData, setBreedingData] = useState<any>(null);

  const fetchBreedingData = async (dogId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .eq('id', dogId)
        .single();
        
      if (error) throw error;
      
      // You would typically fetch more breeding-related data here
      // For now, just return the basic dog data
      setBreedingData(data);
      return data;
    } catch (err) {
      setError('Failed to fetch breeding data');
      console.error('Error fetching breeding data:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    breedingData,
    fetchBreedingData
  };
};
