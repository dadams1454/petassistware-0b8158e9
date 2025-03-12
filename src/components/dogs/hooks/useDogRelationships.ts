
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type DogRelationship = {
  id: string;
  dog_id: string;
  related_dog_id: string;
  relationship_type: 'parent' | 'offspring';
  created_at: string;
};

export const useDogRelationships = (dogId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: relationships, isLoading } = useQuery({
    queryKey: ['dogRelationships', dogId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dog_relationships')
        .select(`
          id,
          dog_id,
          related_dog_id,
          relationship_type,
          created_at
        `)
        .or(`dog_id.eq.${dogId},related_dog_id.eq.${dogId}`);

      if (error) throw error;
      return data as DogRelationship[];
    }
  });

  const addRelationship = useMutation({
    mutationFn: async ({ relatedDogId, type }: { relatedDogId: string, type: 'parent' | 'offspring' }) => {
      // If type is 'parent', the related dog is the parent of the current dog
      // If type is 'offspring', the related dog is the offspring of the current dog
      const relationshipData = {
        dog_id: type === 'offspring' ? dogId : relatedDogId,
        related_dog_id: type === 'offspring' ? relatedDogId : dogId,
        relationship_type: type === 'offspring' ? 'offspring' : 'parent'
      };

      const { error } = await supabase
        .from('dog_relationships')
        .insert(relationshipData);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dogRelationships', dogId] });
      toast({
        title: 'Relationship added',
        description: 'The dog relationship has been successfully added.'
      });
    },
    onError: (error) => {
      toast({
        title: 'Error adding relationship',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const removeRelationship = useMutation({
    mutationFn: async (relationshipId: string) => {
      const { error } = await supabase
        .from('dog_relationships')
        .delete()
        .eq('id', relationshipId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dogRelationships', dogId] });
      toast({
        title: 'Relationship removed',
        description: 'The dog relationship has been successfully removed.'
      });
    },
    onError: (error) => {
      toast({
        title: 'Error removing relationship',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  return {
    relationships,
    isLoading,
    addRelationship,
    removeRelationship
  };
};
