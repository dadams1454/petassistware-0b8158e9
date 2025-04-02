
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Dog, DogProfile } from '../types/dog';

export const useDogData = (dogId: string | undefined) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
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
        toast({
          title: 'Error fetching dog details',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }
      
      return data as DogProfile;
    },
    enabled: !!dogId,
  });

  const updateDog = useMutation({
    mutationFn: async (updatedDog: Partial<Dog>) => {
      if (!dogId) throw new Error('Dog ID is required');
      
      const { data, error } = await supabase
        .from('dogs')
        .update(updatedDog)
        .eq('id', dogId)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dog', dogId] });
      toast({
        title: 'Success',
        description: 'Dog updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to update dog: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const deleteDog = useMutation({
    mutationFn: async () => {
      if (!dogId) throw new Error('Dog ID is required');
      
      const { error } = await supabase
        .from('dogs')
        .delete()
        .eq('id', dogId);
        
      if (error) throw error;
      return dogId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dogs'] });
      toast({
        title: 'Success',
        description: 'Dog deleted successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to delete dog: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  return {
    dog,
    isLoading,
    error,
    refetch,
    updateDog: updateDog.mutate,
    deleteDog: deleteDog.mutate,
    isUpdating: updateDog.isPending,
    isDeleting: deleteDog.isPending,
  };
};
