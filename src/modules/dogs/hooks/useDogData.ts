
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Dog, DogProfile } from '../types/dog';
import { fetchDogById, updateDog, deleteDog } from '../services/dogService';

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
      
      try {
        return await fetchDogById(dogId);
      } catch (error: any) {
        toast({
          title: 'Error fetching dog details',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }
    },
    enabled: !!dogId,
  });

  const updateDogMutation = useMutation({
    mutationFn: async (updatedDog: Partial<Dog>) => {
      if (!dogId) throw new Error('Dog ID is required');
      return await updateDog(dogId, updatedDog);
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

  const deleteDogMutation = useMutation({
    mutationFn: async () => {
      if (!dogId) throw new Error('Dog ID is required');
      return await deleteDog(dogId);
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
    updateDog: updateDogMutation.mutate,
    deleteDog: deleteDogMutation.mutate,
    isUpdating: updateDogMutation.isPending,
    isDeleting: deleteDogMutation.isPending,
  };
};
