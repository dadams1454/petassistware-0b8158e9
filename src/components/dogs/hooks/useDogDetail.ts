
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DogProfile, DogGender, DogStatus, WeightUnit } from '@/types/dog';

export const useDogDetail = (dogId: string) => {
  const { toast } = useToast();
  
  const { 
    data: dog, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['dog', dogId],
    queryFn: async () => {
      if (!dogId) return null;
      
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .eq('id', dogId)
        .single();
      
      if (error) {
        console.error('Error fetching dog details:', error);
        toast({
          title: 'Failed to load dog details',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }
      
      // Map the returned data to match the DogProfile type with proper type casting
      const mappedDog: DogProfile = {
        id: data.id,
        name: data.name,
        breed: data.breed,
        gender: (data.gender || 'male') as DogGender,
        birthdate: data.birthdate || '',
        color: data.color || '',
        weight: data.weight || 0,
        weight_unit: 'lbs' as WeightUnit,
        registration_number: data.registration_number || undefined,
        registration_organization: undefined,
        microchip_number: data.microchip_number || undefined,
        microchip_location: undefined,
        status: 'active' as DogStatus,
        notes: data.notes || undefined,
        group_ids: undefined,
        owner_id: data.owner_id || undefined,
        sire_id: undefined,
        dam_id: undefined,
        is_pregnant: data.is_pregnant || false,
        last_heat_date: data.last_heat_date || undefined,
        tie_date: data.tie_date || undefined,
        litter_number: data.litter_number || undefined,
        created_at: data.created_at || new Date().toISOString(),
        pedigree: data.pedigree || false,
        requires_special_handling: data.requires_special_handling || false,
        potty_alert_threshold: data.potty_alert_threshold || undefined,
        max_time_between_breaks: data.max_time_between_breaks || undefined,
        vaccination_type: data.vaccination_type || undefined,
        vaccination_notes: data.vaccination_notes || undefined,
        last_vaccination_date: data.last_vaccination_date || undefined,
        photo_url: data.photo_url || undefined
      };
      
      return mappedDog;
    },
    enabled: !!dogId,
  });

  return {
    dog,
    isLoading,
    error,
    refetch,
  };
};
