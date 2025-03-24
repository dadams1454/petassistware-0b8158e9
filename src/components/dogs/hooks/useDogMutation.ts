
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatDogDataForSubmission } from '../utils/dogFormUtils';
import { DogProfile } from '@/types/dog';

/**
 * Hook to handle dog creation and update mutations
 * @param dog Optional existing dog data for edit mode
 * @param userId Current user's ID
 * @param onSuccess Callback to run after successful mutation
 * @returns Mutation object for creating or updating dogs
 */
export const useDogMutation = (dog: DogProfile | null, userId: string, onSuccess: () => void) => {
  const { toast } = useToast();
  const isEditing = !!dog;

  const createDogMutation = useMutation({
    mutationFn: async (values: any) => {
      if (!userId) throw new Error('You must be logged in');
      
      console.log('Submitting dog form with values:', values);
      console.log('User ID:', userId);
      console.log('Is editing existing dog:', isEditing);
      if (isEditing && dog) {
        console.log('Editing dog with ID:', dog.id);
      }

      const dogData = formatDogDataForSubmission(values, userId);
      
      // Ensure required fields for the DogProfile type are set
      if (!dogData.status) {
        dogData.status = 'active';
      }
      
      if (!dogData.weight_unit && dogData.weight) {
        dogData.weight_unit = 'lbs';
      }

      // Ensure gender is one of the allowed values
      if (dogData.gender && !['male', 'female'].includes(dogData.gender)) {
        dogData.gender = 'male'; // Default to male if invalid value
      }
      
      console.log('Formatted dog data for submission:', dogData);

      try {
        const { data, error } = isEditing && dog
          ? await supabase
              .from('dogs')
              .update(dogData)
              .eq('id', dog.id)
              .select()
          : await supabase
              .from('dogs')
              .insert(dogData)
              .select();

        if (error) {
          console.error('Error saving dog:', error);
          throw new Error(error.message);
        }
        
        console.log('Dog saved successfully:', data);
        return data;
      } catch (error: any) {
        console.error('Exception during dog save:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Mutation completed successfully with data:', data);
      toast({
        title: isEditing ? 'Dog updated' : 'Dog added',
        description: isEditing
          ? 'Dog has been successfully updated'
          : 'New dog has been successfully added',
      });
      onSuccess();
    },
    onError: (error: any) => {
      console.error('Mutation failed with error:', error);
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
