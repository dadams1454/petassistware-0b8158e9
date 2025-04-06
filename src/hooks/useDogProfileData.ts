
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DogProfile } from '@/types/dog';
import { mapDogProfileFromDB } from '@/lib/mappers/dogMapper';

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
      
      // Use our mapper to get a properly typed DogProfile
      return mapDogProfileFromDB(data);
    },
    enabled: !!dogId
  });

  return { dog, isLoading, error, refetch };
};
