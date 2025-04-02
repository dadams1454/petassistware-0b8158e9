
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PuppyWithAge } from '@/types/puppyTracking';
import { differenceInDays, differenceInWeeks } from 'date-fns';

export const usePuppyDetail = (puppyId: string) => {
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
      try {
        const { data, error } = await supabase
          .from('puppies')
          .select(`
            *,
            litter:litter_id (
              id,
              litter_name,
              birth_date,
              dam_id,
              sire_id,
              sire:sire_id(name),
              dam:dam_id(name)
            )
          `)
          .eq('id', puppyId)
          .single();

        if (error) throw error;

        // Calculate age information
        const birthDate = data.birth_date || data.litter?.birth_date;
        let ageInDays = 0;
        let ageInWeeks = 0;
        let ageDescription = 'Unknown age';

        if (birthDate) {
          const today = new Date();
          const birthDateTime = new Date(birthDate);
          ageInDays = differenceInDays(today, birthDateTime);
          ageInWeeks = differenceInWeeks(today, birthDateTime);
          
          if (ageInDays < 30) {
            ageDescription = `${ageInDays} days old`;
          } else if (ageInWeeks < 16) {
            ageDescription = `${ageInWeeks} weeks old`;
          } else {
            const months = Math.floor(ageInDays / 30);
            ageDescription = `${months} months old`;
          }
        }

        // Build the enhanced puppy object
        const puppyWithAge: PuppyWithAge = {
          ...data,
          ageInDays,
          ageInWeeks,
          ageDescription,
          litters: data.litter
        };

        setData(puppyWithAge);
      } catch (err) {
        console.error('Error fetching puppy details:', err);
        setError(err instanceof Error ? err : new Error('Error fetching puppy details'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchPuppyDetails();
  }, [puppyId]);

  return { data, isLoading, error };
};
