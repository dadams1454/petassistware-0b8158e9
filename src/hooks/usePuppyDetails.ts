
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PuppyWithAge } from '@/types/puppyTracking';

export const usePuppyDetails = (puppyId: string) => {
  const [data, setData] = useState<PuppyWithAge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPuppyDetails = async () => {
      if (!puppyId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch puppy details
        const { data: puppyData, error: puppyError } = await supabase
          .from('puppies')
          .select('*, litters(id, litter_name, birth_date)')
          .eq('id', puppyId)
          .single();

        if (puppyError) throw puppyError;
        
        if (!puppyData) {
          throw new Error('Puppy not found');
        }
        
        // Calculate age in days
        let ageInDays = 0;
        const birthDate = puppyData.birth_date || puppyData.litters?.birth_date;
        
        if (birthDate) {
          const birthDateTime = new Date(birthDate).getTime();
          const now = new Date().getTime();
          ageInDays = Math.floor((now - birthDateTime) / (1000 * 60 * 60 * 24));
        }
        
        // Format data to match PuppyWithAge interface
        const puppyWithAge: PuppyWithAge = {
          id: puppyData.id,
          name: puppyData.name || '',
          litter_id: puppyData.litter_id,
          birth_date: puppyData.birth_date || '',
          gender: puppyData.gender || '',
          color: puppyData.color || '',
          status: puppyData.status || 'Available',
          microchip_number: puppyData.microchip_number,
          ageInDays,
          photo_url: puppyData.photo_url,
          current_weight: puppyData.current_weight,
          weight: puppyData.current_weight ? parseFloat(puppyData.current_weight) : undefined,
          litters: puppyData.litters ? {
            id: puppyData.litters.id,
            name: puppyData.litters.litter_name,
            birth_date: puppyData.litters.birth_date
          } : undefined
        };
        
        setData(puppyWithAge);
      } catch (err) {
        console.error('Error fetching puppy details:', err);
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchPuppyDetails();
  }, [puppyId]);

  return {
    data,
    isLoading,
    error
  };
};
