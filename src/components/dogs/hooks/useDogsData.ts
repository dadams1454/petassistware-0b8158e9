
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DogProfile, DogGender, DogStatus, WeightUnit } from '@/types/dog';

export const useDogsData = () => {
  const { toast } = useToast();
  
  const { 
    data: dogs, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['dogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching dogs:', error);
        toast({
          title: 'Failed to load dogs',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }
      
      if (!data || data.length === 0) {
        console.log('No dogs found in the database');
      } else {
        console.log(`Fetched ${data.length} dogs`);
      }
      
      // Map the returned data to match the DogProfile type with proper type casting
      const mappedDogs: DogProfile[] = data?.map(dog => ({
        id: dog.id,
        name: dog.name,
        breed: dog.breed,
        gender: (dog.gender || 'male') as DogGender, // Cast to DogGender with a default
        birthdate: dog.birthdate || '',
        color: dog.color || '',
        weight: dog.weight || 0,
        weight_unit: 'lbs' as WeightUnit, // Default weight unit
        registration_number: dog.registration_number || undefined,
        registration_organization: undefined, // Not in database, set default
        microchip_number: dog.microchip_number || undefined,
        microchip_location: undefined, // Not in database, set default
        status: 'active' as DogStatus, // Cast to DogStatus with a default
        notes: dog.notes || undefined,
        group_ids: undefined, // Not in database, set default
        owner_id: dog.owner_id || undefined,
        sire_id: undefined, // Not in database, set default
        dam_id: undefined, // Not in database, set default
        is_pregnant: dog.is_pregnant || false,
        last_heat_date: dog.last_heat_date || undefined,
        tie_date: dog.tie_date || undefined,
        litter_number: dog.litter_number || undefined,
        created_at: dog.created_at || new Date().toISOString(),
        pedigree: dog.pedigree || false,
        requires_special_handling: dog.requires_special_handling || false,
        potty_alert_threshold: dog.potty_alert_threshold || undefined,
        max_time_between_breaks: dog.max_time_between_breaks || undefined,
        vaccination_type: dog.vaccination_type || undefined,
        vaccination_notes: dog.vaccination_notes || undefined,
        last_vaccination_date: dog.last_vaccination_date || undefined,
        photo_url: dog.photo_url || undefined
      })) || [];
      
      return mappedDogs;
    },
  });

  return {
    dogs,
    isLoading,
    error,
    refetch,
  };
};
