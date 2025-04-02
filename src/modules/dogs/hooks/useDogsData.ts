
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DogProfile } from '../types/dog';

export const useDogsData = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: dogs, isLoading, error, refetch } = useQuery({
    queryKey: ['dogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .order('name');
      
      if (error) {
        toast({
          title: 'Error fetching dogs',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }
      
      return data as DogProfile[];
    },
  });

  const addDog = useMutation({
    mutationFn: async (newDog: Partial<DogProfile>) => {
      const { data, error } = await supabase
        .from('dogs')
        .insert(newDog)
        .select()
        .single();
        
      if (error) throw error;
      return data;
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

  return {
    dogs,
    isLoading,
    error,
    refetch,
    addDog: addDog.mutate,
    isAdding: addDog.isPending,
  };
};
