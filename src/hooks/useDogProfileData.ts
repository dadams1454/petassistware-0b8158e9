
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DogProfile, DogGender, DogStatus, WeightUnit } from '@/types/dog';

export const useDogProfileData = (dogId: string | undefined) => {
  const { toast } = useToast();
  
  const { data: dog, isLoading, error, refetch } = useQuery({
    queryKey: ['dog', dogId],
    queryFn: async () => {
      if (!dogId) return null;
      
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .eq('id', dogId)
        .single();
      
      if (error) {
        toast({
          title: 'Error fetching dog details',
          description: error.message,
          variant: 'destructive',
        });
        throw new Error(error.message);
      }
      
      // Create a properly typed DogProfile object with all required fields
      const dogWithDefaults: DogProfile = {
        id: data.id,
        name: data.name,
        breed: data.breed,
        gender: (data.gender || 'male') as DogGender,
        birthdate: data.birthdate || '',
        color: data.color || '',
        weight: data.weight || 0,
        weight_unit: 'lbs' as WeightUnit, // Default value
        status: 'active' as DogStatus, // Default value
        photo_url: data.photo_url,
        microchip_number: data.microchip_number,
        registration_number: data.registration_number,
        notes: data.notes,
        is_pregnant: data.is_pregnant || false,
        last_heat_date: data.last_heat_date,
        tie_date: data.tie_date,
        litter_number: data.litter_number || 0,
        created_at: data.created_at || new Date().toISOString(),
        pedigree: data.pedigree || false,
        requires_special_handling: data.requires_special_handling || false,
        potty_alert_threshold: data.potty_alert_threshold,
        max_time_between_breaks: data.max_time_between_breaks,
        vaccination_type: data.vaccination_type,
        vaccination_notes: data.vaccination_notes,
        last_vaccination_date: data.last_vaccination_date,
        owner_id: data.owner_id,
        // Provide default values for missing properties
        sire_id: undefined,
        dam_id: undefined,
        registration_organization: undefined,
        microchip_location: undefined,
        group_ids: undefined
      };
      
      return dogWithDefaults;
    },
  });

  return { dog, isLoading, error, refetch };
};
