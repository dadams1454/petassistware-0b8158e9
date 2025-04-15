
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { DogProfile } from '../types/dog';
import { fetchDogs, createDog, deleteDog } from '../services/dogService';

export const useDogsData = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { 
    data: dogs, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['dogs'],
    queryFn: async () => {
      try {
        return await fetchDogs();
      } catch (error: any) {
        toast({
          title: 'Error fetching dogs',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }
    },
  });

  const addDog = useMutation({
    mutationFn: async (newDog: Partial<DogProfile>) => {
      return await createDog(newDog);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dogs'] });
      toast({
        title: 'Success',
        description: 'Dog added successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to add dog: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const removeDog = useMutation({
    mutationFn: async (dogId: string) => {
      return await deleteDog(dogId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dogs'] });
      toast({
        title: 'Success',
        description: 'Dog removed successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to remove dog: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  return {
    dogs,
    isLoading,
    error,
    refetch,
    addDog: addDog.mutate,
    isAdding: addDog.isPending,
    removeDog: removeDog.mutate,
    isRemoving: removeDog.isPending,
  };
};
