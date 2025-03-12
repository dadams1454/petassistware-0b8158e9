
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatDogDataForSubmission } from '../utils/dogFormUtils';

/**
 * Hook to handle dog creation and update mutations
 * @param dog Optional existing dog data for edit mode
 * @param userId Current user's ID
 * @param onSuccess Callback to run after successful mutation
 * @returns Mutation object for creating or updating dogs
 */
export const useDogMutation = (dog: any, userId: string, onSuccess: () => void) => {
  const { toast } = useToast();
  const isEditing = !!dog;

  const createDogMutation = useMutation({
    mutationFn: async (values: any) => {
      if (!userId) throw new Error('You must be logged in');

      const dogData = formatDogDataForSubmission(values, userId);

      const { data, error } = isEditing
        ? await supabase
            .from('dogs')
            .update(dogData)
            .eq('id', dog.id)
            .select()
        : await supabase
            .from('dogs')
            .insert(dogData)
            .select();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      toast({
        title: isEditing ? 'Dog updated' : 'Dog added',
        description: isEditing
          ? 'Dog has been successfully updated'
          : 'New dog has been successfully added',
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: isEditing ? 'Error updating dog' : 'Error adding dog',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    createDogMutation,
    isEditing,
  };
};
