
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PuppyWithAge } from '@/types/puppyTracking';

export const usePuppyData = () => {
  const [puppies, setPuppies] = useState<PuppyWithAge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPuppies = async () => {
      setIsLoading(true);
      try {
        // Get all active litters
        const { data: litters, error: littersError } = await supabase
          .from('litters')
          .select('id, birth_date, litter_name')
          .not('status', 'eq', 'archived');
          
        if (littersError) throw littersError;
        
        // If no litters, return early
        if (!litters || litters.length === 0) {
          setPuppies([]);
          setIsLoading(false);
          return [];
        }
        
        // For each litter, get puppies
        const puppiesPromises = litters.map(async (litter) => {
          const { data: puppiesData, error: puppiesError } = await supabase
            .from('puppies')
            .select('*')
            .eq('litter_id', litter.id);
            
          if (puppiesError) throw puppiesError;
          return puppiesData?.map(puppy => ({
            ...puppy,
            litters: {
              id: litter.id,
              name: litter.litter_name,
              birth_date: litter.birth_date
            }
          })) || [];
        });
        
        const allPuppiesArrays = await Promise.all(puppiesPromises);
        
        // Flatten and process the puppies
        const allPuppies = allPuppiesArrays.flat().map(puppy => {
          // Calculate age in days
          const birthDate = puppy.birth_date || puppy.litters?.birth_date;
          let ageInDays = 0;
          
          if (birthDate) {
            const birthDateTime = new Date(birthDate).getTime();
            const now = new Date().getTime();
            ageInDays = Math.floor((now - birthDateTime) / (1000 * 60 * 60 * 24));
          }
          
          // Ensure gender is properly typed according to PuppyWithAge interface
          const gender = puppy.gender === 'Male' || puppy.gender === 'Female' 
            ? puppy.gender 
            : null;
          
          // Ensure all required properties for PuppyWithAge are included
          return {
            id: puppy.id,
            litter_id: puppy.litter_id,
            name: puppy.name,
            gender: gender,
            color: puppy.color,
            status: puppy.status,
            birth_date: puppy.birth_date,
            current_weight: puppy.current_weight,
            photo_url: puppy.photo_url,
            microchip_number: puppy.microchip_number,
            ageInDays,
            litters: puppy.litters
          } as PuppyWithAge;
        });
        
        setPuppies(allPuppies);
        return allPuppies;
      } catch (err) {
        console.error('Error fetching puppies:', err);
        setError('Failed to load puppies');
        return [];
      } finally {
        setIsLoading(false);
      }
    };

    fetchPuppies();
  }, []);

  return {
    puppies,
    isLoading,
    error
  };
};
