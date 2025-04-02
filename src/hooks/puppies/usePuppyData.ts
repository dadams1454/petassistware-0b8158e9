
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PuppyWithAge } from '@/types/puppyTracking';
import { differenceInDays, differenceInWeeks } from 'date-fns';

export const usePuppyData = () => {
  const [puppies, setPuppies] = useState<PuppyWithAge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPuppies = async () => {
      setIsLoading(true);
      try {
        // Fetch puppies with related litter data for birth_date fallback
        const { data, error } = await supabase
          .from('puppies')
          .select(`
            *,
            litters:litter_id (
              id,
              litter_name,
              birth_date
            )
          `)
          .order('birth_date', { ascending: false });

        if (error) throw error;

        // Calculate age and enrich data
        const enrichedPuppies: PuppyWithAge[] = data.map(puppy => {
          // Use puppy birth_date if available, otherwise fallback to litter birth_date
          const birthDate = puppy.birth_date || (puppy.litters?.birth_date);
          let age_days = 0;
          let age_weeks = 0;
          let ageDescription = 'Unknown age';

          if (birthDate) {
            const today = new Date();
            const birthDateTime = new Date(birthDate);
            age_days = differenceInDays(today, birthDateTime);
            age_weeks = differenceInWeeks(today, birthDateTime);
            
            if (age_days < 30) {
              ageDescription = `${age_days} days old`;
            } else if (age_weeks < 16) {
              ageDescription = `${age_weeks} weeks old`;
            } else {
              const months = Math.floor(age_days / 30);
              ageDescription = `${months} months old`;
            }
          }

          // Build the enhanced puppy object with calculated age
          return {
            id: puppy.id,
            name: puppy.name || '',
            gender: puppy.gender || '',
            birth_date: birthDate || '',
            color: puppy.color,
            status: puppy.status,
            photo_url: puppy.photo_url,
            litter_id: puppy.litter_id,
            current_weight: puppy.current_weight,
            age_days,
            age_weeks,
            ageInDays: age_days, // Add ageInDays for backward compatibility
            ageInWeeks: age_weeks, // Add ageInWeeks for backward compatibility
            ageDescription,
            litters: puppy.litters,
            created_at: puppy.created_at || '',
            updated_at: puppy.updated_at || '',
          } as PuppyWithAge;
        });

        setPuppies(enrichedPuppies);
      } catch (err) {
        console.error('Error fetching puppies:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchPuppies();
  }, []);

  return { puppies, isLoading, error };
};
